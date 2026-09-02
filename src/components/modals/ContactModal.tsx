import React, { useState } from 'react';
import { Property, Agent } from '../../types';
import { X, MessageSquare, Mail, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { submitLead } from '../../lib/api';
import { contact as siteContact, waLink } from '../../config/site';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property | null;
  agent?: Agent | null;
  onAddLead?: (lead: { name: string; email: string; phone: string; interest: string; message: string; propertyTitle?: string }) => void;
  onSubmitLead?: (lead: any) => Promise<void> | void;
  onSuccess: (msg: string) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  property,
  agent,
  onAddLead,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(
    property ? `Hola Greizy, me interesa recibir más detalles de "${property.title}" por $${property.price.toLocaleString()}.` : 'Hola, me gustaría recibir asesoría sobre las propiedades y servicios de Greizy González.'
  );
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email'>('whatsapp');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const whatsappPhone = siteContact.whatsapp;
  const defaultEmail = agent?.email || siteContact.email;

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hola Greizy González! ${property ? `Deseo información sobre ${property.title} ($${property.price.toLocaleString()})` : 'Deseo solicitar asesoría inmobiliaria con Greizy.'}`
    );
    window.open(`https://wa.me/${whatsappPhone}?text=${text}`, '_blank');
    onSuccess('Redirigiendo a chat de WhatsApp...');
    onClose();
  };

  /** Envía el mensaje al API. Queda registrado en la bandeja del panel. */
  const handleEmailDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Escribe tu nombre.');
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setErrorMsg('Déjanos un correo o un teléfono para poder responderte.');
      return;
    }

    setSubmitted(true);
    try {
      await submitLead({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        message,
        propertySlug: property?.slug || null,
        source: property ? 'ficha-propiedad' : 'web'
      });

      onSuccess('¡Mensaje enviado! Te responderemos a la brevedad.');
      setName('');
      setEmail('');
      setPhone('');
      onClose();
    } catch (err) {
      setErrorMsg(
        'No pudimos enviar el mensaje. Escríbenos por WhatsApp mientras lo revisamos.'
      );
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#DBE3EE] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#071B33] text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A8AA3]">
              Contacto Confidencial • Greizy & Greizy González
            </span>
            <h3 className="text-lg font-bold font-poppins text-white">
              {property ? `Consulta por ${property.title}` : 'Hablar con Asesor Inmobiliario'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection: WhatsApp vs Email */}
        <div className="flex border-b border-[#DBE3EE] bg-[#F7FAFC]">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'whatsapp'
                ? 'border-b-2 border-[#25D366] text-[#128C7E] bg-white'
                : 'text-gray-500 hover:text-[#1F2937]'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#25D366]" />
            <span>WhatsApp Directo</span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'email'
                ? 'border-b-2 border-[#03459C] text-[#03459C] bg-white'
                : 'text-gray-500 hover:text-[#1F2937]'
            }`}
          >
            <Mail className="w-4 h-4 text-[#03459C]" />
            <span>Mensaje por Correo</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'whatsapp' ? (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center mx-auto border border-[#25D366]/30">
                <MessageSquare className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold font-poppins text-[#1F2937]">
                  Consulta Inmediata por WhatsApp
                </h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                  Chatea directamente con Greizy o un asesor oficial en WhatsApp. Recibe folletos digitales, recorridos en video y coordina visitas con absoluta rapidez.
                </p>
              </div>

              {property && (
                <div className="p-3 bg-[#F7FAFC] rounded-xl border border-[#DBE3EE] text-left flex items-center gap-3">
                  <img src={property.heroImage} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <h5 className="text-xs font-bold text-[#1F2937] line-clamp-1">{property.title}</h5>
                    <p className="text-xs font-semibold text-[#03459C]">${property.price.toLocaleString()}</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleWhatsAppDirect}
                className="w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Abrir Chat de WhatsApp</span>
              </button>

              <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#03459C]" />
                <span>WhatsApp Oficial Greizy González (+1 800-592-7653)</span>
              </p>
            </div>
          ) : (
            <div>
              {submitted ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#03459C] mx-auto animate-bounce" />
                  <h4 className="text-base font-bold text-[#1F2937]">Mensaje Enviado con Éxito</h4>
                  <p className="text-xs text-gray-600">
                    Nos comunicaremos al correo <strong>{email}</strong> a la brevedad.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEmailDirect} className="space-y-4">
              {errorMsg && (
                <p role="alert" className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                  {errorMsg}
                </p>
              )}

                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. María Rodríguez"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#F7FAFC] border border-[#DBE3EE] rounded-lg focus:outline-none focus:border-[#03459C]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="cliente@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-[#F7FAFC] border border-[#DBE3EE] rounded-lg focus:outline-none focus:border-[#03459C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (800) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-[#F7FAFC] border border-[#DBE3EE] rounded-lg focus:outline-none focus:border-[#03459C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                      Mensaje *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#F7FAFC] border border-[#DBE3EE] rounded-lg focus:outline-none focus:border-[#03459C]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#03459C] hover:bg-[#023277] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Correo Directo</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
