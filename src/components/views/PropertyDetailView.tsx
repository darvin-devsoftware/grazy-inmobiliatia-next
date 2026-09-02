import React, { useState } from 'react';
import { about } from '../../config/site';
import { Property, Agent, ViewType } from '../../types';
import { 
  Bed, 
  Bath, 
  Maximize2, 
  MapPin, 
  Calendar, 
  Heart, 
  Share2, 
  Check, 
  ShieldCheck, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Car,
  FileText
} from 'lucide-react';

interface PropertyDetailViewProps {
  property: Property;
  agent?: Agent;
  onNavigate: (view: ViewType, propertyId?: string) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenScheduleTour: (property: Property) => void;
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

export const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({
  property,
  agent,
  onNavigate,
  isSaved,
  onToggleSave,
  onOpenScheduleTour,
  onShowToast
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  const images = property.galleryImages.length > 0 ? property.galleryImages : [property.heroImage];
  const agentName = agent?.name || 'Asesor Encargado';
  const agentInitials = agentName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'A';

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      onShowToast(`Consulta enviada a ${agent ? agent.name : 'Asesor Encargado'}.`, 'success');
      setInquiryMsg('');
      setInquirySent(false);
    }, 1200);
  };

  const translatedStatus = property.status === 'For Sale' ? 'En Venta' : property.status === 'For Rent' ? 'En Alquiler' : property.status;

  return (
    <div className="space-y-12 pb-16 animate-fadeIn">
      
      {/* TOP NAVIGATION BACK BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => onNavigate('listings')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-[#03459C] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo de Propiedades</span>
        </button>
      </div>

      {/* HERO IMAGE GALLERY / SLIDER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        <div className="relative aspect-16/9 md:aspect-21/9 rounded-2xl overflow-hidden bg-gray-900 shadow-2xl border border-[#DBE3EE]">
          <img
            src={images[selectedImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover transition-all duration-500"
          />

          {/* Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Floating Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => onToggleSave(property.id)}
              className="p-2.5 bg-white/90 hover:bg-white text-gray-700 hover:text-red-500 rounded-full shadow-lg transition-colors"
              title={isSaved ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              onClick={() => {
                const shareUrl = `${window.location.origin}${window.location.pathname}?property=${property.id}`;
                navigator.clipboard?.writeText(shareUrl);
                onShowToast('Enlace copiado al portapapeles', 'info');
              }}
              className="p-2.5 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-lg transition-colors"
              title="Compartir propiedad"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                  selectedImageIndex === idx ? 'border-[#03459C] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

      </section>

      {/* 2-COLUMN CONTENT: DETAILS (LEFT) & STICKY SIDEBAR (RIGHT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: SPECS, DESCRIPTION, AMENITIES */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Title & Header Specs */}
            <div className="space-y-3 border-b border-[#DBE3EE] pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-[#03459C] text-white text-xs font-bold uppercase rounded-md">
                  {property.type}
                </span>
                <span className="px-3 py-1 bg-[#7A8AA3] text-white text-xs font-bold uppercase rounded-md">
                  {translatedStatus}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold font-poppins text-[#1F2937]">
                {property.title}
              </h1>

              <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#7A8AA3]" />
                <span>{property.address}, {property.city} ({property.neighborhood})</span>
              </p>

              <div className="pt-2">
                <span className="text-3xl font-extrabold font-poppins text-[#03459C]">
                  ${property.price.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  (${property.pricePerSqFt}/m²)
                </span>
              </div>
            </div>

            {/* KEY SPECS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white rounded-xl border border-[#DBE3EE] text-center">
              <div className="space-y-1">
                <Bed className="w-5 h-5 text-[#7A8AA3] mx-auto" />
                <p className="text-xs text-gray-500">Habitaciones</p>
                <p className="text-base font-bold text-[#1F2937]">{property.bedrooms}</p>
              </div>

              <div className="space-y-1 border-l border-[#DBE3EE]">
                <Bath className="w-5 h-5 text-[#7A8AA3] mx-auto" />
                <p className="text-xs text-gray-500">Baños</p>
                <p className="text-base font-bold text-[#1F2937]">{property.bathrooms}</p>
              </div>

              <div className="space-y-1 border-l border-[#DBE3EE]">
                <Maximize2 className="w-5 h-5 text-[#7A8AA3] mx-auto" />
                <p className="text-xs text-gray-500">Área Construida</p>
                <p className="text-base font-bold text-[#1F2937]">{property.sqft.toLocaleString()} m²</p>
              </div>

              <div className="space-y-1 border-l border-[#DBE3EE]">
                <Car className="w-5 h-5 text-[#7A8AA3] mx-auto" />
                <p className="text-xs text-gray-500">Parqueos</p>
                <p className="text-base font-bold text-[#1F2937]">{property.garageSpaces}</p>
              </div>
            </div>

            {/* FULL DESCRIPTION */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold font-poppins text-[#1F2937]">
                Descripción General y Detalles
              </h3>
              <div
                className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: property.description }}
              />
            </div>

            {/* AMENITIES LIST */}
            <div className="space-y-4 pt-4 border-t border-[#DBE3EE]">
              <h3 className="text-lg font-bold font-poppins text-[#1F2937]">
                Amenidades y Características Exclusivas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#DBE3EE]">
                    <div className="w-6 h-6 rounded-full bg-[#F7FAFC] border border-[#7A8AA3] flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-[#7A8AA3]" />
                    </div>
                    <span className="text-xs font-medium text-[#1F2937]">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>



          </div>

          {/* RIGHT: STICKY SIDEBAR WITH AGENT CARD & TOUR CTA */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            
            {/* STICKY AGENT CONTACT CARD & TOUR CTA */}
            <div className="bg-white p-6 rounded-2xl border border-[#DBE3EE] shadow-xl space-y-6">
              
              <div className="flex items-center gap-4 border-b border-[#DBE3EE] pb-4">
                <div
                  aria-label={`Perfil de ${agentName}`}
                  className="w-16 h-16 rounded-full bg-[#03459C] text-white text-lg font-bold flex items-center justify-center border border-[#022F70] flex-shrink-0"
                >
                  {agentInitials}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#7A8AA3] uppercase tracking-wider">Asesor Encargado</span>
                  <h4 className="font-bold font-poppins text-sm text-[#1F2937]">{agent ? agent.name : about.name}</h4>
                  <p className="text-[11px] text-gray-500">{agent ? agent.title : 'Especialista Senior en Propiedades'}</p>
                </div>
              </div>

              {/* PRIMARY TOUR BUTTON */}
              <button
                onClick={() => onOpenScheduleTour(property)}
                className="w-full py-3 bg-[#03459C] hover:bg-[#022F70] text-white font-bold text-xs sm:text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar Visita Guiada</span>
              </button>

              {/* Quick Contact Form */}
              <form onSubmit={handleSendInquiry} className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-[#1F2937]">
                  Enviar Mensaje Directo al Asesor
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Deseo más información sobre esta propiedad o agendar un recorrido en video..."
                  value={inquiryMsg}
                  onChange={(e) => setInquiryMsg(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F7FAFC] border border-[#DBE3EE] rounded-lg focus:outline-none focus:border-[#03459C]"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#7A8AA3] hover:bg-[#64748B] text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Enviar Mensaje Privado
                </button>
              </form>

              <div className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#03459C]" />
                <span>Comunicación Cifrada y Confidencial</span>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
