if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js")
}

/*navigator.serviceWorker es igual, y es para mirar si existe el atributo serviceWorker en navigator, y registramos un serviceworker con el cual se va a trabajar, lo dejamos al mismo nivel, y creamos el archivo 
*/