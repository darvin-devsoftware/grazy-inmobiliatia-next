/**
 * Fuente única de la URL del API.
 *
 * Antes estaba duplicada: `api.ts` apuntaba al dominio de producción y
 * `adapters.ts` a `/api`. Como `adapters.ts` es quien arma las URLs de las
 * imágenes, las fotos se resolvían contra el dominio del front y salían rotas.
 *
 * Desarrollo:  crea `.env.local` con VITE_API_URL=http://localhost:4000/api
 * Producción:  sin variable, usa PRODUCTION_API_URL.
 */

const PRODUCTION_API_URL = 'https://back-endinmo.furrixempire.com/api';

export const API_URL = (import.meta.env.VITE_API_URL || PRODUCTION_API_URL).replace(/\/$/, '');

/** Origen del servidor, sin el sufijo /api. Se usa para las imágenes de /uploads. */
export const API_ORIGIN = API_URL.replace(/\/api$/, '');

/** Convierte una ruta relativa devuelta por el API en URL absoluta. */
export function absoluteUrl(url?: string | null): string {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;

  // Las fotos de la carpeta public/ del front no pasan por el API
  if (url.startsWith('/propiedades/') || url.startsWith('/brand/')) return url;

  return `${API_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}

export default { API_URL, API_ORIGIN, absoluteUrl };
