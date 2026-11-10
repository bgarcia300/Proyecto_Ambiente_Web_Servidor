// ============================================
// plan.js - Plan de evacuacion
// Datos de ejemplo (despues se conectara con el backend)
// ============================================

// Pasos del plan para antes de la emergencia
let antes = [
    { texto: "Conocer la ruta de evacuación y una ruta alterna", listo: false },
    { texto: "Acordar un punto de encuentro con toda la familia", listo: false },
    { texto: "Tener lista la mochila de 72 horas", listo: false },
    { texto: "Guardar copias de documentos y números de emergencia", listo: false },
    { texto: "Revisar que cada animal tenga identificación (collar o placa)", listo: false },
    { texto: "Definir quién ayuda a niñez, adultos mayores y movilidad reducida", listo: false },
    { texto: "Cargar celulares y la batería externa", listo: false }
];

// Pasos durante la evacuacion
let durante = [
    { texto: "Cortar la luz, el gas y el agua si es seguro hacerlo", listo: false },
    { texto: "Salir con calma por la ruta indicada", listo: false },
    { texto: "Llevar a los animales con correa, arnés o transportadora", listo: false },
    { texto: "Ayudar primero a quienes tienen movilidad reducida", listo: false },
    { texto: "No cruzar ríos ni calles inundadas", listo: false },
    { texto: "Avisar a un contacto de emergencia a dónde vas", listo: false }
];

// Pasos para despues de la emergencia
let despues = [
    { texto: "Esperar el aviso oficial antes de regresar a casa", listo: false },
    { texto: "Revisar daños en la casa antes de entrar", listo: false },
    { texto: "Revisar a los animales: heridas, agua limpia y comida", listo: false },
    { texto: "Reportar daños o personas desaparecidas", listo: false },
    { texto: "Actualizar el plan con lo aprendido", listo: false }
];

// Lugares sugeridos para evacuar (mismos que el mapa)
let destinos = [
    { nombre: "Refugio Comunal Los Robles", detalle: "Av. Central 220 · Acepta perros, gatos y aves", etiqueta: "Personas y mascotas" },
    { nombre: "Centro Ganadero El Prado", detalle: "Ruta 3, km 12 · Acepta bovinos, equinos y perros", etiqueta: "Ganado" },
    { nombre: "Hospital Central de Emergencias", detalle: "Paseo Colón · Urgencias y medicinas", etiqueta: "Atención médica" }
];

// Contactos de emergencia
let contactos = [
    { nombre: "Emergencias", telefono: "911", relacion: "Oficial" },
    { nombre: "Clínica Veterinaria 24 h", telefono: "2222-6060", relacion: "Veterinario" }
];

// antes, durante o despues
let pestanaActual = "antes";

const lista = document.getElementById("lista-pasos");
const btnAntes = document.getElementById("btn-antes");
const btnDurante = document.getElementById("btn-durante");
const btnDespues = document.getElementById("btn-despues");
const btnReiniciar = document.getElementById("btn-reiniciar");
const textoPorcentaje = document.getElementById("plan-porcentaje");
const textoDetalle = document.getElementById("plan-detalle");
const relleno = document.getElementById("plan-relleno");
const barra = document.getElementById("plan-barra");

const listaDestinos = document.getElementById("lista-destinos");
const listaContactos = document.getElementById("lista-contactos");
const formContacto = document.getElementById("form-contacto");
const mensajeContacto = document.getElementById("mensaje-contacto");


// Evitar que el texto escrito por el usuario rompa el HTML
function limpiarTexto(texto) {
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}


// Contar cuantos pasos estan marcados
function contarListos(items) {
    let cantidad = 0;

    for (let i = 0; i < items.length; i++) {
        if (items[i].listo) {
            cantidad = cantidad + 1;
        }
    }

    return cantidad;
}


// Sacar el porcentaje de lista
function sacarPorcentaje(listos, total) {
    return Math.round(listos / total * 100);
}


// Devolver la lista de la pestaña actual
function listaActual() {
    if (pestanaActual == "antes") {
        return antes;
    } else if (pestanaActual == "durante") {
        return durante;
    } else {
        return despues;
    }
}


// Mostrar los pasos de la pestaña actual
function mostrarLista() {
    let items = listaActual();
    let filas = "";

    for (let i = 0; i < items.length; i++) {
        let clase = "item-plan";
        let marcado = "";

        if (items[i].listo) {
            clase = "item-plan item-listo";
            marcado = " checked";
        }

        filas = filas +
            "<li><label class='" + clase + "'>" +
            "<input type='checkbox' onclick='marcar(" + i + ")'" + marcado + ">" +
            items[i].texto +
            "</label></li>";
    }

    lista.innerHTML = filas;
}


// Calcular y mostrar el progreso
function mostrarProgreso() {
    let listosAntes = contarListos(antes);
    let listosDurante = contarListos(durante);
    let listosDespues = contarListos(despues);

    let porcAntes = sacarPorcentaje(listosAntes, antes.length);
    let porcDurante = sacarPorcentaje(listosDurante, durante.length);
    let porcDespues = sacarPorcentaje(listosDespues, despues.length);

    let listos = listosAntes + listosDurante + listosDespues;
    let total = antes.length + durante.length + despues.length;
    let porcGeneral = sacarPorcentaje(listos, total);

    textoPorcentaje.innerHTML = porcGeneral + "% del plan listo";
    textoDetalle.innerHTML = "Antes " + porcAntes + "% · Durante " + porcDurante + "% · Después " + porcDespues + "%";
    relleno.style.width = porcGeneral + "%";
    barra.setAttribute("aria-valuenow", porcGeneral);

    btnAntes.innerHTML = "Antes (" + porcAntes + "%)";
    btnDurante.innerHTML = "Durante (" + porcDurante + "%)";
    btnDespues.innerHTML = "Después (" + porcDespues + "%)";
}


// Marcar o desmarcar un paso
function marcar(posicion) {
    let items = listaActual();

    items[posicion].listo = !items[posicion].listo;

    mostrarLista();
    mostrarProgreso();
}


// Cambiar de pestaña
function cambiarPestana(nombre) {
    pestanaActual = nombre;

    btnAntes.className = "pestana";
    btnDurante.className = "pestana";
    btnDespues.className = "pestana";

    if (nombre == "antes") {
        btnAntes.className = "pestana activa";
    } else if (nombre == "durante") {
        btnDurante.className = "pestana activa";
    } else {
        btnDespues.className = "pestana activa";
    }

    mostrarLista();
}


// Mostrar los puntos de encuentro y refugios
function mostrarDestinos() {
    let items = "";

    for (let i = 0; i < destinos.length; i++) {
        items = items +
            "<li>" +
            "<div class='destino-info'><strong>" + destinos[i].nombre + "</strong>" +
            "<p class='texto-suave'>" + destinos[i].detalle + "</p></div>" +
            "<span class='badge badge-borde'>" + destinos[i].etiqueta + "</span>" +
            "</li>";
    }

    listaDestinos.innerHTML = items;
}


// Mostrar los contactos de emergencia
function mostrarContactos() {
    if (contactos.length == 0) {
        listaContactos.innerHTML = "<li class='texto-suave'>Aún no hay contactos guardados.</li>";
        return;
    }

    let items = "";

    for (let i = 0; i < contactos.length; i++) {
        items = items +
            "<li>" +
            "<div><strong>" + limpiarTexto(contactos[i].nombre) + "</strong>" +
            "<p class='texto-suave'>" + limpiarTexto(contactos[i].relacion) + "</p></div>" +
            "<div class='contacto-acciones'>" +
            "<a class='enlace' href='tel:" + limpiarTexto(contactos[i].telefono) + "'>📞 " + limpiarTexto(contactos[i].telefono) + "</a>" +
            "<button type='button' class='btn btn-quitar' onclick='quitarContacto(" + i + ")' aria-label='Quitar a " + limpiarTexto(contactos[i].nombre) + "'>Quitar</button>" +
            "</div>" +
            "</li>";
    }

    listaContactos.innerHTML = items;
}


// Quitar un contacto
function quitarContacto(posicion) {
    contactos.splice(posicion, 1);
    mostrarContactos();
}


// Boton Reiniciar
btnReiniciar.addEventListener("click", function() {
    for (let i = 0; i < antes.length; i++) {
        antes[i].listo = false;
    }

    for (let i = 0; i < durante.length; i++) {
        durante[i].listo = false;
    }

    for (let i = 0; i < despues.length; i++) {
        despues[i].listo = false;
    }

    mostrarLista();
    mostrarProgreso();
});


// Pestañas
btnAntes.addEventListener("click", function() {
    cambiarPestana("antes");
});

btnDurante.addEventListener("click", function() {
    cambiarPestana("durante");
});

btnDespues.addEventListener("click", function() {
    cambiarPestana("despues");
});


// Agregar contacto
formContacto.addEventListener("submit", function(evento) {

    evento.preventDefault();

    let inputNombre = document.getElementById("nombre-contacto");
    let inputTelefono = document.getElementById("telefono-contacto");
    let inputRelacion = document.getElementById("relacion-contacto");

    let nombre = inputNombre.value.trim();
    let telefono = inputTelefono.value.trim();
    let relacion = inputRelacion.value;

    // Quitar marcas de error
    inputNombre.className = "";
    inputTelefono.className = "";
    inputRelacion.className = "";

    let hayError = false;

    if (nombre == "") {
        inputNombre.className = "invalido";
        hayError = true;
    }

    // telefono: solo numeros, espacios y guiones (minimo 3 digitos)
    if (!/^[0-9+\-\s]{3,20}$/.test(telefono)) {
        inputTelefono.className = "invalido";
        hayError = true;
    }

    if (relacion == "") {
        inputRelacion.className = "invalido";
        hayError = true;
    }

    if (hayError) {
        mensajeContacto.className = "mensaje error";
        mensajeContacto.innerHTML = "Escribí el nombre, un teléfono válido y elegí la relación.";
    } else {
        contactos.push({ nombre: nombre, telefono: telefono, relacion: relacion });
        mostrarContactos();

        // Deja campos vacios para el siguiente contacto
        inputNombre.value = "";
        inputTelefono.value = "";
        inputRelacion.value = "";

        mensajeContacto.className = "mensaje exito";
        mensajeContacto.innerHTML = "Contacto guardado correctamente.";
    }

    mensajeContacto.style.display = "block";
});


mostrarLista();
mostrarProgreso();
mostrarDestinos();
mostrarContactos();
