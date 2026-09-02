import React, { useState } from 'react';
import { contact } from '../../config/site';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ChevronDown,
  Send,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';

interface ContactViewProps {
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

const SPANISH_FAQS = [
  {
    question: "¿Cómo funciona el proceso de asesoría personalizada con Greizy?",
    answer: "Primero conversamos sin compromiso para entender tus expectativas, presupuesto y plazos. Después preseleccionamos las opciones que encajan y revisamos la situación legal de cada inmueble antes de cualquier visita o separación."
  },
  {
    question: "¿Qué tipo de garantías legales ofrece Greizy González?",
    answer: "Operamos con el respaldo legal y estructural de Greizy González, garantizando contratos transparentes, depósitos en cuentas de pliego (escrow) y acompañamiento en todo el cierre notarial."
  },
  {
    question: "¿Puedo invertir desde el extranjero (EE.UU., Europa, etc.)?",
    answer: "¡Absolutamente! Contamos con amplia experiencia asesorando a compradores e inversionistas internacionales, brindando opciones de financiamiento y asesoría remota paso a paso."
  },
  {
    question: "¿Cómo puedo solicitar una valoración de mi propiedad?",
    answer: "Puedes enviarnos un mensaje con los datos básicos de tu inmueble o utilizar la sección de Servicios para obtener un estimado analítico inmediato."
  }
];

export const ContactView: React.FC<ContactViewProps> = ({ onShowToast }) => {
  // Contact Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('Comprar Propiedad');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onShowToast('Mensaje recibido. Greizy o un asesor de Greizy González se pondrá en contacto a la brevedad.', 'success');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setSubmitted(false);
    }, 1200);
  };

  return (
    <div className="space-y-16 pb-16 animate-fadeIn">

      {/* HEADER */}
      <section className="bg-[#071B33] text-white py-16 px-4 sm:px-6 lg:px-8 text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#7A8AA3]">
          Atención personal y confidencial
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-poppins text-white">
          Contacto Directo • Greizy González
        </h1>
        <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-light">
          Ponte en contacto con Greizy y nuestro equipo para visitas privadas, consultas de inversión o valoraciones de propiedades.
        </p>
      </section>

      {/* SPLIT LAYOUT (50/50) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* LEFT SIDE: CLEAN CONTACT FORM */}
          <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#DBE3EE] shadow-xl space-y-6">

            <div className="space-y-1 border-b border-[#DBE3EE] pb-4">
              <span className="text-[10px] font-bold text-[#7A8AA3] uppercase tracking-widest">
                Comunicación Directa
              </span>
              <h2 className="text-2xl font-bold font-poppins text-[#1F2937]">
                Envíanos tu Consulta
              </h2>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#03459C] mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-[#1F2937]">Solicitud Recibida</h3>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Gracias por tu mensaje. Nos comunicaremos contigo en breve con la calidez y privacidad que te mereces.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Maria Rodríguez / Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7FAFC] border border-[#DBE3EE] rounded-lg focus:outline-none focus:border-[#03459C]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="correo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7FAFC] border border-[#DBE3EE] rounded-lg focus:outline-none focus:border-[#03459C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(809) 499-5808"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7FAFC] border border-[#DBE3EE] rounded-lg focus:outline-none focus:border-[#03459C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                    Área de Interés *
                  </label>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7FAFC] border border-[#DBE3EE] rounded-lg focus:outline-none focus:border-[#03459C] text-gray-700"
                  >
                    <option>Comprar Propiedad</option>
                    <option>Vender Inmueble</option>
                    <option>Inversión en Punta Cana / Caribe</option>
                    <option>Alquiler Residencial de Lujo</option>
                    <option>Asesoría en Préstamos e Hipotecas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                    Mensaje o Horario Preferido para Llamada
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Cuéntanos sobre tus preferencias de zona, presupuesto o preguntas sobre el proceso..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7FAFC] border border-[#DBE3EE] rounded-lg focus:outline-none focus:border-[#03459C]"
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  className="w-full py-3 bg-[#03459C] hover:bg-[#022F70] text-white font-bold text-xs sm:text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Mensaje Directo</span>
                </button>

              </form>
            )}

          </div>

          {/* RIGHT SIDE: INTERACTIVE MAP CARD & OFFICE DETAILS */}
          <div className="space-y-6">

            {/* Interactive Map Visual Representation */}
            <div className="bg-white rounded-2xl border border-[#DBE3EE] overflow-hidden shadow-xl space-y-0">

              <div className="relative h-64 bg-slate-800 flex items-center justify-center overflow-hidden">
                <img
                  src="/brand/greizy-2.jpg"
                  alt="Ubicación Punta Cana"
                  className="w-full h-full object-cover opacity-60"
                />

                {/* Pin Overlay */}
                <div className="absolute p-4 bg-[#071B33] text-white rounded-xl shadow-2xl border border-[#7A8AA3] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center font-bold text-xs text-white">
                    <MessageSquare className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-poppins text-white">Atención Greizy & Greizy González</h4>
                    <p className="text-[10px] text-gray-300">Respuesta inmediata por WhatsApp</p>
                  </div>
                </div>
              </div>

              {/* Physical Office Information */}
              <div className="p-6 space-y-4 text-xs text-gray-700">
                <h3 className="font-bold font-poppins text-sm text-[#1F2937]">
                  Información de Contacto
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#03459C] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#1F2937]">Cobertura Principal</p>
                      <p className="text-gray-500">Santo Domingo, República Dominicana</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#03459C] flex-shrink-0" />
                    <span>Línea Directa: (809) 499-5808</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#03459C] flex-shrink-0" />
                    <span>greizygonzalez.inmobiliaria@gmail.com</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[#03459C] flex-shrink-0" />
                    <span>{contact.schedule}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">

        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7A8AA3]">
            Preguntas Frecuentes
          </span>
          <h2 className="text-2xl font-bold font-poppins text-[#1F2937]">
            Respuestas a tus Dudas Inmobiliarias
          </h2>
        </div>

        <div className="space-y-3">
          {SPANISH_FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-lg border border-[#DBE3EE] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full px-6 py-4 text-left font-poppins font-semibold text-xs sm:text-sm text-[#1F2937] flex items-center justify-between hover:bg-[#F7FAFC]"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-[#7A8AA3] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-[#DBE3EE]/60 bg-[#F7FAFC]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

    </div>
  );
};
