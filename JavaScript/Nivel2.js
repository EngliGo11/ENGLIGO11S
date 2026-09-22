// Astral Travel - Nivel 2 (objetos de clase): True or False
// Para agregar el objeto que falta (cuaderno): guarda su foto en IMG/
// y descomenta la línea de "notebook".
const OBJETOS = [
  { palabra: "backpack", imagen: "IMG/maleta.png" },
  { palabra: "ruler",    imagen: "IMG/regla.png" },
  { palabra: "board",    imagen: "IMG/tablero.png" },
  { palabra: "book",     imagen: "IMG/book.png" },
  { palabra: "pencil",   imagen: "IMG/lapiz.png" },
  { palabra: "scissors", imagen: "IMG/tijeras.png" }
  // , { palabra: "notebook", imagen: "IMG/cuaderno.png" }
];

const NUMERO_NIVEL = 2;
const PUNTOS_POR_ACIERTO = 10;
const PUNTOS_PARA_GANAR = 100;
const VIDAS_TOTALES = 3;

const CLAVE_DESBLOQUEO = "engligo-astral-travel-nivel-desbloqueado";
const CLAVE_PROGRESO = "engligo-astral-travel-progreso";

const el = (id) => document.getElementById(id);
const tarjeta = el("tarjeta");
const btnTrue = el("btnTrue");
const btnFalse = el("btnFalse");

let puntos, vidas, actual, mostrada, anterior;

function iniciar() {
  puntos = 0;
  vidas = VIDAS_TOTALES;
  anterior = null;
  el("pantallaDerrota").hidden = true;
  actualizarHud();
  siguienteRonda();
}

function actualizarHud() {
  el("puntaje").textContent = puntos;

  const corazones = [];

  for (let i = 0; i < VIDAS_TOTALES; i++) {
    if (i < vidas) {
      corazones.push("<span>♥</span>");
    } else {
      corazones.push('<span class="perdio">♥</span>');
    }
  }

  el("vidas").innerHTML = corazones.join("");

  el("barra").style.width =
    Math.min(100, (puntos / PUNTOS_PARA_GANAR) * 100) + "%";
}

function elegir(lista, excluir) {
  const opciones = lista.filter((o) => o !== excluir);
  return opciones[Math.floor(Math.random() * opciones.length)];
}

function siguienteRonda() {
  tarjeta.classList.remove("correcto", "incorrecto");
  actual = elegir(OBJETOS, anterior);
  anterior = actual;

  // 50% muestra la palabra correcta y 50% la de otro objeto
  mostrada = Math.random() < 0.5 ? actual : elegir(OBJETOS, actual);

  el("foto").src = actual.imagen;
  el("palabra").textContent = mostrada.palabra;
  activarBotones(true);
}

function activarBotones(activos) {
  btnTrue.disabled = !activos;
  btnFalse.disabled = !activos;
}

function responder(dijoVerdadero) {
  activarBotones(false);
  const acierto = dijoVerdadero === (mostrada === actual);

  tarjeta.classList.add(acierto ? "correcto" : "incorrecto");

  if (acierto) {
    puntos += PUNTOS_POR_ACIERTO;
  } else {
    vidas -= 1;
  }
  actualizarHud();

  setTimeout(() => {
    if (puntos >= PUNTOS_PARA_GANAR) return ganar();
    if (vidas === 0) return perder();
    siguienteRonda();
  }, 900);
}

// Desbloquea el Nivel 3 sin bajar el progreso que ya exista
function desbloquearSiguiente() {
  try {
    const desbloqueado = Number(localStorage.getItem(CLAVE_DESBLOQUEO)) || 1;
    if (desbloqueado < NUMERO_NIVEL + 1) {
      localStorage.setItem(CLAVE_DESBLOQUEO, String(NUMERO_NIVEL + 1));
    }
  } catch (e) { /* sin localStorage no se guarda */ }
}

// Guarda el resultado para la página de progreso
function guardarProgreso(puntaje, total) {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_PROGRESO)) || {};
    datos[NUMERO_NIVEL] = {
      completado: true,
      puntaje: puntaje,
      total: total,
      fecha: new Date().toISOString()
    };
    localStorage.setItem(CLAVE_PROGRESO, JSON.stringify(datos));
  } catch (e) { /* sin localStorage no se guarda */ }
}

function ganar() {
  desbloquearSiguiente();
  guardarProgreso(puntos, PUNTOS_PARA_GANAR);
  el("pantallaVictoria").hidden = false;
}

function perder() {
  el("pantallaDerrota").hidden = false;
  el("botonReintentar").focus();
}

btnTrue.addEventListener("click", () => responder(true));
btnFalse.addEventListener("click", () => responder(false));
el("botonReintentar").addEventListener("click", iniciar);

iniciar();