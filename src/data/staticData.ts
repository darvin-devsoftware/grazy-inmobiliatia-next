import { Agent } from '../types';
import { about, contact } from '../config/site';

/**
 * Datos estáticos de la marca.
 *
 * Las propiedades, contactos, usuarios y sesión se leen del API
 * (ver src/lib/api.ts). Aquí solo vive el perfil de la asesora,
 * que es contenido institucional fijo definido en src/config/site.ts.
 */

export const AGENTS: Agent[] = [
  {
    id: 'greizy',
    name: about.name,
    title: about.role,
    email: contact.email,
    phone: contact.phoneDisplay,
    photo: about.photo,
    experienceYears: 15,
    activeListingsCount: 0,
    soldVolume: '—',
    languages: ['Español'],
    bio: about.paragraphs.join(' '),
    specialties: [
      'Asesoría inmobiliaria',
      'Blindaje jurídico de la compra',
      'Estructuración de inversiones'
    ],
    rating: 5,
    reviewCount: 0,
    role: 'Admin'
  }
];
