const temas = [
  
  { nombre: "Greetings and farewells", icono: "IMG/saludo-despedida.png", esImagen: true, color: "#413ac7", pagina: "saludos.html" },
  { nombre: "Classroom Objects", icono:"IMG/objetos 1.png", esImagen: true, color: "#ff7ef4", pagina: "objetos.html" },
  { nombre: "Animals", icono: "IMG/animales 1.png", esImagen: true, color: "#70f7ad", pagina: "animales.html" },
  { nombre: "Colors", icono: "IMG/colores 1.png", esImagen: true, color: "#f46262", pagina: "colores.html" },
  { nombre: "Body", icono: "IMG/cuerpo.png", esImagen: true, color: "#edff4d", pagina: "partes-cuerpo.html" }
];
 
 
const contenedor = document.getElementById("gridTemas");
 
 
temas.forEach((tema) => {
  const tarjeta = document.createElement("div");
  tarjeta.className = "tarjeta-tema";
  tarjeta.style.setProperty("--color-tema", tema.color);
  tarjeta.style.setProperty("--color-tema-suave", tema.color + "26");
 
  const contenidoIlustracion = tema.esImagen
    ? `<img src="${tema.icono}" alt="${tema.nombre}" />`
    : tema.icono;
 
  tarjeta.innerHTML = `
    <div class="ilustracion">${contenidoIlustracion}</div>
  `;
 
  tarjeta.addEventListener("click", () => {
    window.location.href = tema.pagina;
  });
 
  contenedor.appendChild(tarjeta);
});
