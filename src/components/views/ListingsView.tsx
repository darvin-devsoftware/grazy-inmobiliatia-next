import React, { useState, useMemo } from 'react';
import { Property, SearchFilters, ViewType } from '../../types';
import { 
  Search, 
  Filter, 
  Grid, 
  Map as MapIcon, 
  Heart, 
  MapPin, 
  X, 
  SlidersHorizontal,
  MessageSquare
} from 'lucide-react';

interface ListingsViewProps {
  properties: Property[];
  onNavigate: (view: ViewType, propertyId?: string) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onOpenContactModal: (property?: Property) => void;
}

export const ListingsView: React.FC<ListingsViewProps> = ({
  properties,
  onNavigate,
  savedIds,
  onToggleSave,
  onOpenContactModal
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedMapProperty, setSelectedMapProperty] = useState<Property | null>(null);

  // Filters State
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    status: 'All',
    propertyType: 'All',
    minPrice: 0,
    maxPrice: 30000000,
    bedrooms: 'any',
    bathrooms: 'any',
    neighborhood: 'All',
    amenities: [],
    sortBy: 'featured'
  });

  const availableTypes = useMemo(
    () => Array.from(new Set(properties.map((property) => property.type))).sort(),
    [properties]
  );

  const availableAmenities = useMemo(
    () => Array.from(new Set(properties.flatMap((property) => property.amenities))).sort(),
    [properties]
  );

  const availableNeighborhoods = useMemo(
    () => ['Todos', ...Array.from(new Set(properties.map((property) => property.neighborhood).filter(Boolean))).sort()],
    [properties]
  );

  // Filter Logic
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Keyword
      if (filters.keyword.trim()) {
        const kw = filters.keyword.toLowerCase();
        const matches = 
          p.title.toLowerCase().includes(kw) ||
          p.city.toLowerCase().includes(kw) ||
          p.neighborhood.toLowerCase().includes(kw) ||
          p.address.toLowerCase().includes(kw);
        if (!matches) return false;
      }

      // Status
      if (filters.status === 'Buy' && p.status !== 'En Venta') return false;
      if (filters.status === 'Rent' && p.status !== 'En Alquiler') return false;

      // Property Type
      if (filters.propertyType !== 'All' && p.type !== filters.propertyType) return false;

      // Price Range
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;

      // Bedrooms
      if (filters.bedrooms !== 'any' && p.bedrooms < Number(filters.bedrooms)) return false;

      // Bathrooms
      if (filters.bathrooms !== 'any' && p.bathrooms < Number(filters.bathrooms)) return false;

      // Neighborhood
      if (filters.neighborhood !== 'All' && filters.neighborhood !== 'Todos' && p.neighborhood !== filters.neighborhood) return false;

      if (filters.amenities.length && !filters.amenities.every((amenity) => p.amenities.includes(amenity))) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'sqft-desc') return b.sqft - a.sqft;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [properties, filters]);

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter(a => a !== amenity) : [...prev.amenities, amenity]
      };
    });
  };

  const resetFilters = () => {
    setFilters({
      keyword: '',
      status: 'All',
      propertyType: 'All',
      minPrice: 0,
      maxPrice: 30000000,
      bedrooms: 'any',
      bathrooms: 'any',
      neighborhood: 'All',
      amenities: [],
      sortBy: 'featured'
    });
  };

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      
      {/* HEADER BANNER */}
      <section className="bg-[#071B33] text-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7A8AA3]">
            Catálogo Exclusivo • Greizy González
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold font-poppins text-white mt-1">
            Inventario Inmobiliario
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1">
            Mostrando {filteredProperties.length} propiedades seleccionadas según tus criterios
          </p>
        </div>

        {/* View Toggle (Grid vs Interactive Map) */}
        <div className="flex items-center gap-2 bg-gray-800 p-1 rounded-lg border border-gray-700">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              viewMode === 'grid'
                ? 'bg-[#03459C] text-white shadow-xs'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Vista Cuadrícula</span>
          </button>

          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              viewMode === 'map'
                ? 'bg-[#03459C] text-white shadow-xs'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>Mapa Interactivo</span>
          </button>
        </div>
      </section>

      {/* MAIN CONTAINER (SEARCH BAR + SIDEBAR + GRID/MAP) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Quick Search & Sort Bar */}
        <div className="bg-white p-4 rounded-xl border border-[#DBE3EE] shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8AA3]" />
            <input
              type="text"
              placeholder="Buscar dirección, ciudad o sector..."
              value={filters.keyword}
              onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#F7FAFC] border border-[#DBE3EE] rounded-lg focus:outline-none focus:border-[#03459C]"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto md:justify-end">
            
            {/* Mobile Filter Drawer Trigger */}
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="lg:hidden flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold border border-[#DBE3EE] rounded-lg text-[#1F2937] hover:bg-[#F7FAFC]"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#03459C]" />
              <span>Filtros ({filters.amenities.length + (filters.bedrooms !== 'any' ? 1 : 0)})</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
              <span className="text-gray-500 font-medium whitespace-nowrap">Ordenar por:</span>
              <select
                value={filters.sortBy}
                onChange={(e: any) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="min-w-0 flex-1 sm:flex-none px-3 py-2 bg-[#F7FAFC] border border-[#DBE3EE] rounded-lg text-xs font-semibold text-[#1F2937] focus:outline-none focus:border-[#03459C]"
              >
                <option value="featured">Destacadas Primero</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="sqft-desc">Área: Mayor M²</option>
              </select>
            </div>

          </div>

        </div>

        {/* 2-COLUMN LAYOUT: SIDEBAR (DESKTOP) & CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* DESKTOP COLLAPSIBLE FILTER SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-xl border border-[#DBE3EE] shadow-xs space-y-6 sticky top-24">
            
            <div className="flex items-center justify-between border-b border-[#DBE3EE] pb-3">
              <h3 className="font-bold font-poppins text-sm text-[#1F2937] flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-[#03459C]" />
                <span>Filtros</span>
              </h3>
              <button
                onClick={resetFilters}
                className="text-[10px] font-semibold text-[#7A8AA3] hover:text-[#03459C] uppercase tracking-wider"
              >
                Restablecer
              </button>
            </div>

            {/* Listing Status Tabs */}
            <div>
              <label className="block text-xs font-bold text-[#1F2937] mb-1.5">Modalidad</label>
              <div className="grid grid-cols-3 gap-1 bg-[#F7FAFC] p-1 rounded-lg border border-[#DBE3EE]">
                {(['All', 'Buy', 'Rent'] as const).map((st) => {
                  const label = st === 'All' ? 'Todos' : st === 'Buy' ? 'Comprar' : 'Alquilar';
                  return (
                    <button
                      key={st}
                      onClick={() => setFilters(prev => ({ ...prev, status: st }))}
                      className={`py-1.5 text-[11px] font-semibold rounded-md transition-all ${
                        filters.status === st
                          ? 'bg-[#03459C] text-white shadow-2xs'
                          : 'text-gray-600 hover:text-[#03459C]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs font-bold text-[#1F2937] mb-1">Tipo de Inmueble</label>
              <select
                value={filters.propertyType}
                onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-[#F7FAFC] border border-[#DBE3EE] rounded-lg focus:outline-none focus:border-[#03459C]"
              >
                <option value="All">Todos los Tipos</option>
                {availableTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Neighborhood */}
            <div>
              <label className="block text-xs font-bold text-[#1F2937] mb-1">Ubicación / Sector</label>
              <select
                value={filters.neighborhood}
                onChange={(e) => setFilters(prev => ({ ...prev, neighborhood: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-[#F7FAFC] border border-[#DBE3EE] rounded-lg focus:outline-none focus:border-[#03459C]"
              >
                {availableNeighborhoods.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Price Max Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#1F2937]">
                <span>Límite Precio Máx</span>
                <span className="text-[#03459C] font-poppins">${(filters.maxPrice / 1000000).toFixed(1)}M</span>
              </div>
              <input
                type="range"
                min={5000000}
                max={30000000}
                step={1000000}
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                className="w-full accent-[#03459C] cursor-pointer"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-xs font-bold text-[#1F2937] mb-1.5">Habitaciones Mínimas</label>
              <div className="flex gap-1">
                {['any', 3, 4, 5, 6].map((num) => (
                  <button
                    key={String(num)}
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, bedrooms: num as any }))}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                      filters.bedrooms === num
                        ? 'border-[#03459C] bg-[#03459C] text-white'
                        : 'border-[#DBE3EE] bg-[#F7FAFC] text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {num === 'any' ? 'Todas' : `${num}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities Checkboxes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1F2937]">Características y Amenidades</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {availableAmenities.map((amenity) => {
                  const checked = filters.amenities.includes(amenity);
                  return (
                    <label key={amenity} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-black">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAmenity(amenity)}
                        className="accent-[#03459C] rounded-xs"
                      />
                      <span>{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>

          </aside>

          {/* MAIN PROPERTY AREA (GRID VS INTERACTIVE MAP) */}
          <main className="lg:col-span-9 space-y-6">
            
            {filteredProperties.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl border border-[#DBE3EE] space-y-3">
                <Search className="w-10 h-10 text-[#7A8AA3] mx-auto" />
                <h3 className="text-base font-bold text-[#1F2937]">No hay propiedades con ese criterio</h3>
                <p className="text-xs text-gray-500">Prueba ajustando los filtros o palabras clave.</p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#03459C] text-white text-xs font-semibold rounded-md mt-2"
                >
                  Restablecer Filtros
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => {
                  const isSaved = savedIds.includes(property.id);
                  return (
                    <div
                      key={property.id}
                      className="luxury-card group flex flex-col overflow-hidden bg-white rounded-lg border border-[#DBE3EE] hover:shadow-xl transition-all duration-300"
                    >
                      
                      {/* Hero Image */}
                      <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                        <img
                          src={property.heroImage}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#03459C] text-white rounded-md shadow-xs">
                            {property.type}
                          </span>
                        </div>

                        <button
                          onClick={() => onToggleSave(property.id)}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-red-500 shadow-md transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>

                        <div className="absolute bottom-3 left-3 bg-[#071B33]/90 backdrop-blur-xs px-3 py-1.5 rounded-md text-white">
                          <span className="text-base font-bold font-poppins">
                            ${property.price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Card Details */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h3 className="font-poppins font-bold text-lg text-[#1F2937] group-hover:text-[#03459C] transition-colors line-clamp-1">
                            {property.title}
                          </h3>
                          <p className="text-xs text-[#7A8AA3] mb-2 uppercase tracking-wide font-semibold line-clamp-1">
                            {property.city}, {property.state || 'CA'}
                          </p>
                          <div className="flex justify-between items-center pt-1">
                            <div className="text-[#03459C] font-bold text-lg font-poppins">
                              ${property.price.toLocaleString()}
                            </div>
                            <div className="flex space-x-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                              <span>{property.bedrooms} HAB</span>
                              <span>•</span>
                              <span>{property.bathrooms} BAÑOS</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => onNavigate('property-detail', property.id)}
                            className="flex-1 py-2 text-xs font-semibold text-[#03459C] bg-[#E6F1FA] hover:bg-[#03459C] hover:text-white rounded-md text-center transition-colors"
                          >
                            Ver Detalles
                          </button>
                          <button
                            onClick={() => onOpenContactModal(property)}
                            className="px-3 py-2 text-xs font-medium text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-md transition-colors flex items-center gap-1 shadow-xs"
                            title="Contactar con Asesor"
                          >
                            <MessageSquare className="w-3.5 h-3.5 fill-white" />
                          </button>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              /* INTERACTIVE MAP VIEW */
              <div className="bg-slate-900 rounded-xl overflow-hidden border border-[#DBE3EE] h-[650px] relative flex flex-col">
                <div className="relative flex-1 bg-slate-800 flex items-center justify-center overflow-hidden">
                  <img
                    src="/propiedades/jacobo-majluta/piscina.jpg"
                    alt="Mapa Interactivo"
                    className="w-full h-full object-cover opacity-50"
                  />

                  {/* Property Location Pins */}
                  <div className="absolute inset-0 p-8 grid grid-cols-2 md:grid-cols-3 gap-6 items-center justify-center">
                    {filteredProperties.map((prop) => (
                      <button
                        key={prop.id}
                        onClick={() => setSelectedMapProperty(prop)}
                        className={`p-2 bg-[#071B33] text-white rounded-lg shadow-2xl border transition-all transform hover:scale-110 flex items-center gap-2 ${
                          selectedMapProperty?.id === prop.id ? 'border-[#03459C] ring-2 ring-[#03459C]' : 'border-[#7A8AA3]'
                        }`}
                      >
                        <MapPin className="w-4 h-4 text-[#7A8AA3]" />
                        <div className="text-left">
                          <p className="text-[10px] font-bold truncate max-w-[100px]">{prop.title}</p>
                          <p className="text-[11px] font-extrabold text-[#F7FAFC]">${(prop.price / 1000000).toFixed(1)}M</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Selected Map Property Overlay Drawer */}
                  {selectedMapProperty && (
                    <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96 bg-white p-4 rounded-xl shadow-2xl border border-[#DBE3EE] space-y-3 animate-slideUp z-20">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-[#03459C] bg-[#E6F1FA] px-2 py-0.5 rounded-md">
                          {selectedMapProperty.type}
                        </span>
                        <button onClick={() => setSelectedMapProperty(null)} className="p-1 text-gray-400 hover:text-black">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex gap-3 items-center">
                        <img src={selectedMapProperty.heroImage} alt={selectedMapProperty.title} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-[#1F2937] truncate">{selectedMapProperty.title}</h4>
                          <p className="text-[10px] text-gray-500 truncate">{selectedMapProperty.address}</p>
                          <p className="text-sm font-bold text-[#03459C] mt-1">${selectedMapProperty.price.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => onNavigate('property-detail', selectedMapProperty.id)}
                          className="flex-1 py-1.5 bg-[#03459C] text-white text-xs font-semibold rounded-md"
                        >
                          Ver Detalles
                        </button>
                        <button
                          onClick={() => onOpenContactModal(selectedMapProperty)}
                          className="px-3 py-1.5 bg-[#25D366] text-white text-xs font-semibold rounded-md flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5 fill-white" />
                          <span>Contacto</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

          </main>

        </div>
      </section>

      {/* MOBILE SLIDE-OUT FILTER DRAWER */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xs h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between ml-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-sm text-[#1F2937]">Filtros</h3>
                <button onClick={() => setFilterDrawerOpen(false)} className="p-1 text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold mb-1">Modalidad</label>
                <div className="grid grid-cols-3 gap-1 bg-[#F7FAFC] p-1 rounded-md">
                  {(['All', 'Buy', 'Rent'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setFilters(prev => ({ ...prev, status: st }))}
                      className={`py-1 text-xs font-semibold rounded-md ${filters.status === st ? 'bg-[#03459C] text-white' : 'text-gray-600'}`}
                    >
                      {st === 'All' ? 'Todos' : st === 'Buy' ? 'Comprar' : 'Alquilar'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Precio Máx</span>
                  <span className="text-[#03459C]">${(filters.maxPrice / 1000000).toFixed(1)}M</span>
                </div>
                <input
                  type="range"
                  min={5000000}
                  max={30000000}
                  step={1000000}
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                  className="w-full accent-[#03459C]"
                />
              </div>
            </div>

            <button
              onClick={() => setFilterDrawerOpen(false)}
              className="w-full py-3 bg-[#03459C] text-white font-bold text-xs rounded-lg"
            >
              Aplicar Filtros ({filteredProperties.length} Resultados)
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
