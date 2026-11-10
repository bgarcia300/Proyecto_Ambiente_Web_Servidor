
// matarieals para las personas
let humanos = [
    { texto: "Agua: 3 litros por persona por día", listo: false },
    { texto: "Alimentos no perecederos para 72 h", listo: false },
    { texto: "Botiquín de primeros auxilios", listo: false },
    { texto: "Linterna y baterías de repuesto", listo: false },
    { texto: "Radio a pilas o de manivela", listo: false },
    { texto: "Documentos en bolsa impermeable", listo: false },
    { texto: "Efectivo en billetes pequeños", listo: false },
    { texto: "Muda de ropa y abrigo por persona", listo: false },
    { texto: "Kit de higiene personal", listo: false },
    { texto: "Cargador solar o batería externa", listo: false },
    { texto: "Silbato de emergencia", listo: false }
];

// materiales para los animales
let animales = [
    { texto: "Agua y comida para 72 h", listo: false },
    { texto: "Correa, arnés o bozal", listo: false },
    { texto: "Transportadora o jaula", listo: false },
    { texto: "Carnet de vacunas y medicinas", listo: false },
    { texto: "Foto reciente e identificación", listo: false },
    { texto: "Bolsas higiénicas o arena sanitaria", listo: false }
];

// humanos o animales
let pestanaActual = "humanos";

const lista = document.getElementById("lista-items");
const btnHumanos = document.getElementById("btn-humanos");
const btnAnimales = document.getElementById("btn-animales");
const btnReiniciar = document.getElementById("btn-reiniciar");
const textoPorcentaje = document.getElementById("mochila-porcentaje");
const textoDetalle = document.getElementById("mochila-detalle");
const relleno = document.getElementById("mochila-relleno");


// Contar cuantos mateeireales estan marcados
function contarListos(items) {
    let cantidad = 0;

    for (let i = 0; i < items.length; i++) {
        if (items[i].listo) {
            cantidad = cantidad + 1;
        }
    }

    return cantidad;
}


// Sacar el porcentaje de  lista
function sacarPorcentaje(listos, total) {
    return Math.round(listos / total * 100);
}


// Devolver la lista de la pestaña actual
function listaActual() {
    if (pestanaActual == "humanos") {
        return humanos;
    } else {
        return animales;
    }
}


// Mostrar los mateeraiales de la pestaña actual
function mostrarLista() {
    let items = listaActual();
    let filas = "";

    for (let i = 0; i < items.length; i++) {
        let clase = "item-mochila";
        let marcado = "";

        if (items[i].listo) {
            clase = "item-mochila item-listo";
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
    let listosHumanos = contarListos(humanos);
    let listosAnimales = contarListos(animales);

    let porcHumanos = sacarPorcentaje(listosHumanos, humanos.length);
    let porcAnimales = sacarPorcentaje(listosAnimales, animales.length);

    let listos = listosHumanos + listosAnimales;
    let total = humanos.length + animales.length;
    let porcGeneral = sacarPorcentaje(listos, total);

    textoPorcentaje.innerHTML = porcGeneral + "% de la mochila lista";
    textoDetalle.innerHTML = "Humanos " + porcHumanos + "% · Animales " + porcAnimales + "% · " + total + " insumos sugeridos según tu perfil.";
    relleno.style.width = porcGeneral + "%";

    btnHumanos.innerHTML = "Humanos (" + porcHumanos + "%)";
    btnAnimales.innerHTML = "Animales (" + porcAnimales + "%)";
}


// Marcar o desmarcar un matereeiall
function marcar(posicion) {
    let items = listaActual();

    items[posicion].listo = !items[posicion].listo;

    mostrarLista();
    mostrarProgreso();
}


// Boton Reiniciar
btnReiniciar.addEventListener("click", function() {
    for (let i = 0; i < humanos.length; i++) {
        humanos[i].listo = false;
    }

    for (let i = 0; i < animales.length; i++) {
        animales[i].listo = false;
    }

    mostrarLista();
    mostrarProgreso();
});


//  pestaña  humanos
btnHumanos.addEventListener("click", function() {
    pestanaActual = "humanos";
    btnHumanos.className = "pestana activa";
    btnAnimales.className = "pestana";
    mostrarLista();
});


//  pestaña de animales
btnAnimales.addEventListener("click", function() {
    pestanaActual = "animales";
    btnAnimales.className = "pestana activa";
    btnHumanos.className = "pestana";
    mostrarLista();
});


mostrarLista();
mostrarProgreso();