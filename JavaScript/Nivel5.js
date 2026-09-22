// ============================================================
// NIVEL 5 - Astral Travel - Saludos y despedidas (completar historia)
// ============================================================

// Respuestas aceptadas por cada espacio (en minúsculas, sin signos de puntuación)
const RESPUESTAS = {
  good_morning:   ['good morning'],
  hello:          ['hello', 'hi'],
  good_afternoon: ['good afternoon'],
  good_night:     ['good night'],
  goodbye:        ['goodbye', 'bye'],
  see_you_later:  ['see you later', 'see you soon', 'see you'],
};

const TOTAL_BLANCOS = Object.keys(RESPUESTAS).length;
const TOTAL_VIDAS = 3;
let vidas = TOTAL_VIDAS;
let aciertos = 0;

const historiaEl = document.getElementById('historia');
const vidasEl = document.getElementById('vidas');
const puntajeEl = document.getElementById('puntaje');
const pantallaVictoria = document.getElementById('pantallaVictoria');
const pantallaDerrota = document.getElementById('pantallaDerrota');

function espacio(parte) {
  return `<input type="text" class="espacio-blanco" data-parte="${parte}" autocomplete="off" spellcheck="false">`;
}

// ---------- construir la historia con los espacios ----------
function crearHistoria() {
  historiaEl.innerHTML = `
    <p>Es lunes por la mañana y Sofía llega a la escuela. Al ver a su profesora en la puerta, le dice:
    “${espacio('good_morning')}, teacher!”</p>

    <p>En el pasillo se encuentra con su mejor amigo Tomás y lo saluda con un simple:
    “${espacio('hello')}, Tomás!”</p>

    <p>A la hora del almuerzo, se cruza con la profesora de música y le dice:
    “${espacio('good_afternoon')}!”</p>

    <p>Por la noche, antes de dormir, su papá entra a su cuarto y le dice:
    “${espacio('good_night')}, sweetie.”</p>

    <p>Al terminar la última clase del día, Sofía se despide de su profesora:
    “${espacio('goodbye')}, teacher! Have a nice day.”</p>

    <p>Y a Tomás, que la verá mañana en la escuela, le dice:
    “${espacio('see_you_later')}, Tomás!”</p>
  `;

  historiaEl.querySelectorAll('.espacio-blanco').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        revisarEspacio(input);
      }
    });
  });
}

// ---------- normalizar texto para comparar ----------
function normalizar(texto) {
  return texto
    .toLowerCase()
    .trim()
    .replace(/[.,!¡¿?]/g, '')
    .replace(/\s+/g, ' ');
}

// ---------- revisar una respuesta ----------
function revisarEspacio(input) {
  if (input.classList.contains('correcto')) return;

  const parte = input.dataset.parte;
  const valor = normalizar(input.value);
  const aceptadas = RESPUESTAS[parte];

  if (valor && aceptadas.includes(valor)) {
    input.classList.add('correcto');
    input.readOnly = true;
    aciertos++;
    puntajeEl.textContent = aciertos;

    if (aciertos === TOTAL_BLANCOS) {
      setTimeout(mostrarVictoria, 400);
    }
  } else {
    input.classList.remove('incorrecto');
    void input.offsetWidth; // reiniciar animación
    input.classList.add('incorrecto');
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
  let corazones = "";
  for (let i = 0; i < TOTAL_VIDAS; i++) {
    if (i < vidas) {
      corazones += '<span>♥</span>';
    } else {
      corazones += '<span class="perdio">♥</span>';
    }

  }
  vidasEl.innerHTML = corazones;
}

// ---------- pantallas finales ----------
function mostrarVictoria() {
  pantallaVictoria.hidden = false;
  if (typeof desbloquearSiguienteNivel === 'function') {
    desbloquearSiguienteNivel(5);
  }
}
function mostrarDerrota() {
  historiaEl.querySelectorAll('.espacio-blanco').forEach(i => i.disabled = true);
  pantallaDerrota.hidden = false;
}
document.getElementById('botonReintentar').addEventListener('click', () => location.reload());

// ---------- iniciar ----------
crearHistoria();
actualizarVidas();