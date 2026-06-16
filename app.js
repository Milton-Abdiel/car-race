const canvas = document.getElementById("juego");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// ========================
// VARIABLES
// ========================

let puntos = 0;
let vidas = 3;
let velocidad = 5;
let monedas = 0;
let juegoTerminado = false;

let record = localStorage.getItem("record") || 0;

// ========================
// IMÁGENES
// ========================

const fondo = new Image();
fondo.src = "fondo-carretera.jfif";

const jugadorImg = new Image();
jugadorImg.src = "carro-jugador.jfif";

const monedaImg = new Image();
monedaImg.src = "icono-monedas.jfif";

const enemigosImg = [];

for(let i = 1; i <= 4; i++){

    const img = new Image();

    img.src = `carro-enemigo${i}.jfif`;

    enemigosImg.push(img);

}

// ========================
// FONDO
// ========================

let fondoY = 0;

// ========================
// JUGADOR
// ========================

const jugador = {
    x:170,
    y:470,
    ancho:60,
    alto:100
};

// ========================
// MONEDA
// ========================

const moneda = {
    x:Math.random() * 340,
    y:-200,
    ancho:40,
    alto:40
};

// ========================
// ENEMIGOS
// ========================

const enemigos = [];

for(let i = 0; i < 3; i++){

    enemigos.push({

        x:Math.random() * 320,
        y:-250 * i - 150,

        ancho:60,
        alto:100,

        imagen:
        enemigosImg[
            Math.floor(
                Math.random() * enemigosImg.length
            )
        ]

    });

}

// ========================
// CONTROLES TECLADO
// ========================

document.addEventListener("keydown",(e)=>{

    if(juegoTerminado) return;

    if(e.key === "ArrowLeft"){
        jugador.x -= 30;
    }

    if(e.key === "ArrowRight"){
        jugador.x += 30;
    }

    limitarJugador();

});

// ========================
// CONTROLES TÁCTILES
// ========================

document.getElementById("btnIzquierda")
.addEventListener("click",()=>{

    if(juegoTerminado) return;

    jugador.x -= 30;

    limitarJugador();

});

document.getElementById("btnDerecha")
.addEventListener("click",()=>{

    if(juegoTerminado) return;

    jugador.x += 30;

    limitarJugador();

});

// ========================
// LIMITES
// ========================

function limitarJugador(){

    if(jugador.x < 0){
        jugador.x = 0;
    }

    if(jugador.x > 340){
        jugador.x = 340;
    }

}

// ========================
// COLISIONES
// ========================

function colision(a,b){

    return(

        a.x < b.x + b.ancho &&
        a.x + a.ancho > b.x &&
        a.y < b.y + b.alto &&
        a.y + a.alto > b.y

    );

}

// ========================
// HUD
// ========================

function actualizarHUD(){

    document.getElementById("puntaje")
    .innerHTML = "Puntos: " + puntos;

    document.getElementById("record")
    .innerHTML = "🏆 " + record;

    document.getElementById("monedas")
    .innerHTML = "🪙 " + monedas;

    document.getElementById("velocidad")
    .innerHTML = "⚡ " + velocidad;

    let corazones = "";

    for(let i=0;i<vidas;i++){
        corazones += "❤️ ";
    }

    document.getElementById("vidas")
    .innerHTML = corazones;

}

// ========================
// FONDO
// ========================

function dibujarFondo(){

    fondoY += velocidad;

    if(fondoY >= canvas.height){
        fondoY = 0;
    }

    ctx.drawImage(
        fondo,
        0,
        fondoY - canvas.height,
        canvas.width,
        canvas.height
    );

    ctx.drawImage(
        fondo,
        0,
        fondoY,
        canvas.width,
        canvas.height
    );

}

// ========================
// MONEDA
// ========================

function actualizarMoneda(){

    moneda.y += velocidad;

    ctx.drawImage(
        monedaImg,
        moneda.x,
        moneda.y,
        moneda.ancho,
        moneda.alto
    );

    if(moneda.y > canvas.height){

        moneda.y = -200;
        moneda.x = Math.random() * 340;

    }

    if(colision(jugador, moneda)){

        monedas++;

        puntos += 5;

        moneda.y = -200;
        moneda.x = Math.random() * 340;

        if(puntos > record){

            record = puntos;

            localStorage.setItem(
                "record",
                record
            );

        }

        actualizarHUD();

    }

}

// ========================
// ENEMIGOS
// ========================

function actualizarEnemigos(){

    enemigos.forEach(enemigo => {

        enemigo.y += velocidad;

        ctx.drawImage(
            enemigo.imagen,
            enemigo.x,
            enemigo.y,
            enemigo.ancho,
            enemigo.alto
        );

        if(enemigo.y > canvas.height){

            enemigo.y = -150;

            enemigo.x =
            Math.random() * 320;

            enemigo.imagen =
            enemigosImg[
                Math.floor(
                    Math.random()
                    * enemigosImg.length
                )
            ];

            puntos++;

            if(puntos > record){

                record = puntos;

                localStorage.setItem(
                    "record",
                    record
                );

            }

            if(puntos % 10 === 0){
                velocidad++;
            }

            actualizarHUD();

        }

        if(colision(jugador, enemigo)){

            vidas--;

            enemigo.y = -150;
            enemigo.x = Math.random() * 320;

            actualizarHUD();

            if(vidas <= 0){

                juegoTerminado = true;

                document
                .getElementById("gameOver")
                .style.display = "block";

            }
        }

    });

}

// ========================
// JUEGO
// ========================

function actualizar(){

    if(juegoTerminado) return;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    dibujarFondo();

    ctx.drawImage(
        jugadorImg,
        jugador.x,
        jugador.y,
        jugador.ancho,
        jugador.alto
    );

    actualizarMoneda();

    actualizarEnemigos();

    requestAnimationFrame(
        actualizar
    );

}

// ========================
// REINICIAR
// ========================

function reiniciarJuego(){
    location.reload();
}

// ========================
// INICIO
// ========================

actualizarHUD();

fondo.onload = ()=>{

    actualizar();

};