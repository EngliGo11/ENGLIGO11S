// ============================================================
// NIVEL 3 - Astral Travel - Animales y su hábitat
// ============================================================

const HABITATS = [
  { parte: 'dog',    etiqueta: 'Dog',    imagen: 'IMG/habitat-lion.png' },
  { parte: 'cat',    etiqueta: 'Cat',    imagen: 'IMG/habitat-cat.png' },
  { parte: 'bird',   etiqueta: 'Bird',   imagen: 'IMG/habitat-bird.png' },
  { parte: 'fish',   etiqueta: 'Fish',   imagen: 'IMG/habitat-fish.png' },
  { parte: 'rabbit', etiqueta: 'Rabbit', imagen: 'IMG/habitat-rabbit.png' },
  { parte: 'turtle', etiqueta: 'Turtle', imagen: 'IMG/habitat-turtle.png' },
];

const ANIMALES = [
  { parte: 'dog',    imagen: 'IMG/lion.png' },
  { parte: 'cat',    imagen: 'IMG/cat.png' },
  { parte: 'bird',   imagen: 'IMG/bird.png' },
  { parte: 'fish',   imagen: 'IMG/fish.png' },
  { parte: 'rabbit', imagen: 'IMG/rabbit.png' },
  { parte: 'turtle', imagen: 'IMG/turtle.png' },
];

const TOTAL_VIDAS = 3;
let vidas = TOTAL_VIDAS;
let aciertos = 0;

const habitatsEl = document.getElementById('habitats');
const bancoAnimales = document.getElementById('bancoAnimales');
const vidasEl = document.getElementById('vidas');
const puntajeEl = document.getElementById('puntaje');
const pantallaVictoria = document.getElementById('pantallaVictoria');
const pantallaDerrota = document.getElementById('pantallaDerrota');

// ---------- construir los 6 círculos de hábitat ----------
function crearHabitats() {
  HABITATS.forEach(h => {
    const div = document.createElement('div');
    div.className = 'habitat';
    div.dataset.parte = h.parte;
    div.innerHTML = `
      <img class="fondo-habitat" src="${h.imagen}" alt="Hábitat de ${h.etiqueta}">
    `;
    habitatsEl.appendChild(div);
  });
}

// ---------- construir los animales arrastrables (mezclados) ----------
function crearAnimales() {
  const mezclados = [...ANIMALES].sort(() => Math.random() - 0.5);
  mezclados.forEach(a => {
    const div = document.createElement('div');
    div.className = 'animal-arrastrable';
    div.dataset.parte = a.parte;
    div.innerHTML = `<img src="${a.imagen}" alt="${a.parte}">`;
    bancoAnimales.appendChild(div);
    activarArrastre(div);
  });
}

// ---------- lógica de arrastre con Pointer Events ----------
function activarArrastre(animal) {
  animal.addEventListener('pointerdown', (e) => {
    e.preventDefault();

    const offsetX = animal.offsetWidth / 2;
    const offsetY = animal.offsetHeight / 2;

    animal.setPointerCapture(e.pointerId);
    animal.classList.add('arrastrando');
    mover(e.clientX, e.clientY);

    function mover(x, y) {
      animal.style.left = (x - offsetX) + 'px';
      animal.style.top = (y - offsetY) + 'px';
    }
    function alMover(ev) { mover(ev.clientX, ev.clientY); }

    function alSoltar(ev) {
      animal.removeEventListener('pointermove', alMover);
      animal.removeEventListener('pointerup', alSoltar);
      animal.classList.remove('arrastrando');
      animal.style.left = '';
      animal.style.top = '';

      animal.style.pointerEvents = 'none';
      const elementoDebajo = document.elementFromPoint(ev.clientX, ev.clientY);
      animal.style.pointerEvents = '';

      const habitat = elementoDebajo ? elementoDebajo.closest('.habitat') : null;
      procesarSoltada(animal, habitat);
    }

    animal.addEventListener('pointermove', alMover);
    animal.addEventListener('pointerup', alSoltar);
  });
}

// ---------- procesar si acertó o falló ----------
function procesarSoltada(animal, habitat) {
  if (!habitat || habitat.classList.contains('correcto')) return;

  if (animal.dataset.parte === habitat.dataset.parte) {
    // ¡acierto!
    habitat.classList.add('correcto');
    const imagenAnimal = animal.querySelector('img').src;
    const colocado = document.createElement('img');
    colocado.className = 'animal-colocado';
    colocado.src = imagenAnimal;
    habitat.appendChild(colocado);

    animal.classList.add('usada');
    aciertos++;
    puntajeEl.textContent = aciertos;

    if (aciertos === HABITATS.length) {
      setTimeout(mostrarVictoria, 400);
    }
  } else {
    animal.classList.add('rechazada');
    habitat.classList.add('resaltado');
    setTimeout(() => {
      animal.classList.remove('rechazada');
      habitat.classList.remove('resaltado');
    }, 700);
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
    desbloquearSiguienteNivel(3);
  } else {
    localStorage.setItem('engligo-astral-travel-nivel-desbloqueado', '4');
  }
}
function mostrarDerrota() { pantallaDerrota.hidden = false; }
document.getElementById('botonReintentar').addEventListener('click', () => location.reload());

// ---------- iniciar ----------
crearHabitats();
crearAnimales();
actualizarVidas();