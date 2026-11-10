// ============================================
// voluntarios.js - Red de voluntarios
// Datos de ejemplo (despues se conectara con el backend)
// Cupos: ocupados / totales
// ============================================

// Tipos de tarea
let tipos = ["Rescate animal", "Primeros auxilios", "Transporte", "Logística"];

// Tipos que estan activos (al inicio todos)
let tiposActivos = ["Rescate animal", "Primeros auxilios", "Transporte", "Logística"];

// Tareas que necesitan voluntarios (urgencia: Alta, Media o Baja)
let tareas = [
    {
        id: 1, tipo: "Rescate animal", titulo: "Rescate de ganado en finca inundada",
        lugar: "Finca La Esperanza, ruta 3", urgencia: "Alta",
        descripcion: "Ayudar a sacar bovinos y equinos de potreros anegados.",
        cupos_totales: 8, cupos_ocupados: 5, inscrito: false
    },
    {
        id: 2, tipo: "Transporte", titulo: "Traslado de familias a refugios",
        lugar: "Los Bajos, Cantón Central", urgencia: "Alta",
        descripcion: "Mover familias, adultos mayores y mascotas hasta el refugio más cercano.",
        cupos_totales: 6, cupos_ocupados: 6, inscrito: false
    },
    {
        id: 3, tipo: "Primeros auxilios", titulo: "Apoyo en puesto de atención médica",
        lugar: "Hospital Central de Emergencias", urgencia: "Media",
        descripcion: "Atender heridas leves y apoyar al personal médico en la entrada.",
        cupos_totales: 10, cupos_ocupados: 4, inscrito: false
    },
    {
        id: 4, tipo: "Rescate animal", titulo: "Cuidado de mascotas en el refugio",
        lugar: "Refugio Comunal Los Robles", urgencia: "Media",
        descripcion: "Alimentar, pasear y llevar el registro de perros y gatos.",
        cupos_totales: 12, cupos_ocupados: 7, inscrito: false
    },
    {
        id: 5, tipo: "Logística", titulo: "Entrega de agua y alimentos",
        lugar: "Parque Metropolitano La Sabana", urgencia: "Baja",
        descripcion: "Armar y repartir paquetes de agua y alimentos no perecederos.",
        cupos_totales: 15, cupos_ocupados: 9, inscrito: false
    },
    {
        id: 6, tipo: "Logística", titulo: "Clasificación de donaciones",
        lugar: "Escuela República Sur", urgencia: "Baja",
        descripcion: "Ordenar ropa, cobijas y medicinas donadas por la comunidad.",
        cupos_totales: 10, cupos_ocupados: 3, inscrito: false
    }
];

// Voluntarios registrados
let voluntarios = [
    { nombre: "Daniela Vargas", habilidad: "Primeros auxilios", disponibilidad: "Todo el día", zona: "Barrio Escalante", vehiculo: false },
    { nombre: "Mauricio Solano", habilidad: "Transporte", disponibilidad: "Tarde", zona: "El Prado", vehiculo: true }
];

const filtrosTipo = document.getElementById("filtros-tipo");
const soloUrgentes = document.getElementById("solo-urgentes");
const ocultarCompletas = document.getElementById("ocultar-completas");
const listaTareas = document.getElementById("lista-tareas");
const mensajeVacio = document.getElementById("mensaje-vacio");
const listaVoluntarios = document.getElementById("lista-voluntarios");

const totalVoluntarios = document.getElementById("total-voluntarios");
const totalTareas = document.getElementById("total-tareas");
const totalCupos = document.getElementById("total-cupos");

const formVoluntario = document.getElementById("form-voluntario");
const mensajeVoluntario = document.getElementById("mensaje-voluntario");


// Evitar que el texto escrito por el usuario rompa el HTML
function limpiarTexto(texto) {
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}


// Una tarea esta completa si ya no quedan cupos
function estaCompleta(tarea) {
    return tarea.cupos_ocupados >= tarea.cupos_totales;
}


// Color de la etiqueta segun la urgencia
function claseUrgencia(urgencia) {
    if (urgencia == "Alta") {
        return "badge-peligro";
    } else if (urgencia == "Media") {
        return "badge-aviso";
    } else {
        return "badge-exito";
    }
}


// Mostrar los botones de tipo
function mostrarFiltros() {
    let botones = "";

    for (let i = 0; i < tipos.length; i++) {
        let clase = "btn btn-tipo";
        if (!tiposActivos.includes(tipos[i])) {
            clase = clase + " apagado";
        }

        botones = botones +
            "<button type='button' class='" + clase + "' data-tipo='" + tipos[i] + "'" +
            " aria-pressed='" + tiposActivos.includes(tipos[i]) + "'>" +
            tipos[i] + "</button>";
    }

    filtrosTipo.innerHTML = botones;
}


// Activar o desactivar un tipo
function cambiarTipo(nombreTipo) {
    if (tiposActivos.includes(nombreTipo)) {
        tiposActivos = tiposActivos.filter(function (t) { return t !== nombreTipo; });
    } else {
        tiposActivos.push(nombreTipo);
    }

    mostrarFiltros();
    mostrarTareas();
}


// Revisar si una tarea pasa los filtros
function pasaFiltros(tarea) {
    if (!tiposActivos.includes(tarea.tipo)) {
        return false;
    }
    if (soloUrgentes.checked && tarea.urgencia != "Alta") {
        return false;
    }
    if (ocultarCompletas.checked && estaCompleta(tarea)) {
        return false;
    }
    return true;
}


// Mostrar las tarjetas de tareas
function mostrarTareas() {
    let items = "";
    let visibles = 0;

    for (let i = 0; i < tareas.length; i++) {
        let tarea = tareas[i];

        if (!pasaFiltros(tarea)) {
            continue;
        }
        visibles = visibles + 1;

        let porcentaje = Math.round(tarea.cupos_ocupados / tarea.cupos_totales * 100);
        let clase = "tarjeta";
        let boton = "";

        if (estaCompleta(tarea) && !tarea.inscrito) {
            clase = clase + " tarea-completa";
            boton = "<button type='button' class='btn btn-inscribir' disabled>Completo</button>";
        } else if (tarea.inscrito) {
            boton = "<button type='button' class='btn btn-inscribir inscrito' onclick='cambiarInscripcion(" + i + ")'>✓ Inscrito · Cancelar</button>";
        } else {
            boton = "<button type='button' class='btn btn-inscribir' onclick='cambiarInscripcion(" + i + ")'>Inscribirme</button>";
        }

        items = items + "<article class='" + clase + "'>" +
            "<div class='tarea-titulo'><h2>" + tarea.titulo + "</h2>" +
            "<span class='badge " + claseUrgencia(tarea.urgencia) + "'>" + tarea.urgencia + "</span></div>" +
            "<p class='texto-suave tarea-lugar'>📍 " + tarea.lugar + "</p>" +
            "<p class='tarea-descripcion'>" + tarea.descripcion + "</p>" +
            "<div class='etiquetas'><span class='etiqueta'>" + tarea.tipo + "</span></div>" +
            "<div class='capacidad'>" +
            "<div class='capacidad-texto'><span>Cupos ocupados</span><strong>" + tarea.cupos_ocupados + "/" + tarea.cupos_totales + "</strong></div>" +
            "<div class='progreso' role='progressbar' aria-label='Cupos ocupados' aria-valuemin='0' aria-valuemax='100' aria-valuenow='" + porcentaje + "'>" +
            "<div class='progreso-relleno' style='width:" + porcentaje + "%'></div></div>" +
            "</div>" +
            boton +
            "</article>";
    }

    listaTareas.innerHTML = items;

    if (visibles == 0) {
        mensajeVacio.innerHTML = "No hay tareas con estos filtros.";
    } else {
        mensajeVacio.innerHTML = "";
    }
}


// Inscribirse o cancelar la inscripcion en una tarea
function cambiarInscripcion(posicion) {
    let tarea = tareas[posicion];

    if (tarea.inscrito) {
        tarea.inscrito = false;
        tarea.cupos_ocupados = tarea.cupos_ocupados - 1;
    } else if (!estaCompleta(tarea)) {
        tarea.inscrito = true;
        tarea.cupos_ocupados = tarea.cupos_ocupados + 1;
    }

    mostrarTareas();
    mostrarResumen();
}


// Mostrar los voluntarios registrados
function mostrarVoluntarios() {
    if (voluntarios.length == 0) {
        listaVoluntarios.innerHTML = "<li class='texto-suave'>Aún no hay voluntarios registrados.</li>";
        return;
    }

    let items = "";

    for (let i = 0; i < voluntarios.length; i++) {
        let detalle = limpiarTexto(voluntarios[i].habilidad) + " · " + limpiarTexto(voluntarios[i].disponibilidad);

        if (voluntarios[i].zona != "") {
            detalle = detalle + " · " + limpiarTexto(voluntarios[i].zona);
        }

        let vehiculo = "";
        if (voluntarios[i].vehiculo) {
            vehiculo = "<span class='badge badge-borde'>🚗 Con vehículo</span>";
        }

        items = items +
            "<li>" +
            "<div><strong>" + limpiarTexto(voluntarios[i].nombre) + "</strong>" +
            "<p class='texto-suave'>" + detalle + "</p></div>" +
            vehiculo +
            "</li>";
    }

    listaVoluntarios.innerHTML = items;
}


// Numeros de arriba: voluntarios, tareas abiertas y cupos libres
function mostrarResumen() {
    let abiertas = 0;
    let libres = 0;

    for (let i = 0; i < tareas.length; i++) {
        if (!estaCompleta(tareas[i])) {
            abiertas = abiertas + 1;
            libres = libres + (tareas[i].cupos_totales - tareas[i].cupos_ocupados);
        }
    }

    totalVoluntarios.innerHTML = voluntarios.length;
    totalTareas.innerHTML = abiertas;
    totalCupos.innerHTML = libres;
}


// Eventos de filtros
filtrosTipo.addEventListener("click", function (evento) {
    let boton = evento.target.closest("button");
    if (boton !== null) {
        cambiarTipo(boton.getAttribute("data-tipo"));
    }
});
soloUrgentes.addEventListener("change", mostrarTareas);
ocultarCompletas.addEventListener("change", mostrarTareas);


// Registrar voluntario
formVoluntario.addEventListener("submit", function(evento) {

    evento.preventDefault();

    let inputNombre = document.getElementById("nombre-voluntario");
    let inputTelefono = document.getElementById("telefono-voluntario");
    let inputHabilidad = document.getElementById("habilidad");
    let inputDisponibilidad = document.getElementById("disponibilidad");
    let inputZona = document.getElementById("zona");
    let inputVehiculo = document.getElementById("vehiculo");

    let nombre = inputNombre.value.trim();
    let telefono = inputTelefono.value.trim();

    // Quitar marcas de error
    inputNombre.className = "";
    inputTelefono.className = "";
    inputHabilidad.className = "";
    inputDisponibilidad.className = "";

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

    if (inputHabilidad.value == "") {
        inputHabilidad.className = "invalido";
        hayError = true;
    }

    if (inputDisponibilidad.value == "") {
        inputDisponibilidad.className = "invalido";
        hayError = true;
    }

    if (hayError) {
        mensajeVoluntario.className = "mensaje error";
        mensajeVoluntario.innerHTML = "Revisá los campos marcados en rojo.";
    } else {
        voluntarios.push({
            nombre: nombre,
            habilidad: inputHabilidad.value,
            disponibilidad: inputDisponibilidad.value,
            zona: inputZona.value.trim(),
            vehiculo: inputVehiculo.checked
        });

        mostrarVoluntarios();
        mostrarResumen();

        // Deja campos vacios para el siguiente voluntario
        inputNombre.value = "";
        inputTelefono.value = "";
        inputHabilidad.value = "";
        inputDisponibilidad.value = "";
        inputZona.value = "";
        inputVehiculo.checked = false;

        mensajeVoluntario.className = "mensaje exito";
        mensajeVoluntario.innerHTML = "¡Gracias! Quedaste registrado como voluntario.";
    }

    mensajeVoluntario.style.display = "block";
});


mostrarFiltros();
mostrarTareas();
mostrarVoluntarios();
mostrarResumen();
