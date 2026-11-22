/**
 * MARCOLIN MÉXICO - LÓGICA DE LA TARJETA DE PRESENTACIÓN DIGITAL
 * Optimizado para dispositivos móviles y escaneo por código QR.
 */

// =============================================================================
// CONFIGURACIÓN CENTRALIZADA DEL ASESOR
// Modifica estos valores con los datos reales cuando los tengas listos.
// =============================================================================
const ADVISOR_CONFIG = {
  firstName: "Isaías",
  lastName: "García",
  fullName: "Isaías García",
  title: "Sales Advisor",
  company: "Marcolin México",
  
  // WhatsApp: Código de país + lada + número (sin espacios ni guiones para el link)
  whatsappNumber: "525611331198", 
  
  // Mensaje predeterminado que verá el cliente al abrir WhatsApp
  whatsappGreeting: "Hola Isaías, escaneé tu tarjeta de presentación digital de Marcolin México. Me gustaría ponerme en contacto contigo.",

  // Correo Electrónico
  email: "isaias.garcia@marcolin.com",
  emailSubject: "Contacto Comercial - Marcolin México",
  emailBody: "Hola Isaías,\n\nTe contacto a través de tu tarjeta de presentación digital de Marcolin México.\n\nSaludos cordiales.",

  // Teléfono de contacto formal para la vCard
  phoneDisplay: "+52 56 1133 1198",

  // Dirección física y Google Maps
  address: "Campos Elíseos 403, Polanco, CDMX",
  googleMapsUrl: "https://maps.google.com/?q=Campos+El%C3%ADseos+403,+Polanco,+CDMX"
};

// =============================================================================
// INICIALIZACIÓN
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
  setupDynamicLinks();
  setupContactActions();
});

/**
 * Vincula los enlaces de WhatsApp, Correo y Ubicación
 */
function setupDynamicLinks() {
  const whatsappBtn = document.getElementById("whatsappBtn");
  const emailBtn = document.getElementById("emailBtn");
  const mapsBtn = document.getElementById("mapsBtn");

  if (whatsappBtn) {
    const encodedMsg = encodeURIComponent(ADVISOR_CONFIG.whatsappGreeting);
    whatsappBtn.href = `https://wa.me/${ADVISOR_CONFIG.whatsappNumber}?text=${encodedMsg}`;
  }

  if (emailBtn) {
    const encodedSubject = encodeURIComponent(ADVISOR_CONFIG.emailSubject);
    const encodedBody = encodeURIComponent(ADVISOR_CONFIG.emailBody);
    emailBtn.href = `mailto:${ADVISOR_CONFIG.email}?subject=${encodedSubject}&body=${encodedBody}`;
  }

  if (mapsBtn) {
    mapsBtn.href = ADVISOR_CONFIG.googleMapsUrl;
  }
}

/**
 * Configura los botones de "Guardar Contacto" y "Compartir mi contacto"
 */
function setupContactActions() {
  const saveContactBtn = document.getElementById("saveContactBtn");
  const shareBtn = document.getElementById("shareBtn");

  // 1. Guardar Contacto (Genera y descarga la vCard automáticamente)
  if (saveContactBtn) {
    saveContactBtn.addEventListener("click", () => {
      downloadVCard();
    });
  }

  // 2. Compartir Contacto (Usa API Nativa en móvil o Copia link en Desktop)
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      await handleShareContact();
    });
  }
}

/**
 * Genera dinámicamente un archivo .vcf con los datos de contacto y lo descarga
 */
function downloadVCard() {
  const vcardContent = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${ADVISOR_CONFIG.lastName};${ADVISOR_CONFIG.firstName};;;`,
    `FN:${ADVISOR_CONFIG.fullName}`,
    `ORG:${ADVISOR_CONFIG.company}`,
    `TITLE:${ADVISOR_CONFIG.title}`,
    `TEL;TYPE=CELL,VOICE:${ADVISOR_CONFIG.phoneDisplay}`,
    `EMAIL;TYPE=WORK,INTERNET:${ADVISOR_CONFIG.email}`,
    `ADR;TYPE=WORK:;;${ADVISOR_CONFIG.address};;;;`,
    `NOTE:Tu contacto comercial en Marcolin México.`,
    `URL:${window.location.href}`,
    "END:VCARD"
  ].join("\r\n");

  const blob = new Blob([vcardContent], { type: "text/vcard;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const tempLink = document.createElement("a");
  tempLink.href = url;
  tempLink.setAttribute("download", `${ADVISOR_CONFIG.fullName.replace(/\s+/g, "_")}_Marcolin.vcf`);
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  URL.revokeObjectURL(url);

  showToast("Descargando tarjeta de contacto...");
}

/**
 * Comparte la tarjeta mediante la Web Share API nativa o copia la URL
 */
async function handleShareContact() {
  const shareData = {
    title: `${ADVISOR_CONFIG.fullName} - ${ADVISOR_CONFIG.company}`,
    text: `Tarjeta de presentación de ${ADVISOR_CONFIG.fullName}, ${ADVISOR_CONFIG.title} en ${ADVISOR_CONFIG.company}.`,
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      if (err.name !== "AbortError") {
        copyToClipboard(window.location.href);
      }
    }
  } else {
    // Si el navegador no soporta Web Share API (ej. desktop)
    copyToClipboard(window.location.href);
  }
}

/**
 * Copia texto al portapapeles y muestra confirmación visual
 */
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => showToast("¡Enlace copiado al portapapeles!"))
      .catch(() => showToast("No se pudo copiar el enlace"));
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      showToast("¡Enlace copiado al portapapeles!");
    } catch (e) {
      showToast("No se pudo copiar el enlace");
    }
    document.body.removeChild(textArea);
  }
}

/**
 * Muestra el Toast informativo en la parte inferior
 */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}
