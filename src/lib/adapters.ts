import { Property, ListingStatus, PropertyType, Lead } from '../types';
import { absoluteUrl } from '../config/api';

/**
 * Traducción entre el modelo del API (snake_case, orientado a base de datos)
 * y el modelo del front (camelCase, orientado a la interfaz).
 *
 * Toda la conversión vive aquí: si mañana cambia el API, solo se toca
 * este archivo y ningún componente se entera.
 */

export { absoluteUrl };

/* ---------------- API → Front ---------------- */

const OPERATION_TO_STATUS: Record<string, ListingStatus> = {
  venta: 'En Venta',
  alquiler: 'En Alquiler',
  venta_alquiler: 'En Venta'
};

const STATUS_OVERRIDE: Record<string, ListingStatus> = {
  reservada: 'Reservada',
  vendida: 'Vendida',
  alquilada: 'Vendida'
};

const TYPE_BY_SLUG: Record<string, PropertyType> = {
  casa: 'Casa',
  apartamento: 'Apartamento',
  penthouse: 'Penthouse',
  villa: 'Villa',
  solar: 'Solar',
  'local-comercial': 'Local Comercial',
  oficina: 'Oficina',
  proyecto: 'Proyecto'
};

export function apiToProperty(api: any): Property {
  const images: string[] = (api.images || []).map((img: any) => absoluteUrl(img.url));
  const cover = absoluteUrl(api.cover?.url) || images[0] || '';

  // La primera imagen (índice 0) es siempre la portada; el resto es la galería.
  const heroImage = cover;
  const galleryImages = images.length ? images : cover ? [cover] : [];

  const sqft = Number(api.areaBuilt ?? api.areaLand ?? 0);
  const price = Number(api.price ?? 0);

  const status: ListingStatus =
    STATUS_OVERRIDE[api.status] || OPERATION_TO_STATUS[api.operation] || 'En Venta';

  return {
    id: String(api.id),
    slug: api.slug,
    reference: api.reference || undefined,
    title: api.title,
    summary: api.summary ?? null,
    address: api.address || api.sector || '',
    city: api.location?.name || '',
    state: api.location?.country || undefined,
    neighborhood: api.sector || api.location?.name || '',
    price,
    rentPricePerMonth: api.operation === 'alquiler' ? price : undefined,
    type: TYPE_BY_SLUG[api.type?.slug] || 'Casa',
    status,
    bedrooms: Number(api.bedrooms ?? 0),
    bathrooms: Number(api.bathrooms ?? 0),
    halfBathrooms: Number(api.halfBathrooms ?? 0),
    sqft,
    yearBuilt: Number(api.yearBuilt ?? 0),
    garageSpaces: Number(api.parking ?? 0),
    lotSize: api.areaLand ? `${api.areaLand} m²` : '—',
    heroImage,
    galleryImages,
    description: api.description || '',
    amenities: (api.amenities || []).map((a: any) => a.name),
    isFeatured: Boolean(api.isFeatured),
    isHotListing: Boolean(api.isFeatured),
    agentId: 'greizy',
    coordinates: api.coords || { lat: 18.4861, lng: -69.9312 },
    virtualTourUrl: api.tourUrl || api.videoUrl || undefined,
    pricePerSqFt: sqft > 0 ? Math.round(price / sqft) : 0,
    legalStatus: api.legal?.status,
    legalNotes: api.legal?.notes ?? null
  };
}

/* ---------------- Front → API ---------------- */

const SLUG_BY_TYPE: Record<string, string> = Object.fromEntries(
  Object.entries(TYPE_BY_SLUG).map(([slug, name]) => [name, slug])
);

const STATUS_TO_API: Record<ListingStatus, { operation: string; status: string }> = {
  'En Venta': { operation: 'venta', status: 'disponible' },
  'En Alquiler': { operation: 'alquiler', status: 'disponible' },
  Reservada: { operation: 'venta', status: 'reservada' },
  Vendida: { operation: 'venta', status: 'vendida' }
};

/**
 * Prepara el cuerpo para crear o actualizar una propiedad.
 * typeIds y locationIds se resuelven contra el catálogo del API.
 */
export function propertyToApi(
  p: Partial<Property>,
  catalog?: { types?: any[]; locations?: any[]; amenities?: any[] }
): Record<string, any> {
  const mapped = p.status ? STATUS_TO_API[p.status] : undefined;

  const typeSlug = p.type ? SLUG_BY_TYPE[p.type] : undefined;
  const typeId = catalog?.types?.find((t) => t.slug === typeSlug)?.id;

  const locationId = catalog?.locations?.find(
    (l) => l.name?.toLowerCase() === String(p.city || '').toLowerCase()
  )?.id;

  const amenityIds = (p.amenities || [])
    .map((name) => catalog?.amenities?.find((a) => a.name === name)?.id)
    .filter((id): id is number => typeof id === 'number');

  const body: Record<string, any> = {
    title: p.title,
    summary: p.summary ?? null,
    description: p.description ?? null,
    reference: p.reference ?? null,
    operation: mapped?.operation,
    status: mapped?.status,
    price: p.price ?? null,
    bedrooms: p.bedrooms ?? null,
    bathrooms: p.bathrooms ?? null,
    parking: p.garageSpaces ?? null,
    areaBuilt: p.sqft ?? null,
    yearBuilt: p.yearBuilt || null,
    sector: p.neighborhood ?? null,
    address: p.address ?? null,
    isFeatured: p.isFeatured ? 1 : 0,
    legalStatus: p.legalStatus,
    legalNotes: p.legalNotes ?? null,
    tourUrl: p.virtualTourUrl ?? null
  };

  if (typeId) body.typeId = typeId;
  if (locationId) body.locationId = locationId;
  if (amenityIds.length) body.amenityIds = amenityIds;

  // El API rechaza claves con undefined
  Object.keys(body).forEach((k) => body[k] === undefined && delete body[k]);
  return body;
}

export function apiToLead(api: any): Lead {
  const STATUS: Record<string, Lead['status']> = {
    nuevo: 'New',
    contactado: 'Contacted',
    en_proceso: 'Contacted',
    cerrado: 'Closed',
    descartado: 'Dead Lead'
  };

  return {
    id: String(api.id),
    name: api.name,
    email: api.email || '',
    phone: api.phone || '',
    interest: api.property?.title || 'Consulta general',
    message: api.message || '',
    propertyTitle: api.property?.title,
    status: STATUS[api.status] || 'New',
    createdAt: api.createdAt,
    agentAssigned: undefined
  };
}

export const LEAD_STATUS_TO_API: Record<Lead['status'], string> = {
  New: 'nuevo',
  Contacted: 'contactado',
  Closed: 'cerrado',
  'Dead Lead': 'descartado'
};
