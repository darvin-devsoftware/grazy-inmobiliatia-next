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
  name: 'Licda. Greizy González',
  role: 'Abogada, asesora inmobiliaria y CEO de Inversiones Aragua SRL',
  photo: '/brand/greizy.jpg',
  quote:
    '«Creer en la energía de los espacios es entender que una propiedad no es solo metros cuadrados: es la cuna de tus metas, tu tranquilidad y tu futuro.»',
  paragraphs: [
    'Más de 15 años de trayectoria legal combinados con la pasión por conectar a las personas con sus lugares de ensueño. Soy egresada de la Universidad Nacional Experimental de los Llanos Centrales Rómulo Gallegos (UNERG), en Venezuela.',
    'Como abogada y asesora inmobiliaria respaldada por QBrokers Real Estate, mi propósito es blindar tu inversión con transparencia y certeza jurídica, mientras alineamos tu búsqueda con la intención y la prosperidad que mereces.',
    'Desde Inversiones Aragua SRL acompaño a inversionistas locales e internacionales en la estructuración de sus compras, la revisión de títulos y la constitución de las sociedades que protegen su patrimonio.',
  ],
}

export const mission = {
  mission:
    'Guiar a inversionistas y familias en la adquisición de inmuebles de alto valor en República Dominicana y el extranjero, integrando una sólida certeza jurídica con una atención empática, transparente y alineada a sus propósitos de vida.',
  vision:
    'Ser la firma de consultoría inmobiliaria y legal referente en la región, reconocida por su excelencia profesional, integridad inquebrantable y por crear conexiones armoniosas y prósperas entre las personas y sus espacios.',
}

export const values = [
  {
    title: 'Seguridad y certeza jurídica',
    text: 'Cada transacción está blindada por el rigor legal: títulos, deslindes, cargas y contratos revisados antes de firmar.',
  },
  {
    title: 'Transparencia y ética',
    text: 'Relaciones basadas en la verdad, la claridad y el respeto mutuo. Conoces cada paso, cada plazo y cada costo.',
  },
  {
    title: 'Prosperidad alineada',
    text: 'Creemos en negocios donde todas las partes crecen y ganan en sintonía, sin presiones ni letras pequeñas.',
  },
  {
    title: 'Energía y empatía',
    text: 'Conectamos con las intenciones profundas de cada cliente para encontrar el lugar que eleve su bienestar.',
  },
  {
    title: 'Excelencia inmobiliaria',
    text: 'Respaldados por la red y la fuerza de QBrokers Real Estate, con acceso a inventario local e internacional.',
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
