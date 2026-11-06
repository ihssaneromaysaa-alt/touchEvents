// ej 4 touch move
const contenedorZoom = document.getElementById("contenedor-zoom");
const imagenZoom = document.getElementById("imagen-zoom");

let distanciaInicial = 0;
let escalaActual = 1;
let escalaAlIniciar = 1;

function calcularDistancia(t1, t2) {
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    return Math.hypot(dx, dy);
}

contenedorZoom.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) {
        distanciaInicial = calcularDistancia(e.touches[0], e.touches[1]);
        escalaAlIniciar = escalaActual;
    }
});

contenedorZoom.addEventListener("touchmove", (e) => {
    e.preventDefault();

    if (e.touches.length === 2 && distanciaInicial > 0) {
        const distanciaActual = calcularDistancia(e.touches[0], e.touches[1]);
        const ratio = distanciaActual / distanciaInicial;
        let nuevaEscala = escalaAlIniciar * ratio;

        // limitamos el zoom entre 0.5x y 4x
        nuevaEscala = Math.min(Math.max(0.5, nuevaEscala), 4);

        imagenZoom.style.transform = `scale(${nuevaEscala})`;
        escalaActual = nuevaEscala;
    }
}, { passive: false });

contenedorZoom.addEventListener("touchend", (e) => {
    if (e.touches.length < 2) {
        distanciaInicial = 0;
    }
});

// ejercicio 5 doble toque

const btnGestos = document.getElementById("btn-gestos");
const menuContextual = document.getElementById("menu-contextual");
document.getElementById("cerrar").addEventListener("click", cerrar);

let lastTap = 0;
let longPressTimer = null;

btnGestos.addEventListener("touchstart", (e) => {
  const now = Date.now();
  if(now - lastTap < 300){
    btnGestos.style.borderRadius = "50%";
    btnGestos.style.background = "#9b59b6";
  }
  lastTap = now;
  longPressTimer = setTimeout(()=>
  {
    menuContextual.classList.remove("oculto");
    // posicionar el menú cerca del botón
    const rect = btnGestos.getBoundingClientRect();
    menuContextual.style.top = (rect.bottom + 10) + "px";
    menuContextual.style.left = (rect.left) + "px";
  }, 1000);
});

function cerrar(){
  menuContextual.classList.add("oculto");
}

btnGestos.addEventListener("touchend", () => {
  clearTimeout(longPressTimer);
});

btnGestos.addEventListener("touchmove", () => {
  clearTimeout(longPressTimer);
});

 // ej 6 carrusel magnetico
/*
    PISTAS:

    1. Variables necesarias:
       - startX → posición X donde empezó el toque
       - currentTranslate → cuánto está desplazado el carrusel actualmente
       - prevTranslate → posición anterior (para calcular el movimiento)

    2. touchstart:
       - Guarda e.touches[0].clientX en startX
       - Quita cualquier transición (para que se mueva libre)

    3. touchmove:
       - Calcula la diferencia: e.touches[0].clientX - startX
       - Aplica transform: translateX(...) al #carrusel

    4. touchend (lo más importante):
       - Calcula en qué posición se quedó
       - Averigua qué tarjeta está más cerca del centro
       - Aplica una transición CSS suave
       - Mueve el carrusel hasta que esa tarjeta quede centrada

    5. Truco para el snap:
       - Ancho de cada tarjeta + gap
       - Math.round(posicion / anchoTarjeta) → índice de la tarjeta más cercana
*/

const carrusel = document.getElementById("carrusel");
const wrapper = document.getElementById("carrusel-wrapper");

// Variables que vas a necesitar:
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let isDragging = false;

carrusel.addEventListener("touchstart", (e) => {
  isDragging = true;
  startX = e.touches[0].clientX;
  prevTranslate = currentTranslate;

  carrusel.style.transition = "none";
});
carrusel.addEventListener("touchmove", (e) => { 
   if(!isDragging) return;
   const currentX = e.touches[0].clientX;
   const diff = currentX - startX;

   currentTranslate = prevTranslate + diff;
   carrusel.style.transform = `translateX(${currentTranslate})`;
 });
carrusel.addEventListener("touchend", () => {
  isDragging = false;

  const cardWidth = 280;
  const gap = 15;   
  const totalCard = cardWidth + gap;

  const index = Math.round(-currentTranslate / totalCard);

  // limitamos el índice para que no se salga de las tarjetas
  const maxIndex = carrusel.children.length - 1;
  const safeIndex = Math.max(0, Math.min(index, maxIndex));

  currentTranslate = -safeIndex * totalCard;

  // activamos la transición suave
  carrusel.style.transition = "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  carrusel.style.transform = `translateX(${currentTranslate}px)`;

  prevTranslate = currentTranslate;
});

// ======================================================
//  EJERCICIO 7 - DRAG & DROP CON TOUCH
// ======================================================
/*
    PISTAS IMPORTANTES:

    1. El círculo se mueve con position: absolute + left/top
       o con transform: translate()

    2. touchstart:
       - Guarda la posición inicial del dedo y del círculo

    3. touchmove:
       - Calcula cuánto se ha movido el dedo
       - Actualiza left y top del círculo (o el transform)

    4. touchend → AQUÍ ESTÁ EL RETO:
       - Los eventos touch NO saben sobre qué elemento estás
       - Usa: document.elementFromPoint(x, y)
       - Pásale las coordenadas del último toque
       - Si el elemento encontrado tiene la clase "caja-drop"
         → mueve el círculo dentro de esa caja
         → puedes cambiar el estilo de la caja (clase "ocupada")

    5. Para centrar el círculo dentro de la caja:
       - Puedes usar getBoundingClientRect() de la caja
       - O simplemente appendChild + posición relativa
*/

const circulo = document.getElementById("circulo");
const cajas = document.querySelectorAll(".caja-drop");

// Variables que vas a necesitar:
// let offsetX = 0;
// let offsetY = 0;
// let isDraggingCircle = false;

// circulo.addEventListener("touchstart", (e) => { ... });
// circulo.addEventListener("touchmove", (e) => { ... });
// circulo.addEventListener("touchend", (e) => {
//     // Aquí usas document.elementFromPoint(...)
// });