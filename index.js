const contenedor = document.getElementById("contenedor");
const imagen = document.getElementById("imagen");

let distanciaInicial = 0;   // Distancia cuando se ponen los 2 dedos
let escalaActual = 1;       // Escala actual de la imagen
let escalaAlIniciar = 1;    // Escala que tenía cuando empezó el gesto

// Función para calcular la distancia entre dos puntos
function calcularDistancia(t1, t2) {
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    return Math.hypot(dx, dy); // Distancia euclidiana
}

contenedor.addEventListener("touchstart", function(e) {
    if (e.touches.length === 2) {
        // Guardamos la distancia inicial entre los dos dedos
        distanciaInicial = calcularDistancia(e.touches[0], e.touches[1]);
        escalaAlIniciar = escalaActual; // Guardamos la escala actual
    }
});

contenedor.addEventListener("touchmove", function(e) {
    // Evitamos que el navegador haga zoom o scroll
    e.preventDefault();

    if (e.touches.length === 2 && distanciaInicial > 0) {
        const distanciaActual = calcularDistancia(e.touches[0], e.touches[1]);

        // Calculamos cuánto ha cambiado la distancia (ratio)
        const ratio = distanciaActual / distanciaInicial;

        // Nueva escala = escala que tenía al empezar × el ratio
        let nuevaEscala = escalaAlIniciar * ratio;

        // Limitamos el zoom (opcional pero recomendable)
        nuevaEscala = Math.min(Math.max(0.5, nuevaEscala), 4); // entre 0.5x y 4x

        // Aplicamos el scale
        imagen.style.transform = `scale(${nuevaEscala})`;
        escalaActual = nuevaEscala;
    }
}, { passive: false }); // passive: false es obligatorio para poder usar preventDefault

contenedor.addEventListener("touchend", function(e) {
    // Cuando se levantan los dedos, reiniciamos la distancia inicial
    if (e.touches.length < 2) {
        distanciaInicial = 0;
    }
});