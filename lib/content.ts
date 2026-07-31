/* ---------------------------------------------------------------
   Sekuz — contenido de la landing

   Fuente única del copy. Todos los componentes leen de aquí, así que
   editar este archivo cambia la página sin tocar código de layout.

   ⚠️  DATOS DE MUESTRA — LEER ANTES DE PUBLICAR

   Las cifras, los casos, los nombres de los testimonios y las empresas
   citadas son INVENTADOS. Se escribieron para que la página se pueda ver
   y evaluar completa, no porque correspondan a proyectos reales.

   Antes de que este sitio salga a producción hay que reemplazarlos por
   datos verificables. Publicar métricas o testimonios fabricados como si
   fueran reales es engañoso con el cliente y, según el caso, ilegal en
   publicidad comparativa.

   Lista de lo que hay que validar:
     · hero.stats     — las tres métricas del encabezado
     · cases.items    — sector, tamaño, problema, solución, resultado
     · results.stats  — proyectos, horas, reducción de errores
     · footer         — sectores, enlaces legales, correo de contacto
   --------------------------------------------------------------- */

export const nav = {
  brand: "Sekuz",
  links: [
    { label: "Qué hacemos", href: "#pilares" },
    { label: "Proceso", href: "#proceso" },
    { label: "Casos", href: "#casos" },
    { label: "Inversión", href: "#precios" },
    { label: "Preguntas", href: "#faq" },
  ],
  cta: { label: "Agenda una llamada", href: "#contacto" },
};

export const hero = {
  eyebrow: "Inteligencia artificial aplicada a operaciones",
  title: ["Inteligencia artificial", "que hace el trabajo,", "no que lo promete."],
  subtitle:
    "Diseñamos y construimos agentes, automatizaciones y aplicaciones que se integran a tu operación real — con la misma disciplina con la que se construye software crítico.",
  ctaPrimary: { label: "Agenda una llamada", href: "#contacto" },
  ctaSecondary: { label: "Cómo trabajamos", href: "#proceso" },
  stats: [
    { value: "23", caption: "Procesos en producción" },
    { value: "68 %", caption: "Reducción media de trabajo manual" },
    { value: "3 sem", caption: "Del diagnóstico al primer entregable" },
  ],
};

/* Franja de logos, justo bajo el hero: es la posición donde más pesa en la
   credibilidad, porque valida la propuesta antes de que el visitante empiece
   a evaluar nada. Requiere permiso por escrito de cada cliente. */
export const logos = {
  title: "Equipos que ya operan con procesos que construimos",
  // Sustituir por los nombres reales, y solo con autorización de cada cliente.
  brands: [
    "Distribuidora del Norte",
    "Grupo Almeida",
    "Transportes Vega",
    "Clínica San Rafael",
    "Ferretería Central",
  ],
};

export const problem = {
  eyebrow: "El punto de partida",
  title: ["Tu operación funciona", "porque alguien la sostiene", "a mano."],
  paragraphs: [
    "En toda empresa que crece hay procesos que nadie diseñó: se fueron acomodando. Funcionan porque alguien revisa un correo a tiempo, copia un dato de un sistema a otro o recuerda hacer el seguimiento el viernes.",
    "Ese trabajo no aparece en ningún reporte, pero cuesta: horas de gente calificada en tareas mecánicas, errores que se descubren tarde y decisiones tomadas con datos de la semana pasada.",
  ],
  symptoms: {
    title: "Señales de que llegó el momento",
    items: [
      "El equipo dedica más tiempo a mover información que a usarla.",
      "Hay procesos que solo una persona sabe ejecutar completos.",
      "Los datos existen, pero llegan tarde o hay que armarlos a mano.",
      "Cada cliente nuevo agrega trabajo manual proporcional.",
      "Ya probaron herramientas de IA, pero nada quedó en producción.",
    ],
  },
};

export const pillars = {
  eyebrow: "Qué hacemos",
  title: ["Tres formas de meter", "inteligencia en la operación."],
  intro:
    "No vendemos tecnología, resolvemos un problema. Según cuál sea el tuyo, la respuesta toma una de estas tres formas.",

  /* Cada franja se quedó en cuatro piezas: nombre, una línea de qué es, una
     frase de cómo funciona y el ejemplo concreto en terminal.

     Antes había además un `tagline` y un `paraQuien`, y entre los cuatro
     bloques de texto la fila crecía tanto que no cabía la ilustración sin
     ponerla por detrás del párrafo. El ejemplo en terminal es lo que más
     convence de los cuatro, así que el recorte salió de la explicación. */
  items: [
    {
      index: "01",
      name: "IA que resuelve",
      tagline: "Agentes que ejecutan de principio a fin",
      audience: "Procesos con criterio, volumen alto y reglas difíciles de escribir.",
      description:
        "Recibe una tarea, consulta tus sistemas, decide dentro de límites acotados y escala a una persona cuando no le alcanza.",
      /* Pie de la lámina. Es lo que convierte el grabado en metáfora y no en
         adorno: sin él, nadie sabe por qué un radar ilustra un agente. Dos
         partes, aparato y lectura, como el pie de una plancha de catálogo
         antiguo. */
      object: "Radar de vigilancia",
      reading: "Barre, distingue y avisa",
      example:
        "Lee cada solicitud entrante, la clasifica, busca el historial del cliente y deja la respuesta lista para aprobar.",
    },
    {
      index: "02",
      name: "Automatización con IA",
      tagline: "Procesos que corren solos y saben cuándo parar",
      audience: "Flujos repetitivos entre herramientas que hoy no se hablan.",
      description:
        "La IA entra donde hay que interpretar algo que una automatización tradicional no sabría leer.",
      object: "Compuerta de aliviadero",
      reading: "El caudal corre y para donde toca",
      example:
        "Llega una factura por correo, se extraen los datos, se validan contra la orden de compra y solo se avisa si algo no cuadra.",
    },
    {
      index: "03",
      name: "Apps con IA",
      tagline: "Software a medida con la inteligencia incorporada",
      audience: "Operaciones con lógica propia que ninguna herramienta del mercado cubre.",
      description:
        "La aplicación que el proceso necesita, con acceso por roles y la IA adentro en vez de pegada por fuera.",
      object: "Torre de control",
      reading: "Un puesto para ver y accionar todo",
      example:
        "Un panel donde operaciones ve el estado real de cada caso, con la priorización sugerida y el borrador ya preparado.",
    },
  ],

  /* El límite, al pie de las tres capacidades.

     Las tres comparten una misma regla y no se dice en ningún sitio: la
     máquina trabaja hasta un umbral explícito y cruzarlo está diseñado, no es
     un fallo. Es lo que contesta la objeción de la FAQ («¿y si el agente se
     equivoca?») y lo único de esta página que un competidor no puede copiar
     con un cambio de copy — o su producto tiene el umbral, o no lo tiene.

     Va aquí y no en la FAQ porque en la FAQ ya está enterrado en un acordeón
     cerrado. Los rótulos alimentan el diagrama de `components/ui/Swimlane.tsx`;
     si cambian, cambia el dibujo. */
  limite: {
    eyebrow: "El límite",
    title: "Hasta dónde decide sola.",
    intro:
      "Ninguna de las tres decide sin techo. Cada proceso lleva escrito qué puede resolver por su cuenta y qué tiene que pasar por una persona, y ese salto no es una avería: es parte del diseño.",
    lanes: { maquina: "Máquina", persona: "Persona" },
    pasos: ["Recibe", "Resuelve", "Registra"],
    persona: "Aprueba",
    umbral: ["margen bajo mínimo", "o falta existencia"],
    vuelta: "vuelve con el visto",
    cierre: "cierra el caso",
    pie: "Trazo continuo, camino automático. Trazo cortado, interviene una persona.",
  },
};

export const process = {
  eyebrow: "Cómo trabajamos",
  title: ["Empezamos por entender,", "no por construir."],
  intro:
    "La mayoría de los proyectos de IA fracasan por razones que no son técnicas: se automatiza un proceso que estaba mal, o se construye algo que nadie adopta. Por eso el orden importa.",
  steps: [
    {
      index: "01",
      name: "Diagnóstico",
      duration: "1 a 2 semanas",
      description:
        "Nos sentamos con quien ejecuta el proceso, no solo con quien lo dirige. Mapeamos cómo funciona de verdad y qué datos existen.",
      deliverable: "Mapa del proceso y oportunidades priorizadas",
    },
    {
      index: "02",
      name: "Prototipo",
      duration: "2 a 4 semanas",
      description:
        "Construimos primero la parte más riesgosa, no la más fácil. Si algo va a fallar, mejor saberlo en la semana tres que en el mes seis.",
      deliverable: "Pieza funcional sobre datos reales",
    },
    {
      index: "03",
      name: "Producción",
      duration: "4 a 8 semanas",
      description:
        "Integración, permisos, manejo de errores y trazabilidad de cada decisión automática. Acompañamos la adopción del equipo, que es donde se gana o se pierde.",
      deliverable: "Sistema en operación con métricas activas",
    },
    {
      index: "04",
      name: "Operación",
      duration: "Continuo",
      description:
        "Los datos cambian y los modelos avanzan. Monitoreamos comportamiento y costo, y evolucionamos lo que se queda corto.",
      deliverable: "Monitoreo y mejora continua",
    },
  ],
};

export const cases = {
  eyebrow: "Casos",
  title: ["Lo que hemos", "construido."],
  intro:
    "Cada proyecto se mide contra el número que importaba antes de empezar. Estos son los casos que podemos contar.",
  items: [
    {
      sector: "Distribución mayorista",
      tamano: "180 empleados",
      title: "De 4 horas diarias cotizando a 20 minutos revisando",
      problema:
        "Entre 60 y 90 solicitudes de cotización al día, por correo y WhatsApp, cada una en formato distinto. Un analista dedicaba la mañana completa a buscar precios y existencias. Las cotizaciones salían al día siguiente y se perdían negocios por demora.",
      solucion:
        "Un agente lee cada solicitud sin importar el formato, consulta precio y existencia en el ERP y genera la cotización lista para enviar. Si el margen queda bajo el mínimo o falta stock, marca el caso y lo pasa al analista con el contexto reunido.",
      resultado:
        "Tiempo de respuesta: de 26 horas a 40 minutos. El analista pasó de redactar a revisar excepciones, el 18 % del volumen.",
      pilar: "IA que resuelve",
    },
    {
      sector: "Servicios contables",
      tamano: "45 empleados",
      title: "Cierre mensual sin capturar facturas a mano",
      problema:
        "Entre 900 y 1.200 facturas al mes digitadas campo por campo desde PDF e imágenes. Los errores de captura aparecían en la conciliación y obligaban a reprocesar. El cierre se atrasaba casi todos los meses.",
      solucion:
        "Un flujo recibe los documentos por correo, extrae los datos aunque el formato cambie entre proveedores, valida contra la orden de compra y registra el asiento. Solo escala si el documento está ilegible o los valores no cuadran.",
      resultado:
        "Errores de captura: −91 %. Cierre mensual: de once días hábiles a cuatro.",
      pilar: "Automatización con IA",
    },
  ],
};

export const results = {
  eyebrow: "Resultados",
  title: ["Lo que llevamos", "medido hasta hoy."],
  stats: [
    { value: "23", caption: "Procesos entregados y en operación", note: "desde 2024" },
    { value: "310 h", caption: "Horas manuales eliminadas por mes", note: "promedio por cliente" },
    { value: "91 %", caption: "Reducción de errores de captura", note: "caso servicios contables" },
  ],

  /* La serie que alimenta la matriz de densidad.
     Ver `components/ui/DensityMatrix.tsx`.

     ⚠️ INVENTADA, como el resto de este archivo. Y aquí importa más que en
     ningún otro sitio: una cifra falsa en texto se lee como una cifra; una
     serie falsa DIBUJADA se lee como una medición, que es una afirmación más
     fuerte y más difícil de matizar. Por eso la nota va entre [[ ]] y sale
     resaltada en pantalla hasta que alguien la sustituya.

     Cuatro semanas de lunes a domingo, 28 valores. Si cambias la longitud, la
     matriz se recompone sola mientras sea múltiplo de 7. */
  serie: {
    label: "Solicitudes resueltas sin intervención",
    nota: "[[Últimas cuatro semanas · datos de muestra]]",
    /* Por encima de esto el día se marca: son las jornadas que superaron la
       capacidad prevista y sirvieron para redimensionar. */
    umbral: 88,
    dias: [
      62, 71, 68, 74, 80, 22, 14,
      69, 77, 91, 83, 86, 27, 12,
      74, 82, 79, 95, 88, 31, 18,
      81, 88, 86, 92, 97, 34, 16,
    ],
  },
};

/* Bandas de inversión.

   Publicar un rango, aunque el precio final varíe, evita que el visitante lea
   el silencio como "cobran lo que quieran" y cualifica al lead antes de la
   llamada. Los importes son DE MUESTRA: fíjalos tú antes de publicar. */
export const pricing = {
  eyebrow: "Inversión",
  title: ["Cuánto cuesta", "empezar."],
  intro:
    "Cada proyecto se cotiza sobre el alcance real, pero estas son las bandas en las que se mueven. Si tu caso no encaja en ninguna, te lo decimos en la primera llamada.",
  tiers: [
    {
      name: "Diagnóstico",
      from: "USD 1.500",
      unit: "pago único",
      description:
        "Mapa del proceso y oportunidades priorizadas. Si sigues con la implementación, se descuenta del proyecto.",
      includes: ["1 a 2 semanas", "Entrevistas con el equipo", "Priorización por impacto"],
      featured: false,
    },
    {
      name: "Implementación",
      from: "USD 8.000",
      unit: "por proceso",
      description:
        "Del prototipo a producción, integrado a tus sistemas y con métricas activas desde el primer día.",
      includes: [
        "6 a 12 semanas",
        "Integraciones incluidas",
        "Acompañamiento de adopción",
        "Trazabilidad de decisiones",
      ],
      featured: true,
    },
    {
      name: "Operación",
      from: "USD 900",
      unit: "al mes",
      description:
        "Monitoreo de comportamiento y costo, correcciones y evolución de lo que se queda corto.",
      includes: ["Monitoreo continuo", "Mejoras incrementales", "Soporte prioritario"],
      featured: false,
    },
  ],
  note: "Los valores no incluyen el costo de los modelos ni de la infraestructura, que se factura al costo.",
};

/* FAQ: desactiva las objeciones que frenan la decisión antes de que el
   visitante se vaya sin escribir. */
export const faq = {
  eyebrow: "Preguntas frecuentes",
  title: ["Lo que suelen", "preguntarnos."],

  /* Salida al pie del titular, para quien barrió la lista y no encontró su
     duda. Es la última oportunidad antes del cierre de la página. */
  exit: {
    label:
      "Si tu duda no está acá, es probable que sea específica de tu operación. Esas se resuelven mejor hablando que leyendo.",
    cta: { label: "Escríbenos la pregunta", href: "#contacto" },
  },

  items: [
    {
      question: "¿Cuánto tarda en verse el primer resultado?",
      answer:
        "El diagnóstico entrega conclusiones en una o dos semanas. La primera pieza funcionando sobre datos reales suele llegar entre la semana cuatro y la seis. No trabajamos con proyectos que solo muestran algo al final.",
    },
    {
      question: "¿Qué pasa con nuestros datos?",
      answer:
        "Trabajamos sobre tu infraestructura siempre que sea posible. Cuando hay que usar un modelo externo, se envía únicamente lo necesario para la tarea, con acuerdo de confidencialidad firmado y registro de cada decisión automática. Nunca entrenamos modelos con tus datos.",
    },
    {
      question: "¿Necesitamos tener los datos ordenados antes de empezar?",
      answer:
        "No. Casi nunca lo están, y ese desorden suele ser parte del problema. El diagnóstico incluye revisar qué datos existen y en qué estado, y buena parte del valor está en eso.",
    },
    {
      question: "¿Y si el agente se equivoca?",
      answer:
        "Se diseña para que pueda equivocarse sin causar daño. Cada proceso tiene límites explícitos de lo que puede decidir solo, un camino de escalamiento a una persona y trazabilidad completa. En lo crítico, la IA prepara y un humano aprueba.",
    },
    {
      question: "¿Trabajan con nuestras herramientas actuales?",
      answer:
        "Sí, es el punto de partida. Integramos sobre el ERP, el CRM y los sistemas que ya usas. Reemplazar herramientas es la última opción, no la primera.",
    },
    {
      question: "¿Qué tamaño de empresa necesita esto?",
      answer:
        "Funciona bien cuando hay volumen repetitivo y varias personas sosteniendo procesos a mano. Por debajo de cierto tamaño, casi siempre es más barato ajustar el proceso que automatizarlo, y te lo diremos.",
    },
  ],
};

export const finalCta = {
  title: ["Empecemos por entender", "tu operación."],
  subtitle:
    "Una primera conversación de 30 minutos, sin compromiso. Salimos de ahí con una lectura honesta de qué se puede automatizar y qué todavía no conviene.",
  ctaPrimary: { label: "Agenda una llamada", href: "#contacto" },
  // Reemplazar por el correo real de Sekuz antes de publicar
  ctaSecondary: { label: "Escríbenos", href: "mailto:hola@sekuz.com" },
};

export const footer = {
  brand: "Sekuz",
  description:
    "Inteligencia artificial aplicada a operaciones. Agentes, automatizaciones y software a medida.",
  columns: [
    {
      title: "Qué hacemos",
      links: ["IA que resuelve", "Automatización con IA", "Apps con IA", "Diagnóstico"],
    },
    {
      title: "Sectores",
      links: [
        "Distribución y mayoristas",
        "Servicios contables",
        "Logística",
        "Salud y clínicas",
      ],
    },
    {
      title: "Recursos",
      links: ["Casos", "Proceso", "Preguntas frecuentes"],
    },
    {
      title: "Compañía",
      links: ["Nosotros", "Contacto", "Trabaja con nosotros"],
    },
  ],
  legal: ["Privacidad", "Términos"],
  copyright: `© ${new Date().getFullYear()} Sekuz. Todos los derechos reservados.`,
};
