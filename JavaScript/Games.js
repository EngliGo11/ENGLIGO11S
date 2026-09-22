const temas = [
  
   {nombre: "Meteor challege",icono: "IMG/meteorchallenge.png",esImagen: true, color: "#2f2d9e", pagina: "Meteorchallege.html"},
   {nombre: "Complete the word",icono: "IMG/word.png",esImagen: true, color: "#aa5bff",pagina: "words.html"},
   {nombre: "Word Search", icono: "IMG/sopa.png", esImagen: true, color: "#5ba5ff",pagina: "Wordsearch.html"}, 
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