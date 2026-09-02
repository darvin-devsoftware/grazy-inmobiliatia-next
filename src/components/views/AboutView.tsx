import React from 'react';
import { ViewType } from '../../types';
import { Logo } from '../common/Logo';
import { about, mission, values, philosophy, alliances, hero, waLink } from '../../config/site';
import {
  Heart,
  Sparkles,
  Award,
  ShieldCheck,
  Scale,
  MessageCircle,
  Handshake,
  ArrowRight,
  PhoneCall,
  Target,
  Eye
} from 'lucide-react';

interface AboutViewProps {
  onNavigate: (view: ViewType) => void;
}

/** Iconos por valor, en el mismo orden que `values` en config/site.ts */
const VALUE_ICONS = [ShieldCheck, Scale, Handshake, Heart, Award];

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 pb-16 animate-fadeIn">

      {/* PORTADA */}
      <section className="relative bg-[#071B33] text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src={about.photo}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#071B33]/70 via-[#071B33]/85 to-[#071B33]" />

        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#03459C] text-white text-xs font-semibold uppercase tracking-widest rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#7A8AA3]" />
            <span>Sobre mí</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-poppins text-white leading-tight">
            {hero.title}{' '}
            <span className="block text-[#7ABEF0]">{hero.titleAccent}</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-200 max-w-2xl mx-auto leading-relaxed">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* BIOGRAFÍA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Retrato */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#DBE3EE] bg-white p-3">
              <div className="relative aspect-4/5 rounded-xl overflow-hidden">
                <img
                  src={about.photo}
                  alt={about.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#7A8AA3]">
                    {about.role}
                  </span>
                  <h3 className="text-2xl font-bold font-poppins text-white mt-1">
                    {about.name}
                  </h3>
                </div>
              </div>

              {/* Credenciales */}
              <div className="mt-4 p-4 bg-[#F7FAFC] rounded-xl border border-[#DBE3EE] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#03459C] text-white rounded-lg shrink-0">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1F2937]">
                      Más de 15 años ejerciendo el derecho
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Cada operación con revisión jurídica
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#DBE3EE] flex flex-wrap gap-2">
                  {alliances.map((a) => (
                    <span
                      key={a.short}
                      className="text-[10px] font-bold uppercase tracking-wider text-[#03459C] bg-[#E6F1FA] px-2.5 py-1 rounded-md"
                    >
                      {a.short}
                    </span>
                  ))}
                </div>
              </div>
            </div>


          </div>

          {/* Texto */}
          <div className="lg:col-span-7 space-y-6">

            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#03459C] bg-[#E6F1FA] px-3 py-1.5 rounded-md">
              <Logo size="sm" showText={false} variant="dark" />
              <span>Trayectoria</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-[#1F2937] leading-tight">
              Derecho e inmobiliaria, en una sola asesoría
            </h2>

            <blockquote className="relative bg-[#EEF3F8] p-6 pl-12 rounded-xl">
              <span
                aria-hidden="true"
                className="absolute left-4 top-3 text-5xl leading-none font-poppins text-[#03459C]/25 select-none"
              >
                &ldquo;
              </span>
              <p className="text-sm text-[#1F2937] italic leading-relaxed font-medium">
                {about.quote}
              </p>
            </blockquote>

            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 30)} className="text-sm text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('listings')}
                className="px-5 py-2.5 bg-[#03459C] hover:bg-[#022F70] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center gap-2"
              >
                <span>Explorar propiedades</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={waLink('Hola Greizy, quisiera agendar una consulta privada.')}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 border border-[#03459C] text-[#03459C] hover:bg-[#E6F1FA] text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
              >
                Agenda una consulta privada
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOTO EQUIPO QBROKERS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl overflow-hidden border border-[#DBE3EE] shadow-lg bg-white">
          <img
            src="/brand/qbrokersteam.jpeg"
            alt="Equipo de Qbrokers Real Estate"
            className="w-full h-72 sm:h-80 object-cover object-top"
          />
          <div className="bg-[#EEF3F8] px-6 py-4 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#03459C]">
              Alianza estratégica · Qbrokers Real Estate
            </span>
          </div>
        </div>
      </section>

      {/* MISIÓN Y VISIÓN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="bg-[#071B33] text-white p-8 rounded-2xl space-y-4">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-[#7ABEF0]" />
            </div>
            <h3 className="text-xl font-bold font-poppins">Misión</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{mission.mission}</p>
          </article>

          <article className="bg-white border border-[#DBE3EE] p-8 rounded-2xl space-y-4 shadow-2xs">
            <div className="w-10 h-10 bg-[#E6F1FA] rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-[#03459C]" />
            </div>
            <h3 className="text-xl font-bold font-poppins text-[#1F2937]">Visión</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{mission.vision}</p>
          </article>
        </div>
      </section>

      {/* VALORES */}
      <section className="bg-[#EEF3F8] py-16 border-y border-[#DBE3EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7A8AA3]">
              Nuestra propuesta de valor
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-poppins text-[#1F2937]">
              Valores que sostienen cada operación
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, i) => {
              const Icon = VALUE_ICONS[i] || ShieldCheck;
              return (
                <div
                  key={value.title}
                  className="bg-white p-6 rounded-xl border border-[#DBE3EE] shadow-2xs space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 bg-[#E6F1FA] text-[#03459C] rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold font-poppins text-[#1F2937]">
                    {value.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{value.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FILOSOFÍA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7A8AA3]">
              Filosofía
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-[#1F2937] leading-tight">
              {philosophy.title}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">{philosophy.text}</p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {philosophy.pillars.map((pillar, i) => (
              <div
                key={pillar.title}
                className="bg-white border border-[#DBE3EE] rounded-xl p-5 space-y-2 shadow-2xs"
              >
                <span className="text-2xl font-bold font-poppins text-[#7ABEF0]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-sm font-bold font-poppins text-[#1F2937]">{pillar.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CIERRE */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#071B33] text-white rounded-2xl p-8 sm:p-12 shadow-2xl border border-[#7A8AA3]/30 text-center space-y-6">
          <div className="w-12 h-12 bg-[#03459C] text-white rounded-full flex items-center justify-center mx-auto">
            <MessageCircle className="w-6 h-6" />
          </div>

          <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-3xl mx-auto italic">
            {about.quote}
          </p>

          <h3 className="text-xl sm:text-2xl font-bold font-poppins text-white pt-2">
            Conversemos sobre tu próxima inversión.
          </h3>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={waLink('Hola Greizy, quisiera asesoría inmobiliaria.')}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Escribir por WhatsApp</span>
            </a>

            <button
              onClick={() => onNavigate('listings')}
              className="px-6 py-3 bg-[#03459C] hover:bg-[#023277] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
            >
              Ver catálogo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
