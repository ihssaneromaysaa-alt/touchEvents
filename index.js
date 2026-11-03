// ejercicio 4
// Crea un contenedor con una imagen. Detecta cuando el usuario toca la pantalla con dos dedos
//  comprobando que e.touches.length === 2. Calcula la distancia entre ambos puntos en tiempo 
// real durante el evento touchmove. Si la distancia aumenta respecto al toque inicial, aplica 
// una propiedad CSS transform: scale() para agrandar la imagen; si disminuye, redúcela.

let div4 = document.getElementById("e4");
div4.addEventListener("touchmove",function(event){
    event.preventDefault();

  if (event.touches.length >= 2) {
    const touch1 = event.touches[0]; // Primer dedo
    const touch2 = event.touches[1]; // Segundo dedo

    // Coordenadas
    const x1 = touch1.clientX;
    const y1 = touch1.clientY;
    const x2 = touch2.clientX;
    const y2 = touch2.clientY;

    // Distancia euclidiana
    const distancia = Math.hypot(x2 - x1, y2 - y1);
    // o también: Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

    console.log('Distancia entre dedos:', distancia);
  }
}, { passive: false }); // passive: false para poder usar preventDefault