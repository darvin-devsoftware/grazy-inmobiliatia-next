export type ViewType = 
  | 'home'
  | 'about'
  | 'services'
  | 'contact'
  | 'listings'
  | 'property-detail'
  | 'admin-dashboard';

export type PropertyType = 'Casa' | 'Apartamento' | 'Penthouse' | 'Villa' | 'Solar' | 'Local Comercial' | 'Oficina' | 'Proyecto';
export type ListingStatus = 'En Venta' | 'En Alquiler' | 'Reservada' | 'Vendida';

export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state?: string;
  neighborhood: string;
  price: number;
  rentPricePerMonth?: number;
  type: PropertyType;
  status: ListingStatus;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  yearBuilt: number;
  garageSpaces: number;
  lotSize: string;
  heroImage: string;
  galleryImages: string[];
  description: string;
  amenities: string[];
  isFeatured?: boolean;
  isHotListing?: boolean;
  agentId: string;
  coordinates: { lat: number; lng: number };
  virtualTourUrl?: string;
  pricePerSqFt: number;
  /** Slug para la URL y para pedir la ficha al API */
  slug?: string;
  /** Referencia interna visible en la ficha */
  reference?: string;
  /** Estatus documental: el diferenciador del negocio */
  legalStatus?: 'titulo_verificado' | 'en_proceso' | 'no_verificado';
  legalNotes?: string | null;
  /** Resumen corto para las tarjetas */
  summary?: string | null;
  halfBathrooms?: number;
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  photo: string;
  experienceYears: number;
  activeListingsCount: number;
  soldVolume: string;
  languages: string[];
  bio: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  role?: 'Admin' | 'Standard Agent';
}

export interface BlogArticle {
  id: string;
  title: string;
  category: 'Market Trends' | 'Luxury Living' | 'Seller Guides' | 'Architecture & Design';
  excerpt: string;
  content: string;
  readTime: string;
  publishDate: string;
  authorName: string;
  authorRole: string;
  heroImage: string;
  featured?: boolean;
}

export interface SearchFilters {
  keyword: string;
  status: 'All' | 'Buy' | 'Rent';
  propertyType: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number | 'any';
  bathrooms: number | 'any';
  neighborhood: string;
  amenities: string[];
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'sqft-desc';
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  propertyTitle?: string;
  status: 'New' | 'Contacted' | 'Dead Lead' | 'Closed';
  createdAt: string;
  agentAssigned?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  type: 'property' | 'lead' | 'agent' | 'system';
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: {
    canManageProperties: boolean;
    canManageUsers: boolean;
    canManageRoles: boolean;
    canManageAgents: boolean;
  };
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  photo: string;
  phone?: string;
  title?: string;
  active: boolean;
  createdAt: string;
}

