import React from 'react';
import { MessageSquare } from 'lucide-react';
import { contact } from '../../config/site';

interface FloatingWhatsAppProps {
  onOpenContactModal?: () => void;
  phone?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  onOpenContactModal,
  phone = contact.whatsapp
}) => {
  const handleClick = () => {
    if (onOpenContactModal) {
      onOpenContactModal();
    } else {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const msg = encodeURIComponent('Hola Greizy, me gustaría recibir asesoría sobre las propiedades de Greizy González.');
      window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center group">
      {/* Tooltip on hover */}
      <div className="hidden sm:flex items-center mr-3 px-3.5 py-1.5 bg-[#071B33] text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-[#25D366]/40">
        <span className="w-2 h-2 rounded-full bg-[#25D366] mr-2 animate-ping" />
        ¡Habla con Greizy por WhatsApp!
      </div>

      {/* Floating Button */}
      <button
        onClick={handleClick}
        className="relative p-3 sm:p-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center focus:outline-none ring-4 ring-[#25D366]/30"
        aria-label="Contacto directo por WhatsApp"
        title="Contacto directo por WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-white" />
      </button>
    </div>
  );
};
