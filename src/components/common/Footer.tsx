import React, { useState } from 'react';
import { ViewType } from '../../types';
import { Logo } from './Logo';
import { Mail, Phone, MapPin, ArrowRight, Instagram, Linkedin, Facebook, Twitter, User } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: ViewType) => void;
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onShowToast }) => {
  const [emailInput, setEmailInput] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    onShowToast('Gracias por suscribirte a los boletines privados de Greizy González.', 'success');
    setEmailInput('');
  };

  return (
    <footer className="bg-[#071B33] text-white pt-16 pb-12 border-t border-[#7A8AA3]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-700/80">

          {/* Col 1 & 2: Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <Logo variant="light" size="lg" />
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              Abogada y asesora de inversiones inmobiliarias en República Dominicana. Cada operación
              se acompaña con revisión jurídica: títulos, contratos y cierre notarial. Asesora
              asociada a QBrokers Real Estate y CEO de Inversiones Aragua SRL.
            </p>

            {/* Newsletter Subscription */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7A8AA3]">
                Boletín Privado de Oportunidades
              </span>
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2 sm:gap-0 max-w-md">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Ingresa tu correo electrónico..."
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-800/90 text-sm text-white border border-gray-700 rounded-md sm:rounded-r-none focus:outline-none focus:border-[#03459C] placeholder-gray-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#03459C] hover:bg-[#022F70] text-white text-sm font-medium rounded-md sm:rounded-l-none flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Suscribirme</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#7A8AA3] font-poppins">
              Propiedades y Servicios
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <button onClick={() => onNavigate('listings')} className="hover:text-white transition-colors">
                  Todas las propiedades
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('listings')} className="hover:text-white transition-colors">
                  Propiedades destacadas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">
                  Asesoría inmobiliaria
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">
                  Blindaje jurídico de la compra
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">
                  Estructuración de inversiones
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Corporate & Admin Portal */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#7A8AA3] font-poppins">
              La Firma
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Sobre mí
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">
                  Servicios
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-dashboard')} className="hover:text-[#7A8AA3] transition-colors text-white font-bold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#7A8AA3]" />
                  <span>Iniciar Sesión</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contacto Asesor
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Offices */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#7A8AA3] font-poppins">
              Oficinas Principales
            </h4>
            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#7A8AA3] flex-shrink-0 mt-0.5" />
                <span>Santo Domingo, República Dominicana</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#7A8AA3] flex-shrink-0" />
                <span>(809) 499-5808</span>
              </div>
              <div className="flex items-start gap-2 min-w-0">
                <Mail className="w-4 h-4 text-[#7A8AA3] flex-shrink-0" />
                <span className="min-w-0 break-all">greizygonzalez.inmobiliaria@gmail.com</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a href="#instagram" className="p-2 bg-gray-800 hover:bg-[#03459C] rounded-full text-gray-300 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#linkedin" className="p-2 bg-gray-800 hover:bg-[#03459C] rounded-full text-gray-300 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#facebook" className="p-2 bg-gray-800 hover:bg-[#03459C] rounded-full text-gray-300 hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#twitter" className="p-2 bg-gray-800 hover:bg-[#03459C] rounded-full text-gray-300 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] uppercase tracking-widest font-bold text-[#7A8AA3] gap-4">
          <p>© 2026 GREIZY GONZÁLEZ. TODOS LOS DERECHOS RESERVADOS.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#privacy" className="hover:text-[#03459C] transition-colors">Política de Privacidad</a>
            <a href="#terms" className="hover:text-[#03459C] transition-colors">Términos de Servicio</a>
            <a href="#disclaimer" className="hover:text-[#03459C] transition-colors">Aviso Legal</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
