// ============================================================
// NIVEL 1 - Astral Travel - Partes del cuerpo
// Arrastrar y soltar (Pointer Events: funciona con mouse y touch)
// ============================================================

// Coordenadas reales calculadas sobre IMG/nino-cuerpo.png (620x615 px)
// x, y en PORCENTAJE del tamaño de la imagen, para que funcione en
// cualquier pantalla sin importar el tamaño en que se muestre.
const PUNTOS = [
  { parte: 'neck',  etiqueta: 'Neck',  x: 14.1, y: 70.8 },
  { parte: 'hair',  etiqueta: 'Hair',  x: 25.7, y: 11.3 },
  { parte: 'eye',   etiqueta: 'Eye',   x: 73.1, y: 10.4 },
  { parte: 'ear',   etiqueta: 'Ear',   x: 13.7, y: 27.4 },
  { parte: 'nose',  etiqueta: 'Nose',  x: 85.9, y: 29.2 },
  { parte: 'mouth', etiqueta: 'Mouth', x: 11.1, y: 48.6 },
  { parte: 'hand',  etiqueta: 'Hand',  x: 88.5, y: 49.7 },
  { parte: 'arm',   etiqueta: 'Arm',   x: 25.9, y: 90.4 },
  { parte: 'leg',   etiqueta: 'Leg',   x: 86.7, y: 71 },
  { parte: 'foot',  etiqueta: 'Foot',  x: 73.1, y: 90.4 },
];

const TOTAL_VIDAS = 3;
let vidas = TOTAL_VIDAS;
let aciertos = 0;

const imagenNino = document.getElementById('imagenNino');
const bancoEtiquetas = document.getElementById('bancoEtiquetas');
const vidasEl = document.getElementById('vidas');
const puntajeEl = document.getElementById('puntaje');
const pantallaVictoria = document.getElementById('pantallaVictoria');
const pantallaDerrota = document.getElementById('pantallaDerrota');

// ---------- construir los puntos de destino (droppables) ----------
function crearPuntosDrop() {
  PUNTOS.forEach(p => {
    const div = document.createElement('div');
    div.className = 'punto-drop';
    div.dataset.parte = p.parte;
    div.style.left = p.x + '%';
    div.style.top = p.y + '%';
    imagenNino.appendChild(div);
  });
}

// ---------- construir las etiquetas arrastrables (mezcladas) ----------
function crearEtiquetas() {
  const mezcladas = [...PUNTOS].sort(() => Math.random() - 0.5);
  mezcladas.forEach(p => {
    const div = document.createElement('div');
    div.className = 'etiqueta-arrastrable';
    div.dataset.parte = p.parte;
    div.textContent = p.etiqueta;
    bancoEtiquetas.appendChild(div);
    activarArrastre(div);
  });
}

// ---------- lógica de arrastre con Pointer Events ----------
function activarArrastre(etiqueta) {
  etiqueta.addEventListener('pointerdown', (e) => {
    e.preventDefault();

    const anchoOriginal = etiqueta.offsetWidth;
    const altoOriginal = etiqueta.offsetHeight;
    const offsetX = anchoOriginal / 2;
    const offsetY = altoOriginal / 2;

    etiqueta.setPointerCapture(e.pointerId);
    etiqueta.classList.add('arrastrando');
    mover(e.clientX, e.clientY);

    function mover(x, y) {
      etiqueta.style.left = (x - offsetX) + 'px';
      etiqueta.style.top = (y - offsetY) + 'px';
    }

    function alMover(ev) {
      mover(ev.clientX, ev.clientY);
    }

    function alSoltar(ev) {
      etiqueta.removeEventListener('pointermove', alMover);
      etiqueta.removeEventListener('pointerup', alSoltar);
      etiqueta.classList.remove('arrastrando');
      etiqueta.style.left = '';
      etiqueta.style.top = '';

      // ¿bajo qué elemento se soltó?
      etiqueta.style.pointerEvents = 'none';
      const elementoDebajo = document.elementFromPoint(ev.clientX, ev.clientY);
      etiqueta.style.pointerEvents = '';

      const zonaDrop = elementoDebajo ? elementoDebajo.closest('.punto-drop') : null;
      procesarSoltada(etiqueta, zonaDrop);
    }

    etiqueta.addEventListener('pointermove', alMover);
    etiqueta.addEventListener('pointerup', alSoltar);
  });
}

// ---------- procesar si acertó o falló ----------
function procesarSoltada(etiqueta, zonaDrop) {
  if (!zonaDrop || zonaDrop.classList.contains('correcto')) {
    // no soltó sobre ninguna zona válida (o la zona ya estaba resuelta): no pasa nada
    return;
  }

  const parteEtiqueta = etiqueta.dataset.parte;
  const partePunto = zonaDrop.dataset.parte;

  if (parteEtiqueta === partePunto) {
    // ¡acierto!
    zonaDrop.classList.add('correcto');
    zonaDrop.textContent = zonaDrop.textContent || etiqueta.textContent;
    zonaDrop.textContent = etiqueta.textContent;
    etiqueta.classList.add('usada');
    aciertos++;
    puntajeEl.textContent = aciertos;

    if (aciertos === PUNTOS.length) {
      setTimeout(mostrarVictoria, 400);
    }
  } else {
    // falla: pierde una vida
    etiqueta.classList.add('rechazada');
    setTimeout(() => etiqueta.classList.remove('rechazada'), 350);
    perderVida();
  }
}

// ---------- vidas ----------
function perderVida() {
  vidas--;
  actualizarVidas();
  if (vidas <= 0) {
    setTimeout(mostrarDerrota, 300);
  }
}

function actualizarVidas() {
  vidasEl.innerHTML = '';
  for (let i = 0; i < TOTAL_VIDAS; i++) {
    const corazon = document.createElement('span');
    corazon.textContent = '♥';
    if (i >= vidas) {
      corazon.classList.add('perdio');
    }
    vidasEl.appendChild(corazon);
  }
}

// ---------- pantallas finales ----------
function mostrarVictoria() {
  pantallaVictoria.hidden = false;
  if (typeof desbloquearSiguienteNivel === 'function') {
    desbloquearSiguienteNivel(1);
  } else {
    // Respaldo por si astral-travel.js no está cargado en esta página
    localStorage.setItem('engligo-astral-travel-nivel-desbloqueado', '2');
  }
}

function mostrarDerrota() {
  pantallaDerrota.hidden = false;
}

document.getElementById('botonReintentar').addEventListener('click', () => {
  location.reload();
});

// ---------- modo de calibración manual (por si necesitas ajustar algún punto) ----------
// Ábrelo desde la consola del navegador escribiendo: activarModoCalibracion()
function activarModoCalibracion() {
  imagenNino.addEventListener('click', (e) => {
    const rect = imagenNino.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
    console.log(`x: ${x}, y: ${y}`);
  });
  console.log('Modo calibración activo: haz clic sobre la imagen para ver las coordenadas (%) en la consola.');
}
window.activarModoCalibracion = activarModoCalibracion;

// ---------- iniciar ----------
crearPuntosDrop();
crearEtiquetas();
actualizarVidas();