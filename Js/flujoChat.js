// js/flujoChat.js - VERSIÓN PNL CON MAGIA Y CERCANÍA

const FLUJO_CHAT = {
  pasos: [
    {
      id: 'solicitar_tipo_documento',
      bot: `👋 ¡Hola! Qué bueno tenerte aquí.

Vamos a resolver tu papeleta juntos, paso a paso y sin complicaciones.

Para empezar, cuéntame: ¿vas a usar tu DNI o tu RUC?`,
      validacion: (texto) => /dni|ruc/.test(texto.toLowerCase()),
      siguiente: 'ingresar_documento',
      tipo: 'seleccion_documento'
    },
    {
      id: 'ingresar_documento',
      bot: `Perfecto. Ahora solo necesito tu número para buscar tu información.

Escribelo abajo y presiona "Confirmar". Yo te ayudo con el resto.`,
      validacion: (texto) => {
        const doc = texto.trim();
        if (estadoFlujo.tipoDocumento === 'dni') {
          return /^\d{8}$/.test(doc);
        } else if (estadoFlujo.tipoDocumento === 'ruc') {
          return /^\d{11}$/.test(doc);
        }
        return /^\d+$/.test(doc) && doc.length >= 8;
      },
      siguiente: 'verificando_documento',
      tipo: 'ingreso_documento'
    },
    {
      id: 'verificando_documento',
      bot: `✅ ¡Listo! Ya encontré tus datos.

Un momentito mientras reviso tu situación...`,
      validacion: (texto) => true,
      siguiente: 'presuposiciones'
    },
    {
      id: 'presuposiciones',
      bot: `📊 Ya casi estamos. Estoy revisando las mejores opciones para ti.

Cada paso nos acerca más a resolver esto.`,
      validacion: (texto) => true,
      siguiente: 'si_progresivo'
    },
    {
      id: 'si_progresivo',
      bot: `✅ Identidad verificada.
✅ Papeleta encontrada.
✅ Opciones disponibles.

Vamos avanzando.`,
      validacion: (texto) => true,
      siguiente: 'validacion_emocional'
    },
    {
      id: 'validacion_emocional',
      bot: `💙 Entiendo que esto puede generar dudas. Es normal.

Pero aquí estoy para guiarte y mostrarte caminos que te den tranquilidad.

¿Listo para ver las opciones?`,
      validacion: (texto) => true,
      siguiente: 'beneficios'
    },
    {
      id: 'beneficios',
      bot: `✨ Fraccionar tu deuda te permite respirar más tranquilo.

Pagas en cuotas que se ajustan a tu bolsillo, sin presión.

Mira las alternativas que encontré para ti:`,
      validacion: (texto) => true,
      siguiente: 'alternativas'
    },
    {
      id: 'alternativas',
      bot: `📌 **6 cuotas** de S/ 160 — pagas más rápido.
📌 **12 cuotas** de S/ 85 — pagas más cómodo.

¿Cuál de estas dos opciones resuena más contigo?`,
      validacion: (texto) => /6|12/.test(texto),
      siguiente: 'mirroring',
      tipo: 'eleccion'
    },
    {
      id: 'mirroring',
      bot: `Excelente elección. 

Es la alternativa que muchos eligen por su comodidad. ¿Seguimos?`,
      validacion: (texto) => true,
      siguiente: 'refuerzo_positivo'
    },
    {
      id: 'refuerzo_positivo',
      bot: `👍 Tomaste una gran decisión. Eso habla de tu visión y organización.

Ahora revisemos el resumen antes de dar el paso final.`,
      validacion: (texto) => true,
      siguiente: 'si_progresivo_final'
    },
    {
      id: 'si_progresivo_final',
      bot: `✅ Plan seleccionado.
✅ Cronograma generado.
✅ Todo listo para confirmar.

¿Confirmamos tu solicitud?`,
      validacion: (texto) => /confirmar|si|sí|ok|aceptar/.test(texto.toLowerCase()),
      siguiente: 'cierre'
    },
    {
      id: 'cierre',
      bot: `🎉 ¡Felicidades! Tu solicitud de fraccionamiento ya está registrada.

Has dado un paso importante para organizar tus finanzas con tranquilidad.

Ahora puedes descargar tu constancia oficial. ¡Es tu respaldo!

Gracias por confiar en mí para acompañarte en este proceso. 🤗`,
      validacion: (texto) => true,
      siguiente: 'finalizado',
      esFinal: true
    }
  ]
};

// Estado del flujo
let estadoFlujo = {
  pasoActual: 0,
  tipoDocumento: null,
  numeroDocumento: null,
  opcionElegida: null,
  finalizado: false
};

function reiniciarFlujo() {
  estadoFlujo = {
    pasoActual: 0,
    tipoDocumento: null,
    numeroDocumento: null,
    opcionElegida: null,
    finalizado: false
  };
}

function obtenerPasoActual() {
  return FLUJO_CHAT.pasos[estadoFlujo.pasoActual] || null;
}

function avanzarPaso() {
  if (estadoFlujo.pasoActual < FLUJO_CHAT.pasos.length - 1) {
    estadoFlujo.pasoActual++;
    return true;
  }
  return false;
}