import { Property, Lead, SystemUser } from '../types';
import { apiToProperty, propertyToApi, apiToLead, LEAD_STATUS_TO_API } from './adapters';
import { about } from '../config/site';
import { API_URL } from '../config/api';

const TOKEN_KEY = 'greizy_auth_token';
const USER_KEY = 'greizy_auth_user';

/* ---------------- Sesión ---------------- */

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getStoredUser = (): SystemUser | null => {
  try {
    const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null') as SystemUser | null;
    return user ? { ...user, photo: user.photo || about.photo } : null;
  } catch {
    return null;
  }
};

export const saveSession = (token: string, user: SystemUser) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export class ApiError extends Error {
  status: number;
  details?: any;
  constructor(message: string, status: number, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

/* ---------------- Cliente ---------------- */

interface RequestOptions {
  method?: string;
  body?: any;
  isForm?: boolean;
  auth?: boolean;
}

async function request(path: string, { method = 'GET', body, isForm, auth = true }: RequestOptions = {}) {
  const headers: Record<string, string> = { Accept: 'application/json' };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  if (body && !isForm) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    cache: 'no-store',
    body: isForm ? body : body ? JSON.stringify(body) : undefined
  });

  if (res.status === 204) return null;

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401 && auth) clearSession();
    throw new ApiError(payload?.error?.message || `Error ${res.status}`, res.status, payload?.error?.details);
  }
  return payload;
}

/** El API está disponible. Se usa para decidir si mostrar el aviso de conexión. */
export async function checkHealth(): Promise<{ ok: boolean; database?: string }> {
  try {
    const r = await fetch(`${API_URL}/health`, { cache: 'no-store' });
    const data = await r.json();
    return { ok: data.status === 'ok', database: data.database };
  } catch {
    return { ok: false };
  }
}

/* ---------------- Público ---------------- */

/** Trae todas las propiedades publicadas, paginando hasta agotarlas. */
export async function fetchProperties(): Promise<Property[]> {
  const all: any[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const body = await request(`/properties?limit=60&sort=destacadas&page=${page}`, { auth: false });
    all.push(...(body.data || []));
    totalPages = body.meta?.totalPages || 1;
    page += 1;
  } while (page <= totalPages && page <= 20);

  return all.map(apiToProperty);
}

export async function fetchProperty(slug: string): Promise<Property> {
  const body = await request(`/properties/${encodeURIComponent(slug)}`, { auth: false });
  return apiToProperty(body.data);
}

export async function fetchCatalog() {
  const body = await request('/catalog', { auth: false });
  return body.data as { types: any[]; locations: any[]; amenities: any[]; countries: string[] };
}

/** Envía el formulario de contacto. */
export async function submitLead(payload: {
  name: string;
  email?: string;
  phone?: string;
  message?: string;
  propertySlug?: string | null;
  source?: string;
}) {
  const body = await request('/leads', { method: 'POST', body: payload, auth: false });
  return body.data;
}

/* ---------------- Autenticación ---------------- */

export async function login(email: string, password: string): Promise<SystemUser> {
  const body = await request('/auth/login', { method: 'POST', body: { email, password }, auth: false });
  const u = body.data.user;

  const user: SystemUser = {
    id: String(u.id),
    name: u.name,
    email: u.email,
    roleId: u.role === 'admin' ? 'role-admin' : 'role-editor',
    roleName: u.role === 'admin' ? 'Administrador' : 'Editor',
    photo: about.photo,
    active: true,
    createdAt: new Date().toISOString()
  };

  saveSession(body.data.token, user);
  return user;
}

export async function verifySession(): Promise<SystemUser | null> {
  if (!getToken()) return null;
  try {
    await request('/auth/me');
    return getStoredUser();
  } catch {
    clearSession();
    return null;
  }
}

export const forgotPassword = (email: string) =>
  request('/auth/forgot-password', { method: 'POST', body: { email }, auth: false });

export const changePassword = (currentPassword: string, newPassword: string) =>
  request('/auth/change-password', { method: 'POST', body: { currentPassword, newPassword } });

/* ---------------- Panel ---------------- */

export async function adminFetchProperties(): Promise<Property[]> {
  const body = await request('/admin/properties?limit=60&includeUnpublished=1');
  return (body.data || []).map(apiToProperty);
}

export async function createProperty(p: Partial<Property>, catalog: any): Promise<Property> {
  const body = await request('/admin/properties', { method: 'POST', body: propertyToApi(p, catalog) });
  return apiToProperty(body.data);
}

export async function updateProperty(id: string, p: Partial<Property>, catalog: any): Promise<Property> {
  const body = await request(`/admin/properties/${id}`, { method: 'PATCH', body: propertyToApi(p, catalog) });
  return apiToProperty(body.data);
}

export const deleteProperty = (id: string) => request(`/admin/properties/${id}`, { method: 'DELETE' });

export const publishProperty = (id: string, isPublished: boolean) =>
  request(`/admin/properties/${id}`, { method: 'PATCH', body: { isPublished: isPublished ? 1 : 0 } });

/**
 * Sube todas las fotos de una vez.
 * El API conserva el orden de envío: el primer archivo queda como portada
 * y el resto forma la galería.
 */
export async function uploadImages(propertyId: string, files: File[]): Promise<Property> {
  const form = new FormData();
  files.forEach((file) => form.append('images', file));
  const body = await request(`/admin/media/properties/${propertyId}/images`, {
    method: 'POST',
    body: form,
    isForm: true
  });
  return apiToProperty(body.data);
}

export const deleteImage = (imageId: number) =>
  request(`/admin/media/images/${imageId}`, { method: 'DELETE' });

export async function reorderImages(propertyId: string, imageIds: number[]): Promise<Property> {
  const body = await request(`/admin/media/properties/${propertyId}/order`, {
    method: 'PATCH',
    body: { imageIds }
  });
  return apiToProperty(body.data);
}

export async function adminFetchLeads(): Promise<Lead[]> {
  const body = await request('/admin/leads?limit=60');
  return (body.data || []).map(apiToLead);
}

export const updateLeadStatus = (id: string, status: Lead['status']) =>
  request(`/admin/leads/${id}`, { method: 'PATCH', body: { status: LEAD_STATUS_TO_API[status] } });

/* ---------------- Usuarios del panel ---------------- */

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  roleName: string;
  isActive: boolean;
  createdAt: string;
}

const toApiUser = (u: any): ApiUser => ({
  id: String(u.id),
  name: u.name,
  email: u.email,
  role: u.role,
  roleName: u.roleName,
  isActive: Boolean(u.isActive),
  createdAt: u.createdAt
});

export async function fetchUsers(): Promise<ApiUser[]> {
  const body = await request('/admin/users?limit=60');
  return (body.data || []).map(toApiUser);
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor';
}): Promise<ApiUser> {
  const body = await request('/admin/users', { method: 'POST', body: input });
  return toApiUser(body.data);
}

export async function updateUser(
  id: string,
  input: Partial<{ name: string; email: string; role: 'admin' | 'editor'; isActive: boolean; password: string }>
): Promise<ApiUser> {
  const body = await request(`/admin/users/${id}`, { method: 'PATCH', body: input });
  return toApiUser(body.data);
}

export const deleteUser = (id: string) => request(`/admin/users/${id}`, { method: 'DELETE' });
