// ============================================
// inicio.js - Datos de ejemplo del panel de Inicio
// (despues se conectara con el backend)
// ============================================

// Indice ITH (estres termico animal)
let indiceIth = 79;

// alertas (nivel: peligro, aviso o exito)
let alertas = [
    { titulo: "Ola de calor · Valle Norte", detalle: "ITH 82 — Peligro para bovinos y equinos", nivel: "aviso", texto: "Medio" },
    { titulo: "Incendio · Sector Montaña Este", detalle: "ITH 74 — Confort térmico aceptable", nivel: "exito", texto: "Bajo" }
];

// Ultimos tickets S.O.S. 
let ticketsSos = [
    { titulo: "Evacuación Conjunta — Familia Rojas", detalle: "Calle 14, casa 32, Los Bajos · Hace 8 min", estado: "Pendiente" },
    { titulo: "Rescate Animal — Don Ernesto Vega", detalle: "Finca La Esperanza, ruta 3 · Hace 27 min", estado: "En proceso" }
];

const listaAlertas = document.getElementById("lista-alertas");
const listaSos = document.getElementById("lista-sos");
const ithNumero = document.getElementById("ith-numero");
const ithRelleno = document.getElementById("ith-relleno");
const ithBarra = document.getElementById("ith-barra");


// Mostrar el indice ITH
function mostrarIth() {
    ithNumero.innerHTML = indiceIth;
    ithRelleno.style.width = indiceIth + "%";
    ithBarra.setAttribute("aria-valuenow", indiceIth);
}


// Mostrar  otras alertas
function mostrarAlertas() {
    let items = "";

    for (let i = 0; i < alertas.length; i++) {
        items = items +
            "<li>" +
            "<div><strong>" + alertas[i].titulo + "</strong>" +
            "<p class='texto-suave'>" + alertas[i].detalle + "</p></div>" +
            "<span class='badge badge-" + alertas[i].nivel + "'>" + alertas[i].texto + "</span>" +
            "</li>";
    }

    listaAlertas.innerHTML = items;
}


// Mostrar los ultimos S.O.S. de la zona
function mostrarSos() {
    let items = "";

    for (let i = 0; i < ticketsSos.length; i++) {
        items = items +
            "<li>" +
            "<div><strong>" + ticketsSos[i].titulo + "</strong>" +
            "<p class='texto-suave'>" + ticketsSos[i].detalle + "</p></div>" +
            "<span class='badge badge-borde'>" + ticketsSos[i].estado + "</span>" +
            "</li>";
    }

    listaSos.innerHTML = items;
}


mostrarIth();
mostrarAlertas();
mostrarSos();