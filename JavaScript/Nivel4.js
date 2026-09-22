// ============================================================
// NIVEL 4 - Astral Travel - Colores (pintar los planetas)
// ============================================================

const COLORES = [
  { parte: 'red',    etiqueta: 'Red',    color: '#ff6b6b' },
  { parte: 'blue',   etiqueta: 'Blue',   color: '#4b8bd6' },
  { parte: 'green',  etiqueta: 'Green',  color: '#4ade9e' },
  { parte: 'orange', etiqueta: 'Orange', color: '#ffa94d' },
  { parte: 'purple', etiqueta: 'Purple', color: '#8b6cf0' },
  { parte: 'yellow', etiqueta: 'Yellow', color: '#ffe066' },
];

const TOTAL_VIDAS = 3;
let vidas = TOTAL_VIDAS;
let aciertos = 0;

const galaxia = document.getElementById('galaxia');
const bancoPinturas = document.getElementById('bancoPinturas');
const vidasEl = document.getElementById('vidas');
const puntajeEl = document.getElementById('puntaje');
const pantallaVictoria = document.getElementById('pantallaVictoria');
const pantallaDerrota = document.getElementById('pantallaDerrota');

// ---------- construir las 6 estrellas (sin pintar, pero con nombre) ----------
function crearPlanetas() {
  COLORES.forEach(c => {
    const div = document.createElement('div');
    div.className = 'estrella';
    div.dataset.parte = c.parte;
    div.style.setProperty('--color-planeta', c.color);
    div.innerHTML = `
      <img class="imagen-estrella" src="IMG/estrella-blanca.png" alt="Estrella ${c.etiqueta}">
      <span class="etiqueta-planeta">${c.etiqueta}</span>
    `;
    galaxia.appendChild(div);
  });
}

// ---------- construir las gotas de pintura arrastrables (mezcladas, sin texto) ----------
function crearPinturas() {
  const mezcladas = [...COLORES].sort(() => Math.random() - 0.5);
  mezcladas.forEach(c => {
    const div = document.createElement('div');
    div.className = 'pintura-arrastrable';
    div.dataset.parte = c.parte;
    div.innerHTML = `<img src="IMG/estrella-${c.parte}.png" alt="${c.etiqueta}" class="imagen-pintura">`;
    bancoPinturas.appendChild(div);
    activarArrastre(div);
  });
}

// ---------- lógica de arrastre con Pointer Events ----------
function activarArrastre(pintura) {
  pintura.addEventListener('pointerdown', (e) => {
    e.preventDefault();

    const offsetX = pintura.offsetWidth / 2;
    const offsetY = pintura.offsetHeight / 2;

    pintura.setPointerCapture(e.pointerId);
    pintura.classList.add('arrastrando');
    mover(e.clientX, e.clientY);

    function mover(x, y) {
      pintura.style.left = (x - offsetX) + 'px';
      pintura.style.top = (y - offsetY) + 'px';
    }
    function alMover(ev) { mover(ev.clientX, ev.clientY); }

    function alSoltar(ev) {
      pintura.removeEventListener('pointermove', alMover);
      pintura.removeEventListener('pointerup', alSoltar);
      pintura.classList.remove('arrastrando');
      pintura.style.left = '';
      pintura.style.top = '';

      pintura.style.pointerEvents = 'none';
      const elementoDebajo = document.elementFromPoint(ev.clientX, ev.clientY);
      pintura.style.pointerEvents = '';

      const planeta = elementoDebajo ? elementoDebajo.closest('.estrella') : null;
      procesarSoltada(pintura, planeta);
    }

    pintura.addEventListener('pointermove', alMover);
    pintura.addEventListener('pointerup', alSoltar);
  });
}

// ---------- procesar si acertó o falló ----------
function procesarSoltada(pintura, planeta) {
  if (!planeta || planeta.classList.contains('correcto')) return;

  if (pintura.dataset.parte === planeta.dataset.parte) {

    // ¡Acierto! Se coloca la imagen de color sobre la estrella blanca
    const imagenColor = document.createElement('img');

    imagenColor.src = `IMG/estrella-${planeta.dataset.parte}.png`;
    imagenColor.alt = '';
    imagenColor.className = 'imagen-color';

    planeta.appendChild(imagenColor);
    planeta.classList.add('correcto');

    pintura.classList.add('usada');
    aciertos++;
    puntajeEl.textContent = aciertos;

    if (aciertos === COLORES.length) {
      setTimeout(mostrarVictoria, 400);
    }

  } else {

    pintura.classList.add('rechazada');
    planeta.classList.add('resaltado');

    setTimeout(() => {
      pintura.classList.remove('rechazada');
      planeta.classList.remove('resaltado');
    }, 350);

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
  guardarProgreso(4, aciertos, COLORES.length);
  if (typeof desbloquearSiguienteNivel === 'function') {
    desbloquearSiguienteNivel(4);
  } else {
    localStorage.setItem('engligo-astral-travel-nivel-desbloqueado', '5');
  }
}

// ---------- guardar el progreso del estudiante (para la página de progreso) ----------
function guardarProgreso(nivel, puntaje, total) {
  const clave = 'engligo-astral-travel-progreso';
  let datos = {};
  try { datos = JSON.parse(localStorage.getItem(clave)) || {}; } catch (e) { datos = {}; }
  datos[nivel] = { completado: true, puntaje, total, fecha: new Date().toISOString() };
  localStorage.setItem(clave, JSON.stringify(datos));
}
function mostrarDerrota() { pantallaDerrota.hidden = false; }
document.getElementById('botonReintentar').addEventListener('click', () => location.reload());

// ---------- iniciar ----------
crearPlanetas();
crearPinturas();
actualizarVidas();