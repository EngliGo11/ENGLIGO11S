const NIVELES = [
    { numero: 1, nombre: "Nivel 1", tema: "partes-cuerpo",      pagina: "nivel1.html", icono: "IMG/Level1.png", esImagen: true, color:"#fbfb9a"},
    { numero: 2, nombre: "Nivel 2", tema: "objetos-clase",      pagina: "nivel2.html", icono: "IMG/Level2.png", candado: "IMG/candado2.png", esImagen: true, color:"#a64dc9 "},
    { numero: 3, nombre: "Nivel 3", tema: "animales",           pagina: "nivel3.html", icono: "IMG/Level3.png", candado: "IMG/candado3.png", esImagen: true, color:"#7dffe7 "},
    { numero: 4, nombre: "Nivel 4", tema: "colores",            pagina: "nivel4.html", icono: "IMG/Level4.png", candado: "IMG/candado4.png", esImagen: true,color:"#ff7d7d"},
    { numero: 5, nombre: "Nivel 5", tema: "saludos-despedidas", pagina: "nivel5.html", icono: "IMG/Level5.png", candado: "IMG/candado5.png", esImagen: true, color:"#7dafff"}
];
 
const CLAVE_PROGRESO = "engligo-astral-travel-nivel-desbloqueado";
 
/* ---------------------------------------------------------
   2. PROGRESO GUARDADO (localStorage)
   Se guarda solo un número: el nivel más alto que el
   estudiante puede jugar. Empieza en 1 (solo el Nivel 1
   desbloqueado) si nunca ha jugado antes.
--------------------------------------------------------- */
function obtenerNivelDesbloqueado() {
  const guardado = localStorage.getItem(CLAVE_PROGRESO);
  const numero = guardado ? parseInt(guardado, 10) : 1;
  return Number.isNaN(numero) ? 1 : numero;
}
 
/* Llamar esta función desde el JS de cada nivel al completarlo.
   Ejemplo: al ganar el Nivel 3, llamar desbloquearSiguienteNivel(3)
   para que el Nivel 4 quede jugable. */
function desbloquearSiguienteNivel(numeroNivelCompletado) {
  const actual = obtenerNivelDesbloqueado();
  const siguiente = numeroNivelCompletado + 1;
  if (siguiente > actual) {
    localStorage.setItem(CLAVE_PROGRESO, String(siguiente));
  }
}
 
/* ---------------------------------------------------------
   3. RENDERIZADO DE LAS TARJETAS
--------------------------------------------------------- */
const contenedor = document.getElementById("gridNiveles");
const nivelDesbloqueado = obtenerNivelDesbloqueado();
 
NIVELES.forEach((nivel) => {
  const estaDesbloqueado = nivel.numero <= nivelDesbloqueado;
 
  const tarjeta = document.createElement("div");
  tarjeta.className = "tarjeta-nivel" + (estaDesbloqueado ? "" : " bloqueado");
  tarjeta.style.setProperty("--color-aura", nivel.color);
 
  const contenidoIlustracion = `
  <img src="${nivel.icono}" alt="${nivel.nombre}" class="imagen-nivel">

  ${!estaDesbloqueado && nivel.candado
    ? `<img src="${nivel.candado}" alt="Candado" class="imagen-candado">`
    : ""}
`;
 
  tarjeta.innerHTML = `
    <div class="ilustracion-nivel">${contenidoIlustracion}</div>
`;
 
  tarjeta.addEventListener("click", () => {
    if (estaDesbloqueado) {
      window.location.href = nivel.pagina;
    }
    // Si está bloqueado, el clic no hace nada (el candado ya
    // comunica visualmente que no se puede entrar todavía)
  });
 
  contenedor.appendChild(tarjeta);
});