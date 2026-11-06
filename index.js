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

// ejercicio 7
const circulo = document.getElementById("circulo");
const cajas = document.querySelectorAll(".caja-drop");

let offsetX = 0;
let offsetY = 0;
let isDraggingCircle = false;
let startLeft = 0;
let startTop = 0;

circulo.addEventListener("touchstart", (e) => {
  e.preventDefault(); 
  isDraggingCircle = true;

  const touch = e.touches[0];
  const rect = circulo.getBoundingClientRect();

  // distancia entre el dedo y la esquina superior izquierda del círculo
  offsetX = touch.clientX - rect.left;
  offsetY = touch.clientY - rect.top;

  // guardamos la posición actual (por si usas left/top)
  startLeft = rect.left + window.scrollX;
  startTop = rect.top + window.scrollY;

  // subimos el círculo por encima de todo mientras se arrastra
  circulo.style.zIndex = "1000";
  circulo.style.transition = "none";
});

circulo.addEventListener("touchmove", (e) => {
  if (!isDraggingCircle) return;
  e.preventDefault();

  const touch = e.touches[0];

  // nueva posición del círculo
  const newLeft = touch.clientX - offsetX;
  const newTop = touch.clientY - offsetY;

  // movemos con left / top (posición absoluta)
  /*
  circulo.style.left = newLeft + "px";
  circulo.style.top = newTop + "px";
*/
  // alternativa con transform (más fluida):
  circulo.style.transform = `translate(${newLeft}px, ${newTop}px)`;
});

circulo.addEventListener("touchend", (e) => {
  if (!isDraggingCircle) return;
  isDraggingCircle = false;

  // coordenadas del último toque
  const touch = e.changedTouches[0];
  const x = touch.clientX;
  const y = touch.clientY;

  // buscamos qué elemento está debajo del dedo
  const elementoDebajo = document.elementFromPoint(x, y);

  if (elementoDebajo && elementoDebajo.classList.contains("caja-drop")) {
    
    // movemos el círculo dentro de la caja
    elementoDebajo.appendChild(circulo);

    // centramos el círculo dentro de la caja
    circulo.style.position = "relative";
    circulo.style.left = "50%";
    circulo.style.top = "50%";
    circulo.style.transform = "translate(-50%, -50%)";
    circulo.style.zIndex = "1";

    // marcamos la caja como ocupada
    elementoDebajo.classList.add("ocupada");

  } else {
    // si no soltó sobre una caja, lo dejamos donde está
    // (o puedes devolverlo a la posición original)
    circulo.style.zIndex = "1";
  }
});