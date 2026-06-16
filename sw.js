const CACHE_NAME = "car-race-v1";

const urlsToCache = [

    "./",

    "index.html",
    "style.css",
    "app.js",

    "fondo-carretera.jfif",

    "carro-jugador.jfif",

    "carro-enemigo1.jfif",
    "carro-enemigo2.jfif",
    "carro-enemigo3.jfif",
    "carro-enemigo4.jfif",

    "icono-monedas.jfif",

    "icon-192.png",
    "icon-512.png",

    "manifest.json"

];

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))

    );

});

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)
        .then(response => response || fetch(event.request))

    );

});