/**
 * ============================================================
 *  IDENTIDAD Y CONTENIDO — ARCHIVO A EDITAR POR CLIENTE
 * ============================================================
 * Marca, contacto y textos institucionales en un solo lugar.
 * Ningún componente tiene datos escritos a mano.
 */

export const brand = {
  name: 'Greizy González',
  tagline: 'Asesora de Inversiones Inmobiliarias',
  legalName: 'Greizy González — Asesora de Inversiones Inmobiliarias',

  logo: {
    mark: '/brand/isotipo.png',
    markLight: '/brand/isotipo-blanco.png',
    /** Proporción real del archivo (ancho / alto) */
    markRatio: 338 / 387,
  },

  /** Azules tomados del logo oficial */
  colors: {
    deep: '#03459C',
    deepHover: '#022F70',
    bright: '#049FD5',
    ink: '#071B33',
    muted: '#7A8AA3',
    border: '#DBE3EE',
    surface: '#F7FAFC',
  },
}

export const contact = {
  phoneDisplay: '(809) 499-5808',
  whatsapp: '18094995808',
  email: 'greizygonzalez.inmobiliaria@gmail.com',
  instagram: 'greizygonzalez.qbrokers',
  instagramUrl: 'https://instagram.com/greizygonzalez.qbrokers',
  city: 'Santo Domingo',
  country: 'República Dominicana',
  locationNote: 'Con proyección internacional',
  schedule: 'Lunes a viernes, 9:00 a 18:00',
}

export const waLink = (message = '') =>
  `https://wa.me/${contact.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`

export const alliances = [
  { short: 'QBrokers Real Estate', label: 'Asesora asociada a QBrokers Real Estate' },
  { short: 'Inversiones Aragua SRL', label: 'CEO de Inversiones Aragua SRL' },
]

export const hero = {
  eyebrow: 'Abogada · Asesora inmobiliaria · CEO',
  title: 'Espacios que transforman vidas.',
  titleAccent: 'Inversiones con alma y seguridad jurídica.',
  subtitle:
    'Asesora de inversiones inmobiliarias con alianza en Qbrokers Real Estate y CEO de Inversiones Aragua SRL. Te acompaño a encontrar tu espacio ideal y a construir tu patrimonio en República Dominicana.',
  stats: [
    { value: '15+', label: 'años de trayectoria legal' },
    { value: 'RD', label: 'y mercado internacional' },
    { value: '100%', label: 'operaciones con revisión jurídica' },
  ],
}

export const about = {
  name: 'Greizy González',
  role: 'Abogada & CEO de Inversiones Aragua SRL | Alianza con QBrokers Real Estate',
  photo: '/brand/greizy.jpg',
  quote:
    '«Creer en el poder de la transformación requiere tanto de estrategia como de convicción. El derecho no es solo un conjunto de normas, sino el puente que permite materializar sueños y proteger patrimonios.»',
  paragraphs: [
    'Creer en el poder de la transformación requiere tanto de estrategia como de convicción. Como abogada con más de quince años de trayectoria, entendí muy temprano que el derecho no es solo un conjunto de normas, sino el puente que permite materializar sueños y proteger patrimonios. Desde mi natal Venezuela hasta este hermoso suelo dominicano que hoy abraza mis proyectos, he construido un camino donde la excelencia jurídica y la visión inmobiliaria convergen para ofrecer certezas en cada paso.',
    'Como CEO de Inversiones Aragua SRL y asesora de inversiones inmobiliarias aliada a QBrokers Real Estate en Santo Domingo, mi enfoque va más allá de cerrar una negociación. Aporto una perspectiva integral que fusiona el rigor corporativo, civil y notarial con una profunda sensibilidad humana y espiritual. Sé muy bien lo que significa reinventarse, asumir nuevos retos y liderar con propósito; por eso, cada asesoría está impregnada de esa energía positiva y resiliencia que nos define a las mujeres que no solo emprenden, sino que transforman realidades.',
    'Emprender en mercados dinámicos implica desafiar constantemente los propios límites. Más allá del derecho y los bienes raíces, mi espíritu versátil me ha llevado a comprender la importancia de la sanidad integral y el bienestar en los espacios que habitamos —incluyendo sectores tan exigentes como el control y manejo de plagas urbanas y el mantenimiento operativo—.',
    'Asumir este reto como mujer empresaria significa romper moldes con elegancia y firmeza. Demuestra que la verdadera autoridad no radica en la rigidez, sino en la capacidad de coordinar con precisión, anticiparse a los problemas con visión estratégica y mantener la armonía en entornos complejos. Cada desafío operativo o corporativo es, en realidad, una oportunidad para elevar los estándares, demostrar resiliencia y sembrar bienestar y orden en cada proyecto que lidero.',
  ],
}

export const mission = {
  mission:
    'Proveer soluciones jurídicas integrales y asesoría inmobiliaria de alto nivel en la República Dominicana, blindando cada inversión con seguridad legal, transparencia y una atención profundamente humana, para que cada cliente alcance su estabilidad y crecimiento patrimonial con absoluta tranquilidad.',
  vision:
    'Consolidarnos en Santo Domingo y la región como el referente indiscutible de confianza en el sector legal e inmobiliario, destacando por una gestión innovadora, empática y orientada a los resultados más elevados de nuestros clientes.',
}

export const values = [
  {
    title: 'Integridad',
    text: 'La brújula inquebrantable de cada actuación profesional.',
  },
  {
    title: 'Resiliencia y Liderazgo',
    text: 'La fuerza interior para superar desafíos y abrir caminos con optimismo.',
  },
  {
    title: 'Empatía Consciente',
    text: 'Escuchar y conectar genuinamente con las necesidades de cada familia o inversor.',
  },
  {
    title: 'Excelencia',
    text: 'Rigor técnico y actualización constante al servicio de tus metas.',
  },
]

export const services = [
  {
    id: 'asesoria',
    title: 'Asesoría inmobiliaria de alto nivel',
    text: 'Búsqueda y selección de propiedades residenciales, comerciales y de inversión en República Dominicana e internacionales, a través de la red de QBrokers Real Estate.',
    bullets: [
      'Definición del perfil de inversión y presupuesto',
      'Preselección curada de inmuebles',
      'Visitas acompañadas y negociación',
    ],
  },
  {
    id: 'blindaje',
    title: 'Blindaje y asesoría jurídica inmobiliaria',
    text: 'Revisión de títulos, constitución de sociedades, contratos, debida diligencia y acompañamiento notarial completo para garantizar compras 100% seguras.',
    bullets: [
      'Certificación de título y estudio de cargas',
      'Contratos de compraventa y promesa de venta',
      'Acompañamiento notarial y registro',
    ],
  },
  {
    id: 'estructuracion',
    title: 'Estructuración de inversiones',
    text: 'Desde Inversiones Aragua SRL, planificación estratégica para inversionistas locales e internacionales que buscan maximizar el retorno de su capital con total respaldo legal.',
    bullets: [
      'Vehículo societario adecuado a tu caso',
      'Proyección de retorno y costos reales',
      'Cumplimiento fiscal y repatriación de fondos',
    ],
  },
]

export const philosophy = {
  title: 'La armonía de tu nuevo hogar',
  text: 'El lugar donde vives o inviertes moldea tu energía diaria. Analizamos cada espacio no solo por su rentabilidad y ubicación, sino por la luz, la paz y el bienestar que aportará a tu vida.',
  pillars: [
    { title: 'Luz y orientación', text: 'Cómo entra la luz natural y cómo eso afecta tu descanso y tu ánimo.' },
    { title: 'Silencio y entorno', text: 'Ruido, vecindario y flujo del sector en distintos momentos del día.' },
    { title: 'Propósito del espacio', text: 'Si el inmueble sostiene la vida que quieres construir, no solo la que tienes hoy.' },
  ],
}

export const seo = {
  title: 'Greizy González | Asesora de Inversiones Inmobiliarias en RD',
  description:
    'Asesoría inmobiliaria con respaldo legal en República Dominicana. Propiedades verificadas, blindaje jurídico y estructuración de inversiones.',
}

export const legal = {
  disclaimer:
    'La información publicada es de carácter informativo y no constituye una oferta vinculante. Precios, disponibilidad y características pueden variar sin previo aviso.',
}

export default { brand, contact, waLink, alliances, hero, about, mission, values, services, philosophy, seo, legal }
