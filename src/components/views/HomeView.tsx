import React, { useState } from 'react';
import { Property, ViewType } from '../../types';
import {
  Search,
  MapPin,
  Heart,
  Award,
  Shield,
  TrendingUp,
  Sparkles,
  KeyRound,
  CheckCircle2,
  MessageSquare,
  Mail
} from 'lucide-react';

interface HomeViewProps {
  properties: Property[];
  onNavigate: (view: ViewType, propertyId?: string) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onOpenContactModal: (property?: Property) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  properties,
  onNavigate,
  savedIds,
  onToggleSave,
  onOpenContactModal
}) => {
  const [activeTab, setActiveTab] = useState<'Comprar' | 'Alquilar'>('Comprar');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [propertyType, setPropertyType] = useState('Todos los Tipos');

  // Featured 3 properties for grid
  const featuredProperties = properties.filter(p => p.isFeatured).slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('listings');
  };

  return (
    <div className="space-y-20 pb-16">

      {/* ----------------- HERO SECTION ----------------- */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gray-900">

        {/* Full-width Luxury Property Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/propiedades/jacobo-majluta/exterior.jpg"
            alt="Fondo Inmueble de Lujo"
            className="w-full h-full object-cover object-center transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071B33] via-[#071B33]/60 to-[#071B33]/30" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white space-y-8 pt-12 pb-16">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-widest text-[#F7FAFC]">
            <KeyRound className="w-3.5 h-3.5 text-[#7A8AA3]" />
            <span>Greizy González • Asesoría de Excelencia</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins tracking-tight leading-tight max-w-4xl mx-auto text-white drop-shadow-md">
            Encuentra la Llave a tu <span className="italic font-serif font-normal text-[#F7FAFC]">Nuevo Hogar</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
            Propiedades exclusivas, villas en la playa y penthouses guiados por Greizy y el equipo experto de Greizy González.
          </p>

          {/* Prominent Search Bar Component */}
          <div className="max-w-3xl mx-auto bg-white rounded-lg p-3 sm:p-4 shadow-2xl border border-[#DBE3EE] text-[#1F2937] text-left">

            {/* Tabs: COMPRAR, ALQUILAR */}
            <div className="flex border-b border-gray-200 px-2 mb-3 space-x-4">
              {(['COMPRAR', 'ALQUILAR'] as const).map((tab) => {
                const isSelected = (tab === 'COMPRAR' && activeTab === 'Comprar') || (tab === 'ALQUILAR' && activeTab === 'Alquilar');
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      const tabValue = tab === 'COMPRAR' ? 'Comprar' : 'Alquilar';
                      setActiveTab(tabValue);
                    }}
                    className={`pb-2 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all ${isSelected
                      ? 'text-[#03459C] border-b-2 border-[#03459C]'
                      : 'text-gray-400 hover:text-[#1F2937]'
                      }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Search Input Controls */}
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center">

              {/* Keyword / Location */}
              <div className="sm:col-span-5 relative px-2">
                <label className="block text-[10px] uppercase font-bold text-[#7A8AA3]">Ubicación o Palabra Clave</label>
                <div className="relative mt-0.5">
                  <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A8AA3]" />
                  <input
                    type="text"
                    placeholder="Punta Cana, Bel Air, Ciudad o Sector..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full pl-5 pr-2 py-1 text-xs sm:text-sm text-gray-800 outline-none placeholder-gray-300"
                  />
                </div>
              </div>

              {/* Property Type Dropdown */}
              <div className="sm:col-span-3 relative px-2 border-t sm:border-t-0 sm:border-l border-gray-200">
                <label className="block text-[10px] uppercase font-bold text-[#7A8AA3]">Tipo de Inmueble</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full py-1 text-xs sm:text-sm bg-transparent outline-none text-gray-800 cursor-pointer"
                >
                  <option>Todos los Tipos</option>
                  <option>Villa Frente al Mar</option>
                  <option>Penthouse</option>
                  <option>Residencia Moderna</option>
                  <option>Casa Familiar</option>
                </select>
              </div>

              {/* Action Button */}
              <div className="sm:col-span-4">
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-[#03459C] hover:bg-[#023277] text-white font-bold text-xs sm:text-sm uppercase tracking-widest rounded-md shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <Search className="w-4 h-4" />
                  <span>Buscar Propiedades</span>
                </button>
              </div>

            </form>
          </div>

          {/* Quick Stats Banner under hero */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-8 text-xs text-gray-300 font-medium">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7A8AA3]" />
              <span>Más de 15 años ejerciendo el derecho</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#7A8AA3]" />
              <span>Garantía Legal & Asesoría Transparente</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#7A8AA3]" />
              <span>Asesoría con respaldo jurídico</span>
            </div>
          </div>

        </div>
      </section>

      {/* ----------------- FEATURED LISTINGS GRID ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DBE3EE] pb-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-[#1F2937]">
              Propiedades Destacadas
            </h2>
            <div className="h-1 w-12 bg-[#7A8AA3]" />
          </div>

          <button
            onClick={() => onNavigate('listings')}
            className="text-xs font-bold uppercase text-[#03459C] tracking-widest border-b-2 border-[#03459C] pb-0.5 hover:text-[#023277] hover:border-[#023277] transition-colors self-start md:self-auto"
          >
            Ver Todo el Catálogo
          </button>
        </div>

        {/* 3-Column Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => {
            const isSaved = savedIds.includes(property.id);
            return (
              <div
                key={property.id}
                className="luxury-card group flex flex-col overflow-hidden bg-white rounded-lg border border-[#DBE3EE] hover:shadow-xl transition-all duration-300"
              >

                {/* Property Hero Image with Badge & Favorite Trigger */}
                <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                  <img
                    src={property.heroImage}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#03459C] text-white rounded-md shadow-xs">
                      {property.type}
                    </span>
                    {property.isHotListing && (
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#7A8AA3] text-white rounded-md shadow-xs">
                        Destacado
                      </span>
                    )}
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={() => onToggleSave(property.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-red-500 shadow-md transition-colors"
                    title={isSaved ? 'Quitar de guardados' : 'Guardar propiedad'}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  {/* Price Banner */}
                  <div className="absolute bottom-3 left-3 bg-[#071B33]/90 backdrop-blur-xs px-3 py-1.5 rounded-md text-white">
                    <span className="text-lg font-bold font-poppins">
                      ${property.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Card Info */}
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

                  {/* Actions */}
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
                      <span className="hidden sm:inline">Contacto</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* ----------------- WHY GREIZY GONZÁLEZ (QUICK TRUST) ----------------- */}
      <section className="bg-[#EEF3F8] py-16 border-y border-[#DBE3EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7A8AA3]">
              La Distinción Greizy González
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-[#1F2937]">
              Por qué Elegirnos para tu Inversión
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Cada operación se acompaña con revisión jurídica: títulos, contratos y cierre notarial. Asesoría respaldada por QBrokers Real Estate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="bg-white p-8 rounded-xl border border-[#DBE3EE] shadow-sm text-center space-y-4 hover:border-[#7A8AA3] transition-all">
              <div className="w-14 h-14 bg-[#E6F1FA] rounded-full flex items-center justify-center mx-auto text-[#03459C]">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold font-poppins text-[#1F2937]">1. Escucha y Diligencia</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Escuchamos qué buscas, en qué plazo y con qué presupuesto, y te presentamos las opciones que de verdad encajan.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-xl border border-[#DBE3EE] shadow-sm text-center space-y-4 hover:border-[#7A8AA3] transition-all">
              <div className="w-14 h-14 bg-[#EEF3F8] rounded-full flex items-center justify-center mx-auto text-[#7A8AA3]">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold font-poppins text-[#1F2937]">2. Transparencia Absoluta</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Estilo de negocio seguro y confiable respaldado por los fundamentos legales de Greizy González.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-xl border border-[#DBE3EE] shadow-sm text-center space-y-4 hover:border-[#7A8AA3] transition-all">
              <div className="w-14 h-14 bg-[#E6F1FA] rounded-full flex items-center justify-center mx-auto text-[#03459C]">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold font-poppins text-[#1F2937]">3. Pasión por el Cierre</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Nuestra mayor nota de 10 es ver tu alegría al recibir las llaves de tu nuevo hogar.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ----------------- CALL TO ACTION BANNER ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#071B33] rounded-2xl p-8 sm:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl border border-[#7A8AA3]/40 relative overflow-hidden">

          <div className="space-y-3 z-10 max-w-2xl text-center lg:text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7A8AA3]">
              Asesoría Personalizada Greizy & Greizy González
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-poppins">
              ¿Listo para dar el siguiente paso hacia tu hogar ideal?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Conversemos sobre tu próxima inversión. Te respondo personalmente.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 z-10 w-full lg:w-auto">
            <button
              onClick={() => onOpenContactModal()}
              className="px-6 py-3 text-sm font-semibold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-lg text-center transition-all shadow-md flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Chatear por WhatsApp</span>
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 text-sm font-semibold text-[#F7FAFC] bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-center transition-all flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Enviar Mensaje Directo</span>
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
