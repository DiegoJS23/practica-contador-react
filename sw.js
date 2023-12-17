const CACHE_ELEMENTS = [
  "./",
  "https://unpkg.com/react@18/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
  "https://unpkg.com/@babel/standalone/babel.min.js",
  "./style.css",
  "./components/Contador.js",
]; //se nombra en mayusculas porque es el nombre de nuestra caché, ponemos un array por todas las rutas que existen en nuestro sitio web y es donde vamos a hacer las peticiones, escribimos los links iguales para evitar errores. 1. cachear pagina de inicio, 2.cacheamos los CDN, 3. los estilos, 4. todas las configuraciones.

const CACHE_NAME = "v3_cache_contador_react"; //nombre que aparecera como nombre del cache en la seccion aplicacion de inspeccionar

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache
        .addAll(CACHE_ELEMENTS)
        .then(() => {
          self.skipWaiting();
        })
        .catch(console.log); //agrega a la cache todas las respuestas y rutas que yo quiera
    })
  ); //espera a que se ejecute algo
}); //Primer elemento del serviceWorker, se instala para que cache las rutas y pueda funcionar sin intener
//self es un objeto igual que this
//evento install, primera parte de un ciclo de vida de serviceworker ,que es cuando se registra, se instala y cachea todas larutas para que el sw provea de esta info y no estar haciendo peticiones de internet,
//waitUntil, espera hasta que se ejecute, la memora cache(caches) del dispositivo, y se utiliza el metodo open pasarle la variable del nombre de la cache para que puede. y eso retorna una promesa y lo que nos da es un objeto cache que es el CACHE_NAME
//addAll, me permite agregar al cache todas la rutas que yo quiera CACHE_ELEMENTS, eso tambiuen retorna otra promesa que sucede si todo sale bien.
//capturamos un error si no sale todo bine

//que se hace cuando se activa el serviceWorker. procedemos con validacinoes

self.addEventListener("activate", (e) => {
  const cacheWhitelist = [CACHE_NAME];

  e.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        console.log(cacheNames);
        return Promise.all(
          cacheNames.map((cacheName) => {
            return (
              cacheWhitelist.indexOf(cacheName) === -1 &&
              caches.delete(cacheName)
            );
          })
        );
      })
      .then(() => self.clients.claim()) //cobra el cache y lo pide
    //keys me va a dar todas laas claves en caso si tenemos mas de un cache instalado. para compararlos despues
  );
}); //vemos las versiones del cache que tengamos para eliminar las versiones mas viejas y quedarnos con las mas actuales
//fetch me da entender que ya estoy haciendo desde la cache del service worker y no desde internet
self.addEventListener("fetch", (e) =>{
  e.respondWith(
    caches.match(e.request).then((res) => {
      if (res) {
        return res
      }       
      return fetch(e.request)
    })
  )
})