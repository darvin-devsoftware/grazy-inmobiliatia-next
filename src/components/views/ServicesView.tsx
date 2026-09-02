import React, { useState } from 'react';
import { ViewType } from '../../types';
import { 
  DollarSign, 
  ShieldCheck, 
  ArrowRight,
  Home,
  KeyRound,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface ServicesViewProps {
  onNavigate: (view: ViewType) => void;
  onShowToast: (msg: string, type?: 'success' | 'info') => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onNavigate, onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'selling' | 'buying' | 'renting'>('selling');

  // ------------ HOME VALUATION STATE ------------
  const [valAddress, setValAddress] = useState('Cap Cana / Punta Cana');
  const [valBeds, setValBeds] = useState(5);
  const [valBaths, setValBaths] = useState(6);
  const [valSqft, setValSqft] = useState(650);
  const [valCondition, setValCondition] = useState<'turnkey' | 'renovated' | 'original'>('turnkey');

  const calculateValuation = () => {
    let basePricePerSqft = 2200;
    if (valCondition === 'turnkey') basePricePerSqft = 2800;
    if (valCondition === 'original') basePricePerSqft = 1800;

    const estimatedValue = valSqft * basePricePerSqft;
    const lowerBound = estimatedValue * 0.95;
    const upperBound = estimatedValue * 1.08;

    return { estimatedValue, lowerBound, upperBound, pricePerSqft: basePricePerSqft };
  };

  const valData = calculateValuation();

  // ------------ MORTGAGE CALCULATOR STATE ------------
  const [homePrice, setHomePrice] = useState<number>(10000000);
  const [downPercent, setDownPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTerm, setLoanTerm] = useState<number>(30);

  const calculateMortgage = () => {
    const downPaymentAmount = (homePrice * downPercent) / 100;
    const principal = homePrice - downPaymentAmount;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    let monthlyPrincipalInterest = 0;
    if (monthlyInterestRate > 0) {
      monthlyPrincipalInterest = 
        (principal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    } else {
      monthlyPrincipalInterest = principal / numberOfPayments;
    }

    const monthlyPropertyTax = (homePrice * 0.012) / 12;
    const monthlyInsurance = (homePrice * 0.0035) / 12;
    const monthlyHOA = 1200;

    const totalMonthly = monthlyPrincipalInterest + monthlyPropertyTax + monthlyInsurance + monthlyHOA;

    return {
      downPaymentAmount,
      principal,
      monthlyPrincipalInterest,
      monthlyPropertyTax,
      monthlyInsurance,
      monthlyHOA,
      totalMonthly
    };
  };

  const mortgageData = calculateMortgage();

  return (
    <div className="space-y-16 pb-16 animate-fadeIn">
      
      {/* HERO */}
      <section className="bg-[#071B33] text-white py-16 px-4 sm:px-6 lg:px-8 text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#7A8AA3]">
          Servicios Especializados & Herramientas
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-poppins text-white">
          Servicios al Cliente y Calculadoras
        </h1>
        <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-light">
          Ya sea que desees vender una propiedad exclusiva, adquirir una villa frente al mar o calcular tu financiamiento, Greizy González te ofrece asesoría integral.
        </p>
      </section>

      {/* SERVICE TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tab Buttons */}
        <div className="flex justify-center border-b border-[#DBE3EE] mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-[#F7FAFC] rounded-xl border border-[#DBE3EE] w-full max-w-3xl">
            
            <button
              onClick={() => setActiveTab('selling')}
              className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === 'selling'
                  ? 'bg-[#03459C] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#03459C] hover:bg-white'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Para Vendedores</span>
            </button>

            <button
              onClick={() => setActiveTab('buying')}
              className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === 'buying'
                  ? 'bg-[#03459C] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#03459C] hover:bg-white'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Para Compradores</span>
            </button>

            <button
              onClick={() => setActiveTab('renting')}
              className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === 'renting'
                  ? 'bg-[#03459C] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#03459C] hover:bg-white'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Alquileres</span>
            </button>

          </div>
        </div>

        {/* TAB 1: SELLING & HOME VALUATION WIDGET */}
        {activeTab === 'selling' && (
          <div className="space-y-12 animate-fadeIn">
            
            {/* Steps to Sell */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-5 bg-white rounded-lg border border-[#DBE3EE] space-y-2">
                <span className="text-xs font-bold text-[#7A8AA3] uppercase">Paso 01</span>
                <h4 className="font-bold text-sm text-[#1F2937]">Valoración Confidencial</h4>
                <p className="text-xs text-gray-500">Análisis comparativo de mercado y tasación formal.</p>
              </div>
              <div className="p-5 bg-white rounded-lg border border-[#DBE3EE] space-y-2">
                <span className="text-xs font-bold text-[#7A8AA3] uppercase">Paso 02</span>
                <h4 className="font-bold text-sm text-[#1F2937]">Producción Audiovisual</h4>
                <p className="text-xs text-gray-500">Video en HD, tomas con dron y fotografía profesional.</p>
              </div>
              <div className="p-5 bg-white rounded-lg border border-[#DBE3EE] space-y-2">
                <span className="text-xs font-bold text-[#7A8AA3] uppercase">Paso 03</span>
                <h4 className="font-bold text-sm text-[#1F2937]">Promoción Selectiva</h4>
                <p className="text-xs text-gray-500">Presentación directa a inversionistas precalificados.</p>
              </div>
              <div className="p-5 bg-white rounded-lg border border-[#DBE3EE] space-y-2">
                <span className="text-xs font-bold text-[#7A8AA3] uppercase">Paso 04</span>
                <h4 className="font-bold text-sm text-[#1F2937]">Cierre Seguro</h4>
                <p className="text-xs text-gray-500">Acompañamiento legal y depósitos en cuenta de custodia.</p>
              </div>
            </div>

            {/* INTERACTIVE HOME VALUATION CALCULATOR */}
            <div className="bg-white rounded-2xl border border-[#DBE3EE] p-6 sm:p-10 shadow-xl space-y-8">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DBE3EE] pb-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#7A8AA3]">
                    Calculadora de Estimación
                  </span>
                  <h3 className="text-2xl font-bold font-poppins text-[#1F2937] mt-1">
                    ¿Cuál es el valor estimado de tu inmueble?
                  </h3>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1.5 bg-[#F7FAFC] px-3 py-1.5 rounded-md border border-[#DBE3EE]">
                  <ShieldCheck className="w-4 h-4 text-[#03459C]" />
                  <span>100% Confidencial y Sin Compromiso</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Input Controls */}
                <div className="lg:col-span-7 space-y-5">
                  
                  <div>
                    <label className="block text-xs font-bold text-[#1F2937] mb-1">
                      Ubicación o Sector de la Propiedad
                    </label>
                    <input
                      type="text"
                      value={valAddress}
                      onChange={(e) => setValAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#F7FAFC] border border-[#DBE3EE] rounded-lg focus:outline-none focus:border-[#03459C]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1F2937] mb-1">Habitaciones</label>
                      <input
                        type="number"
                        min={1}
                        max={15}
                        value={valBeds}
                        onChange={(e) => setValBeds(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-[#F7FAFC] border border-[#DBE3EE] rounded-lg focus:outline-none focus:border-[#03459C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1F2937] mb-1">Baños</label>
                      <input
                        type="number"
                        min={1}
                        max={15}
                        value={valBaths}
                        onChange={(e) => setValBaths(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-[#F7FAFC] border border-[#DBE3EE] rounded-lg focus:outline-none focus:border-[#03459C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1F2937] mb-1">Área Construida (m²)</label>
                      <input
                        type="number"
                        step={50}
                        min={100}
                        max={5000}
                        value={valSqft}
                        onChange={(e) => setValSqft(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-[#F7FAFC] border border-[#DBE3EE] rounded-lg focus:outline-none focus:border-[#03459C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1F2937] mb-1.5">
                      Condición y Acabados de la Propiedad
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setValCondition('turnkey')}
                        className={`p-2.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                          valCondition === 'turnkey'
                            ? 'border-[#03459C] bg-[#E6F1FA] text-[#03459C]'
                            : 'border-[#DBE3EE] bg-white text-gray-600'
                        }`}
                      >
                        Totalmente Nueva / Lujo
                      </button>
                      <button
                        type="button"
                        onClick={() => setValCondition('renovated')}
                        className={`p-2.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                          valCondition === 'renovated'
                            ? 'border-[#03459C] bg-[#E6F1FA] text-[#03459C]'
                            : 'border-[#DBE3EE] bg-white text-gray-600'
                        }`}
                      >
                        Remodelada
                      </button>
                      <button
                        type="button"
                        onClick={() => setValCondition('original')}
                        className={`p-2.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                          valCondition === 'original'
                            ? 'border-[#03459C] bg-[#E6F1FA] text-[#03459C]'
                            : 'border-[#DBE3EE] bg-white text-gray-600'
                        }`}
                      >
                        Estado Original
                      </button>
                    </div>
                  </div>

                </div>

                {/* Valuation Display Card */}
                <div className="lg:col-span-5 bg-[#071B33] text-white p-6 rounded-xl flex flex-col justify-between space-y-6">
                  <div>
                    <span className="text-[10px] font-bold text-[#7A8AA3] uppercase tracking-widest">
                      Resultado Estimado
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      Basado en datos comparables de mercado en {valAddress ? valAddress : 'la zona'}.
                    </p>

                    <div className="mt-6 pt-6 border-t border-gray-700/80 space-y-2">
                      <span className="text-xs text-gray-300">Rango Estimado de Valor de Mercado:</span>
                      <p className="text-2xl sm:text-3xl font-extrabold font-poppins text-white">
                        ${(valData.lowerBound / 1000000).toFixed(2)}M – ${(valData.upperBound / 1000000).toFixed(2)}M
                      </p>
                      <p className="text-xs text-[#7A8AA3] font-medium">
                        Promedio: ~${(valData.estimatedValue / 1000000).toFixed(2)}M (${valData.pricePerSqft}/m²)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-700/80">
                    <p className="text-xs text-gray-300">
                      ¿Deseas una tasación presencial formal con Greizy o nuestro equipo experto?
                    </p>
                    <button
                      onClick={() => onShowToast('Cita de tasación solicitada para ' + valAddress, 'success')}
                      className="w-full py-2.5 bg-[#7A8AA3] hover:bg-[#64748B] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Solicitar Valoración Presencial</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: BUYING & MORTGAGE CALCULATOR WIDGET */}
        {activeTab === 'buying' && (
          <div className="space-y-12 animate-fadeIn">
            
            {/* Buyer's Guide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-lg border border-[#DBE3EE] space-y-2">
                <CheckCircle2 className="w-5 h-5 text-[#03459C]" />
                <h4 className="font-bold text-sm text-[#1F2937]">Acceso Exclusivo</h4>
                <p className="text-xs text-gray-500">Accede a inventarios de propiedades antes de su publicación general.</p>
              </div>
              <div className="p-6 bg-white rounded-lg border border-[#DBE3EE] space-y-2">
                <CheckCircle2 className="w-5 h-5 text-[#03459C]" />
                <h4 className="font-bold text-sm text-[#1F2937]">Auditoría Inmobiliaria</h4>
                <p className="text-xs text-gray-500">Informes legales y verificación de títulos de propiedad.</p>
              </div>
              <div className="p-6 bg-white rounded-lg border border-[#DBE3EE] space-y-2">
                <CheckCircle2 className="w-5 h-5 text-[#03459C]" />
                <h4 className="font-bold text-sm text-[#1F2937]">Negociación Estratégica</h4>
                <p className="text-xs text-gray-500">Defendemos tus intereses para lograr el mejor precio y condiciones.</p>
              </div>
            </div>

            {/* INTERACTIVE MORTGAGE CALCULATOR */}
            <div className="bg-white rounded-2xl border border-[#DBE3EE] p-6 sm:p-10 shadow-xl space-y-8">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DBE3EE] pb-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#7A8AA3]">
                    Planificación Financiera
                  </span>
                  <h3 className="text-2xl font-bold font-poppins text-[#1F2937] mt-1">
                    Calculadora de Préstamo Hipotecario
                  </h3>
                </div>
                <div className="text-xs font-bold text-[#03459C] bg-[#E6F1FA] px-3 py-1.5 rounded-md">
                  Simulador Interactivo
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Calculator Inputs */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Home Price Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-[#1F2937]">
                      <span>Valor de la Propiedad</span>
                      <span className="text-[#03459C] font-poppins text-sm">${homePrice.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={2000000}
                      max={40000000}
                      step={500000}
                      value={homePrice}
                      onChange={(e) => setHomePrice(Number(e.target.value))}
                      className="w-full accent-[#03459C] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>$2M</span>
                      <span>$20M</span>
                      <span>$40M+</span>
                    </div>
                  </div>

                  {/* Down Payment % Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-[#1F2937]">
                      <span>Porcentaje de Inicial</span>
                      <span className="text-[#03459C]">{downPercent}% (${mortgageData.downPaymentAmount.toLocaleString()})</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={50}
                      step={5}
                      value={downPercent}
                      onChange={(e) => setDownPercent(Number(e.target.value))}
                      className="w-full accent-[#03459C] cursor-pointer"
                    />
                  </div>

                  {/* Interest Rate & Term */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1F2937] mb-1">
                        Tasa de Interés Anual (%)
                      </label>
                      <input
                        type="number"
                        step={0.1}
                        min={3.0}
                        max={12.0}
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-[#F7FAFC] border border-[#DBE3EE] rounded-lg focus:outline-none focus:border-[#03459C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1F2937] mb-1">
                        Plazo del Préstamo (Años)
                      </label>
                      <select
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-[#F7FAFC] border border-[#DBE3EE] rounded-lg focus:outline-none focus:border-[#03459C]"
                      >
                        <option value={30}>30 Años Fijo</option>
                        <option value={20}>20 Años Fijo</option>
                        <option value={15}>15 Años Fijo</option>
                        <option value={10}>10 Años Fijo</option>
                      </select>
                    </div>
                  </div>

                </div>

                {/* Mortgage Breakdown Card */}
                <div className="lg:col-span-5 bg-[#F7FAFC] p-6 rounded-xl border border-[#DBE3EE] flex flex-col justify-between space-y-6">
                  
                  <div>
                    <span className="text-xs font-bold text-[#7A8AA3] uppercase tracking-wider">
                      Cuota Mensual Estimada
                    </span>
                    <p className="text-3xl font-extrabold font-poppins text-[#03459C] mt-1">
                      ${Math.round(mortgageData.totalMonthly).toLocaleString()} <span className="text-xs font-normal text-gray-500">/ mes</span>
                    </p>

                    <div className="space-y-2.5 pt-4 border-t border-[#DBE3EE] mt-4 text-xs">
                      <div className="flex justify-between text-gray-600">
                        <span>Capital e Intereses:</span>
                        <span className="font-semibold text-[#1F2937]">${Math.round(mortgageData.monthlyPrincipalInterest).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Impuestos Inmobiliarios Est.:</span>
                        <span className="font-semibold text-[#1F2937]">${Math.round(mortgageData.monthlyPropertyTax).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Seguro de la Propiedad:</span>
                        <span className="font-semibold text-[#1F2937]">${Math.round(mortgageData.monthlyInsurance).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Mantenimiento / Condominio:</span>
                        <span className="font-semibold text-[#1F2937]">${Math.round(mortgageData.monthlyHOA).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('listings')}
                    className="w-full py-2.5 bg-[#03459C] hover:bg-[#022F70] text-white text-xs font-bold rounded-lg transition-colors text-center"
                  >
                    Ver Propiedades hasta ${homePrice.toLocaleString()}
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 3: LANDLORDS & TENANTS */}
        {activeTab === 'renting' && (
          <div className="bg-white p-5 sm:p-8 rounded-2xl border border-[#DBE3EE] space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold font-poppins text-[#1F2937]">
              Alquileres de Lujo y Gestión de Propiedades
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl">
              En Greizy González supervisamos alquileres residenciales para ejecutivos, familias e inversionistas. Nos encargamos de la selección de inquilinos, contratos formales y mantenimiento continuo del inmueble.
            </p>
            <div className="pt-2 flex gap-3">
              <button
                onClick={() => onNavigate('contact')}
                className="px-5 py-2.5 bg-[#03459C] hover:bg-[#022F70] text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
              >
                Consultar sobre Gestión Inmobiliaria
              </button>
            </div>
          </div>
        )}

      </section>

    </div>
  );
};
