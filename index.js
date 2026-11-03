
const caja = document.getElementById("caja");

// Colores que vamos a usar
const colorNormal = "#3498db";
const colorDosDedos = "#e74c3c";

caja.addEventListener("touchstart", function(e) {
  // Solo reaccionamos si hay exactamente 2 dedos
  if (e.touches.length === 2) {
    caja.style.backgroundColor = colorDosDedos;
    caja.textContent = "¡2 dedos detectados!";
  }
});

caja.addEventListener("touchend", function(e) {
  // Cuando se levantan los dedos, volvemos al color original
  // e.touches.length es el número de dedos que SIGUEN tocando
  if (e.touches.length < 2) {
    caja.style.backgroundColor = colorNormal;
    caja.textContent = "Toca con 2 dedos";
  }
});

// Opcional: también reaccionamos si durante el movimiento siguen siendo 2 dedos
caja.addEventListener("touchmove", function(e) {
  e.preventDefault(); // Evita que la página se mueva
  if (e.touches.length === 2) {
    caja.style.backgroundColor = colorDosDedos;
  }
}, { passive: false });