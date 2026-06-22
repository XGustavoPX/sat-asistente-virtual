// main.js - CORREGIDO

// Configuración y Estado
const msgDiv = document.getElementById("mensajes");
const optDiv = document.getElementById("opciones-chat");
const input = document.getElementById("userInput");
const ghostText = document.getElementById("ghostText");
const btnSend = document.getElementById("btnEnviar");
const fill = document.getElementById("p-fill");
const inputAreaContainer = document.getElementById("inputAreaContainer");

// Referencias para la celebración
const robotImg = document.getElementById("robotImg");
const celebrationGif = document.getElementById("celebrationGif");
const robotTitle = document.getElementById("robotTitle");
const statusBadge = document.getElementById("statusBadge");

let state = {
  dni: null,
  ruc: null,
  step: 0,
  planElegido: false,
  confirmado: false,
  pdfDescargado: false,
  logoBase64: null,
  deudaOficial: null,
  sol: "SAT-" + Math.floor(10000000 + Math.random() * 90000000),
  modoInput: 'dni',
  chatIniciado: false
};

let chatHistory = [];

// ============================================================
// FUNCIONES DE CELEBRACIÓN
// ============================================================

function activateCelebration() {
  if (robotImg) robotImg.style.display = "none";
  if (celebrationGif) {
    celebrationGif.style.display = "block";
    celebrationGif.style.animation = "celebrationFloat 1.5s ease-in-out infinite";
  }
  if (robotTitle) {
    robotTitle.textContent = "🎉 ¡TRÁMITE EXITOSO!";
    robotTitle.className = "robot-title robot-title-celebration";
  }
  if (statusBadge) {
    statusBadge.className = "robot-status-badge status-badge-celebration";
    statusBadge.innerHTML = `
      <span class="status-dot"></span> 
      ¡Trámite Completado con Éxito! ✨
    `;
  }
  createConfetti();
}

function deactivateCelebration() {
  if (robotImg) robotImg.style.display = "block";
  if (celebrationGif) celebrationGif.style.display = "none";
  if (robotTitle) {
    robotTitle.textContent = "SATIBOT";
    robotTitle.className = "robot-title";
  }
  if (statusBadge) {
    statusBadge.className = "robot-status-badge";
    statusBadge.innerHTML = `
      <span class="status-dot"></span> Asistente Virtual Activo
    `;
  }
}

function createConfetti() {
  const colors = ['#10b981', '#fbbf24', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4'];
  const container = document.querySelector('.robot-side-panel');
  if (!container) return;
  
  const oldConfetti = container.querySelectorAll('.confetti-piece');
  oldConfetti.forEach(el => el.remove());
  
  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    const size = 6 + Math.random() * 10;
    const isCircle = Math.random() > 0.5;
    const rotation = Math.random() * 360;
    confetti.style.cssText = `
      width: ${size}px;
      height: ${isCircle ? size : size * 0.4}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}%;
      top: -20px;
      border-radius: ${isCircle ? '50%' : '2px'};
      animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
      animation-delay: ${Math.random() * 2}s;
      transform: rotate(${rotation}deg);
    `;
    container.appendChild(confetti);
    setTimeout(() => {
      if (confetti.parentNode) confetti.remove();
    }, 5000);
  }
}

function changeRobot(n) {
  if (celebrationGif && celebrationGif.style.display === "block") {
    return;
  }
  if (robotImg) {
    robotImg.src = `Assets/img/SATI ${n}.png`;
    robotImg.alt = `SATIBOT - Estado ${n}`;
  }
}

// ============================================================
// FUNCIÓN PARA FORMATEAR MENSAJES DEL BOT - CORREGIDA
// ============================================================

function formatBotMessage(text) {
  if (!text) return '';
  
  let cleanText = text.replace(/\[UI:.*?\]/g, "").trim();
  if (!cleanText) return '';
  
  const lines = cleanText.split('\n');
  let formatted = '';
  let listItems = [];
  let isInList = false;
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    if (trimmed.match(/^[📌✅🎉👍⭐️✦]\s/) || trimmed.match(/^[-*]\s/) || trimmed.match(/^\d+\.\s/)) {
      const content = trimmed.replace(/^[📌✅🎉👍⭐️✦]\s/, '').replace(/^[-*]\s/, '').replace(/^\d+\.\s/, '');
      listItems.push(content);
      isInList = true;
    } else {
      if (isInList && listItems.length > 0) {
        formatted += `<ul class="bot-list">`;
        listItems.forEach(item => {
          const emojiMatch = item.match(/^([📌✅🎉👍⭐️✦])\s+(.*)/);
          if (emojiMatch) {
            formatted += `<li><span class="list-emoji">${emojiMatch[1]}</span> ${emojiMatch[2]}</li>`;
          } else {
            formatted += `<li>${item}</li>`;
          }
        });
        formatted += `</ul>`;
        listItems = [];
        isInList = false;
      }
      
      if (trimmed) {
        if (trimmed.match(/^(Hola|Gracias|Por favor|¡|Bienvenido|Sistema|Recuerda|Excelente|Claro|Buena|Entiendo|Perfecto)/i) || 
            (index === 0 && trimmed.length < 100)) {
          formatted += `<p class="bot-intro">${trimmed}</p>`;
        } else {
          formatted += `<p>${trimmed}</p>`;
        }
      }
    }
  });
  
  if (isInList && listItems.length > 0) {
    formatted += `<ul class="bot-list">`;
    listItems.forEach(item => {
      const emojiMatch = item.match(/^([📌✅🎉👍⭐️✦])\s+(.*)/);
      if (emojiMatch) {
        formatted += `<li><span class="list-emoji">${emojiMatch[1]}</span> ${emojiMatch[2]}</li>`;
      } else {
        formatted += `<li>${item}</li>`;
      }
    });
    formatted += `</ul>`;
  }
  
  return formatted;
}

// ============================================================
// EFECTO ESCRITURA
// ============================================================

function typewriter(element, text, speed = 18, skipRobotChange = false) {
  if (!skipRobotChange) {
    changeRobot(2);
  }
  return new Promise((resolve) => {
    let i = 0;
    element.innerHTML = "";
    const cleanText = text.replace(/\[UI:.*?\]/g, "").trim();
    
    function type() {
      if (i < cleanText.length) {
        element.innerHTML += cleanText.charAt(i);
        i++;
        msgDiv.scrollTop = msgDiv.scrollHeight;
        setTimeout(type, speed);
      } else {
        // Formatear el mensaje completo
        const formatted = formatBotMessage(cleanText);
        element.innerHTML = marked.parse(formatted);
        msgDiv.scrollTop = msgDiv.scrollHeight;
        if (!skipRobotChange) {
          changeRobot(4);
        }
        resolve();
      }
    }
    type();
  });
}

// ============================================================
// GHOST SUGGESTION
// ============================================================

const PREDICTIONS = ["12345678", "20123456789", "Está bien", "Perfecto", "Sí, quiero ver las opciones", "De acuerdo", "12 cuotas", "Confirmar"];

input.addEventListener("input", (e) => {
  changeRobot(4);
  const val = e.target.value;
  if (!val || val.length < 2) { ghostText.innerText = ""; return; }
  const match = PREDICTIONS.find(p => p.toLowerCase().startsWith(val.toLowerCase()));
  if (match) ghostText.innerText = val + match.substring(val.length);
  else ghostText.innerText = "";
});

input.addEventListener("keydown", (e) => {
  if ((e.key === "Tab" || e.key === "ArrowRight") && ghostText.innerText !== "") {
    e.preventDefault(); input.value = ghostText.innerText; ghostText.innerText = "";
  }
});

// ============================================================
// UI HELPERS
// ============================================================

function addMsg(text, type, isBotStructured = false) {
  const wrap = document.createElement("div");
  wrap.className = `mensaje-wrapper ${type}-wrapper`;

  const inner = document.createElement("div");
  inner.className = `mensaje ${type}-msg`;
  
  let cleanText = text ? text.replace(/\[UI:.*?\]/g, "").trim() : "";
  
  if (type === 'bot' && isBotStructured && cleanText) {
    cleanText = formatBotMessage(cleanText);
    inner.innerHTML = marked.parse(cleanText);
  } else if (cleanText) {
    inner.innerHTML = marked.parse(cleanText);
  }
  
  wrap.appendChild(inner);
  msgDiv.appendChild(wrap);
  msgDiv.scrollTop = msgDiv.scrollHeight;
  return inner;
}

function showLoadingDots() {
  changeRobot(3);
  const wrap = document.createElement("div");
  wrap.className = "mensaje-wrapper bot-wrapper";
  wrap.id = "system-loading-dots";
  wrap.innerHTML = `
    <div class="typing-dots"><span></span><span></span><span></span></div>
  `;
  msgDiv.appendChild(wrap);
  msgDiv.scrollTop = msgDiv.scrollHeight;
}

function removeLoadingDots() {
  const dots = document.getElementById("system-loading-dots");
  if (dots) dots.remove();
  changeRobot(4);
}

// ============================================================
// FUNCIÓN createSuggestionBtn - VERSIÓN XXL
// ============================================================

function createSuggestionBtn(text) {
  const b = document.createElement("button");
  b.className = "btn-confirmar";
  
  b.style.fontSize = "1.6rem";
  b.style.padding = "20px 44px";
  b.style.minHeight = "72px";
  b.style.minWidth = "150px";
  b.style.border = "3px solid var(--azul-sat)";
  b.style.borderRadius = "70px";
  b.style.fontWeight = "800";
  b.style.cursor = "pointer";
  b.style.transition = "all 0.25s ease";
  b.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.08)";
  b.style.background = "white";
  b.style.color = "var(--azul-sat)";
  
  if (text.toLowerCase().includes("constancia") || 
      text.toLowerCase().includes("pdf") ||
      text.toLowerCase().includes("ver mi constancia")) {
    b.style.fontSize = "1.8rem";
    b.style.padding = "24px 52px";
    b.style.minHeight = "80px";
    b.style.background = "linear-gradient(135deg, #10b981, #059669)";
    b.style.color = "white";
    b.style.borderColor = "#10b981";
    b.style.boxShadow = "0 8px 30px rgba(16, 185, 129, 0.4)";
  }
  
  b.innerHTML = text;
  b.onclick = () => {
    if (text.includes("PDF") || text.includes("constancia") || 
        text.toLowerCase().includes("ver mi constancia")) {
      generatePDF();
    } else {
      sendMessage(text.replace(/^[^\s\w]+/, "").trim());
    }
  };
  
  b.addEventListener("mouseenter", () => {
    if (!text.toLowerCase().includes("constancia") && 
        !text.toLowerCase().includes("pdf")) {
      b.style.background = "var(--azul-sat)";
      b.style.color = "white";
      b.style.transform = "translateY(-4px) scale(1.02)";
      b.style.boxShadow = "0 16px 40px rgba(13, 90, 167, 0.35)";
    } else {
      b.style.transform = "translateY(-4px) scale(1.02)";
      b.style.boxShadow = "0 16px 40px rgba(16, 185, 129, 0.5)";
    }
  });
  
  b.addEventListener("mouseleave", () => {
    if (!text.toLowerCase().includes("constancia") && 
        !text.toLowerCase().includes("pdf")) {
      b.style.background = "white";
      b.style.color = "var(--azul-sat)";
      b.style.transform = "translateY(0) scale(1)";
      b.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.08)";
    } else {
      b.style.background = "linear-gradient(135deg, #10b981, #059669)";
      b.style.color = "white";
      b.style.transform = "translateY(0) scale(1)";
      b.style.boxShadow = "0 8px 30px rgba(16, 185, 129, 0.4)";
    }
  });
  
  optDiv.appendChild(b);
}

// ============================================================
// FUNCIÓN PARA GENERAR SUGERENCIAS
// ============================================================

function generateSuggestions() {
  optDiv.innerHTML = "";
  
  if (state.pdfDescargado) {
    createSuggestionBtn("¡Trámite Finalizado! ✨");
    return;
  }

  const paso = obtenerPasoActual();
  if (!paso) return;

  switch(paso.id) {
    case 'solicitar_tipo_documento':
      createSuggestionBtn("📋 DNI");
      createSuggestionBtn("🏢 RUC");
      break;
    case 'ingresar_documento':
      break;
    case 'verificando_documento':
      createSuggestionBtn("Continuar");
      break;
    case 'presuposiciones':
      createSuggestionBtn("Está bien");
      break;
    case 'si_progresivo':
      createSuggestionBtn("Perfecto");
      break;
    case 'validacion_emocional':
      createSuggestionBtn("Sí, quiero ver las opciones");
      break;
    case 'beneficios':
      createSuggestionBtn("De acuerdo");
      break;
    case 'alternativas':
      createSuggestionBtn("6 cuotas");
      createSuggestionBtn("12 cuotas");
      break;
    case 'mirroring':
      createSuggestionBtn("Sí, continuar");
      break;
    case 'refuerzo_positivo':
      createSuggestionBtn("Continuar");
      break;
    case 'si_progresivo_final':
      createSuggestionBtn("✅ Confirmar");
      break;
    case 'cierre':
      createSuggestionBtn("✅ Ver mi constancia");
      break;
    default:
      break;
  }
}

// ============================================================
// FUNCIÓN PARA CONFIGURAR EL INPUT
// ============================================================

function configurarInput(paso) {
  if (paso && paso.id === 'ingresar_documento') {
    inputAreaContainer.style.display = "flex";
    inputAreaContainer.style.opacity = "1";
    inputAreaContainer.style.visibility = "visible";
    
    if (estadoFlujo.tipoDocumento === 'dni') {
      input.placeholder = "INGRESA TU NÚMERO DE DNI (8 dígitos)";
      input.maxLength = 8;
      input.type = "text";
      input.value = "";
      state.modoInput = 'dni';
      btnSend.innerHTML = '<span>CONFIRMAR DNI</span> <i class="fas fa-arrow-right"></i>';
    } else if (estadoFlujo.tipoDocumento === 'ruc') {
      input.placeholder = "INGRESA TU NÚMERO DE RUC (11 dígitos)";
      input.maxLength = 11;
      input.type = "text";
      input.value = "";
      state.modoInput = 'ruc';
      btnSend.innerHTML = '<span>CONFIRMAR RUC</span> <i class="fas fa-arrow-right"></i>';
    } else {
      input.placeholder = "INGRESA TU NÚMERO DE DNI (8 dígitos)";
      input.maxLength = 8;
      input.type = "text";
      input.value = "";
      state.modoInput = 'dni';
      btnSend.innerHTML = '<span>CONFIRMAR</span> <i class="fas fa-arrow-right"></i>';
    }
    
    setTimeout(() => {
      input.focus();
    }, 300);
  } else {
    inputAreaContainer.style.display = "none";
    inputAreaContainer.style.opacity = "0";
    inputAreaContainer.style.visibility = "hidden";
    input.value = "";
  }
}

// ============================================================
// FUNCIÓN PARA PROCESAR EL FLUJO - CORREGIDA
// ============================================================

async function procesarFlujo(userText) {
  const pasoActual = obtenerPasoActual();
  
  if (!pasoActual) {
    reiniciarFlujo();
    await ejecutarPaso();
    return;
  }

  if (pasoActual.validacion(userText)) {
    if (pasoActual.id === 'solicitar_tipo_documento') {
      const tipo = userText.toLowerCase().trim();
      if (tipo === 'dni' || tipo === 'ruc') {
        estadoFlujo.tipoDocumento = tipo;
        const haySiguiente = avanzarPaso();
        if (haySiguiente) {
          await ejecutarPaso();
        }
        return;
      }
    }
    
    if (pasoActual.id === 'ingresar_documento') {
      const doc = userText.trim();
      if (estadoFlujo.tipoDocumento === 'dni') {
        estadoFlujo.numeroDocumento = doc;
        state.dni = doc;
      } else if (estadoFlujo.tipoDocumento === 'ruc') {
        estadoFlujo.numeroDocumento = doc;
        state.ruc = doc;
      }
      
      // Simular deuda
      state.deudaOficial = {
        papeleta: "P-" + Math.floor(100000 + Math.random() * 900000),
        monto: (Math.random() * 5000 + 500).toFixed(2)
      };
      
      const haySiguiente = avanzarPaso();
      if (haySiguiente) {
        inputAreaContainer.style.display = "none";
        inputAreaContainer.style.visibility = "hidden";
        await ejecutarPaso();
      }
      return;
    }
    
    if (pasoActual.id === 'alternativas') {
      estadoFlujo.opcionElegida = userText;
      state.planElegido = true;
      const cuotas = userText.match(/(\d+)/);
      if (cuotas) {
        state.step = 2;
        updateProgress(2);
      }
    }

    const haySiguiente = avanzarPaso();
    
    if (haySiguiente) {
      await ejecutarPaso();
    } else {
      estadoFlujo.finalizado = true;
      updateProgress(3);
      generateSuggestions();
    }
  } else {
    let errorMsg = "Por favor, ingresa un valor válido.";
    
    if (pasoActual.id === 'ingresar_documento') {
      if (estadoFlujo.tipoDocumento === 'dni') {
        errorMsg = "⚠️ El DNI debe tener 8 dígitos numéricos. Por favor, inténtalo nuevamente.";
      } else if (estadoFlujo.tipoDocumento === 'ruc') {
        errorMsg = "⚠️ El RUC debe tener 11 dígitos numéricos. Por favor, inténtalo nuevamente.";
      }
    } else if (pasoActual.id === 'solicitar_tipo_documento') {
      errorMsg = "⚠️ Por favor, selecciona DNI o RUC.";
    }
    
    const msg = addMsg(errorMsg, "bot", true);
    changeRobot(2);
    await typewriter(msg, errorMsg, 18, true);
    changeRobot(4);
    
    const msgOriginal = addMsg("", "bot", true);
    changeRobot(2);
    const cleanBotMsg = pasoActual.bot.replace(/\[UI:input\]/g, "");
    await typewriter(msgOriginal, cleanBotMsg, 18, true);
    changeRobot(4);
    
    configurarInput(pasoActual);
    generateSuggestions();
  }
}

// ============================================================
// EJECUTAR UN PASO DEL FLUJO - CORREGIDA
// ============================================================

async function ejecutarPaso() {
  const pasoActual = obtenerPasoActual();
  if (!pasoActual) {
    console.warn("No hay pasos disponibles");
    return;
  }

  console.log("Ejecutando paso:", pasoActual.id);

  const pasoIndex = FLUJO_CHAT.pasos.indexOf(pasoActual);
  if (pasoIndex <= 2) {
    updateProgress(0);
    state.step = 0;
  } else if (pasoIndex <= 5) {
    updateProgress(1);
    state.step = 1;
  } else if (pasoIndex <= 7) {
    updateProgress(2);
    state.step = 2;
  } else if (pasoIndex >= 8) {
    updateProgress(3);
  }

  // Crear el contenedor del mensaje
  const msg = document.createElement("div");
  msg.className = "mensaje-wrapper bot-wrapper";
  const inner = document.createElement("div");
  inner.className = "mensaje bot-msg";
  msg.appendChild(inner);
  msgDiv.appendChild(msg);
  
  changeRobot(2);
  
  // Mostrar el mensaje con efecto máquina de escribir
  const cleanBotMsg = pasoActual.bot.replace(/\[UI:.*?\]/g, "").trim();
  await typewriter(inner, cleanBotMsg, 18, true);
  
  changeRobot(4);
  
  // Configurar el input
  configurarInput(pasoActual);
  
  // Generar sugerencias
  generateSuggestions();
  
  if (pasoActual.id === 'ingresar_documento') {
    setTimeout(() => {
      input.focus();
    }, 400);
  }
}

// ============================================================
// CORE LOGIC
// ============================================================

async function sendMessage(text) {
  if (!text || !text.trim()) return;
  const userText = text.trim();
  ghostText.innerText = "";
  
  addMsg(userText, "user");
  input.value = "";
  optDiv.innerHTML = "";
  
  showLoadingDots();

  try {
    await new Promise(resolve => setTimeout(resolve, 600));
    removeLoadingDots();
    await procesarFlujo(userText);
  } catch (e) {
    removeLoadingDots();
    changeRobot(3);
    let errorMsg = addMsg("Hubo un problema. Por favor, intenta nuevamente. 😊", "bot", true);
    console.error(e);
  }
}

// ============================================================
// ACTUALIZAR PROGRESO
// ============================================================

function updateProgress(step) {
  const steps = [document.getElementById("st-0"), document.getElementById("st-1"), document.getElementById("st-2")];
  steps.forEach((el, i) => {
    if (!el) return;
    el.classList.remove("activo", "completado");
    if (i < step) el.classList.add("completado");
    if (i === step && step < 3) el.classList.add("activo");
    if (step === 3) el.classList.add("completado");
  });
  const w = step === 0 ? 0 : step === 1 ? 40 : step === 2 ? 70 : 100;
  if (fill) fill.style.width = w + "%";
}

// ============================================================
// GENERAR PDF
// ============================================================

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const d = state.deudaOficial || { papeleta: "N/A", monto: "0.00", codigoSolicitud: state.sol };
  const documento = state.dni || state.ruc || "N/A";

  doc.setFillColor(13, 90, 167); doc.rect(0, 0, 210, 50, 'F');
  if (state.logoBase64) doc.addImage(state.logoBase64, 'PNG', 15, 10, 30, 30);
  doc.setTextColor(255); doc.setFont("helvetica", "bold"); doc.setFontSize(24); doc.text("SAT - LIMA", 55, 25);
  doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.text("SISTEMA DE FRACCIONAMIENTO VIRTUAL INTELIGENTE", 55, 35);

  doc.setTextColor(40); doc.setFontSize(18); doc.setFont("helvetica", "bold"); doc.text("CONSTANCIA DE FRACCIONAMIENTO", 20, 70);
  doc.setDrawColor(13, 90, 167); doc.setLineWidth(0.5); doc.line(20, 75, 190, 75);

  const rows = [
    ["CÓDIGO DE TRÁMITE:", d.codigoSolicitud || state.sol],
    ["DOCUMENTO:", documento],
    ["TIPO DOCUMENTO:", estadoFlujo.tipoDocumento ? estadoFlujo.tipoDocumento.toUpperCase() : "N/A"],
    ["NÚMERO DE PAPELETA:", d.papeleta],
    ["MONTO TOTAL DEUDA:", `S/ ${d.monto}`],
    ["ESTADO ACTUAL:", "APROBADO Y REGISTRADO"],
    ["FECHA DE EMISIÓN:", new Date().toLocaleDateString()]
  ];
  
  let y = 90;
  rows.forEach(r => {
    doc.setFillColor(248, 250, 252); doc.rect(20, y - 7, 170, 12, 'F');
    doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text(r[0], 25, y);
    doc.setFont("helvetica", "normal"); doc.text(r[1], 85, y);
    y += 15;
  });

  doc.setFontSize(9); doc.setTextColor(150); doc.text("Este documento es oficial y ha sido generado por el Asistente Virtual SATIBOT AI.", 105, 275, { align: "center" });
  
  const nombreArchivo = `SAT_Constancia_${documento}.pdf`;
  doc.save(nombreArchivo);
  state.pdfDescargado = true;
  updateProgress(3);
  
  activateCelebration();
  
  setTimeout(() => {
    let finalMsg = addMsg(`🎊 ¡Listo! Tu constancia se ha descargado.

**Código de trámite:** ${d.codigoSolicitud || state.sol}

Ha sido un placer acompañarte en este trámite. 
¿Deseas hacer algo más? 😊`, "bot", true);
  }, 1000);
}

// ============================================================
// REINICIAR FLUJO
// ============================================================

function reiniciarFlujo() {
  if (typeof window._originalReiniciar === 'function') {
    window._originalReiniciar();
  }
  deactivateCelebration();
}

// ============================================================
// INICIALIZACIÓN - CORREGIDA
// ============================================================

async function runInitialSequence() {
  changeRobot(1);
  
  // Asegurar que el input esté oculto
  inputAreaContainer.style.display = "none";
  inputAreaContainer.style.visibility = "hidden";
  input.value = "";
  
  // Desactivar celebración
  deactivateCelebration();
  
  // Reiniciar estado del flujo
  estadoFlujo.pasoActual = 0;
  estadoFlujo.tipoDocumento = null;
  estadoFlujo.numeroDocumento = null;
  estadoFlujo.opcionElegida = null;
  estadoFlujo.finalizado = false;
  
  // Limpiar mensajes anteriores
  msgDiv.innerHTML = "";
  
  // Ejecutar el primer paso
  await ejecutarPaso();
}

// ============================================================
// EVENT LISTENERS
// ============================================================

btnSend.onclick = () => {
  const text = input.value.trim();
  if (text) {
    sendMessage(text);
  }
};

input.onkeypress = (e) => { 
  if (e.key === "Enter") {
    const text = input.value.trim();
    if (text) {
      sendMessage(text);
    }
  }
};

window.openLogout = () => document.getElementById('m-out').classList.add('active');
window.closeLogout = () => document.getElementById('m-out').classList.remove('active');

// Guardar referencia a la función original de reinicio
window._originalReiniciar = window.reiniciarFlujo || function() {};
window.reiniciarFlujo = reiniciarFlujo;

// ============================================================
// INICIALIZACIÓN FINAL
// ============================================================

window.onload = () => { 
  console.log("Iniciando aplicación...");
  console.log("🎉 Sistema de celebración activado");
  fetchLogo(); 
  updateProgress(0); 
  
  // Esperar un momento para que el DOM esté listo
  setTimeout(() => {
    runInitialSequence();
  }, 200);
};

// ============================================================
// FETCH LOGO
// ============================================================

async function fetchLogo() { 
  try { 
    const res = await fetch('/api/logo-base64'); 
    const data = await res.json(); 
    state.logoBase64 = data.base64; 
  } catch(e){}
}