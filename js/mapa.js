// ============================================
// mapa.js - Mapa de refugios y recursos
// Datos de ejemplo (despues se conectara con el backend)
// Camas y espacio animal: disponibles / totales
// ============================================

// Tipos de lugar y color del punto en el mapa
let tipos = [
    { nombre: "Refugio", color: "#1d4ed8" },
    { nombre: "Centro médico", color: "#e8590c" },
    { nombre: "Veterinaria de urgencia", color: "#15803d" },
    { nombre: "Punto de hidratación", color: "#0891b2" }
];

// Tipos que estan activos (al inicio todos)
let tiposActivos = ["Refugio", "Centro médico", "Veterinaria de urgencia", "Punto de hidratación"];

// Lugares: mismos nombres de columna que la tabla "refugios" de la base de datos
// Los campos de abajo (especies, servicios, telefono) NO estan en la tabla todavia
let lugares = [
    {
        id_refugio: 1, tipo: "Refugio", nombre: "Refugio Comunal Los Robles", direccion: "Av. Central 220, Los Robles",
        latitud: 9.9605, longitud: -84.1160, acepta_animales: true,
        camas_totales: 180, camas_disponibles: 64,
        cupos_animales_totales: 60, cupos_animales_disponibles: 22,
        especies: "Perros, Gatos, Aves",
        servicios: ["Veterinaria", "Punto de hidratación", "Medicinas", "Alimentación"],
        telefono: "2222-1010"
    },
    {
        id_refugio: 2, tipo: "Refugio", nombre: "Centro Ganadero El Prado", direccion: "Ruta 3, km 12, El Prado",
        latitud: 9.9355, longitud: -84.0790, acepta_animales: true,
        camas_totales: 40, camas_disponibles: 31,
        cupos_animales_totales: 240, cupos_animales_disponibles: 155,
        especies: "Bovinos, Equinos, Perros",
        servicios: ["Veterinaria", "Punto de hidratación", "Corrales"],
        telefono: "2222-3030"
    },
    {
        id_refugio: 3, tipo: "Refugio", nombre: "Escuela República Sur", direccion: "Calle 8, Barrio Sur",
        latitud: 9.9270, longitud: -84.0770, acepta_animales: false,
        camas_totales: 120, camas_disponibles: 0,
        cupos_animales_totales: 0, cupos_animales_disponibles: 0,
        especies: "",
        servicios: ["Alimentación", "Medicinas"],
        telefono: "2222-4040"
    },
    {
        id_refugio: 4, tipo: "Centro médico", nombre: "Hospital Central de Emergencias", direccion: "Paseo Colón, Barrio Francisco Peralta",
        latitud: 9.9330, longitud: -84.1010, acepta_animales: false,
        camas_totales: 80, camas_disponibles: 12,
        cupos_animales_totales: 0, cupos_animales_disponibles: 0,
        especies: "",
        servicios: ["Urgencias", "Medicinas"],
        telefono: "2222-5050"
    },
    {
        id_refugio: 5, tipo: "Veterinaria de urgencia", nombre: "Clínica Veterinaria 24 h", direccion: "Calle 20, Barrio Escalante",
        latitud: 9.9370, longitud: -84.0830, acepta_animales: true,
        camas_totales: 0, camas_disponibles: 0,
        cupos_animales_totales: 30, cupos_animales_disponibles: 14,
        especies: "Perros, Gatos, Equinos",
        servicios: ["Veterinaria", "Medicinas"],
        telefono: "2222-6060"
    },
    {
        id_refugio: 6, tipo: "Punto de hidratación", nombre: "Punto de hidratación La Sabana", direccion: "Parque Metropolitano La Sabana",
        latitud: 9.9360, longitud: -84.1070, acepta_animales: true,
        camas_totales: 0, camas_disponibles: 0,
        cupos_animales_totales: 0, cupos_animales_disponibles: 0,
        especies: "",
        servicios: ["Agua potable", "Punto de hidratación"],
        telefono: "2222-7070"
    }
];


// Un lugar esta saturado si tiene camas y ya no queda ninguna libre
function estaSaturado(lugar) {
    return lugar.camas_totales > 0 && lugar.camas_disponibles === 0;
}

const filtrosTipo = document.getElementById("filtros-tipo");
const listaLugares = document.getElementById("lista-lugares");
const mensajeVacio = document.getElementById("mensaje-vacio");
const soloPet = document.getElementById("solo-pet");
const ocultarSaturados = document.getElementById("ocultar-saturados");
const btnUbicacion = document.getElementById("btn-ubicacion");

// Crear el mapa (centrado en San Jose)
const mapa = L.map("mapa").setView([9.9340, -84.0900], 12);

// Los servidores de OpenStreetMap bloquean (403) las paginas abiertas sin servidor,
// por eso usamos los mapas de CARTO (tambien basados en datos de OpenStreetMap)
// PEGAR AQUI LA API KEY DE CARTO:
const API_KEY_CARTO = "cb1_55i9_1_918232034c4401827d4a547f";

L.tileLayer("https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=" + API_KEY_CARTO, {
    maxZoom: 19,
    subdomains: "abcd",
    attribution: "&copy; OpenStreetMap &copy; CARTO"
}).addTo(mapa);

// Aqui se guardan los puntos para poder borrarlos al filtrar
let puntos = [];
let puntoUsuario = null;


// Buscar el color de un tipo
function colorDelTipo(nombreTipo) {
    for (let i = 0; i < tipos.length; i++) {
        if (tipos[i].nombre === nombreTipo) {
            return tipos[i].color;
        }
    }
    return "#1d4ed8";
}


// Mostrar los botones de tipo
function mostrarFiltros() {
    let botones = "";

    for (let i = 0; i < tipos.length; i++) {
        let clase = "btn btn-tipo";
        if (!tiposActivos.includes(tipos[i].nombre)) {
            clase = clase + " apagado";
        }

        botones = botones +
            "<button type='button' class='" + clase + "' data-tipo='" + tipos[i].nombre + "'" +
            " aria-pressed='" + tiposActivos.includes(tipos[i].nombre) + "'>" +
            tipos[i].nombre + "</button>";
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
    mostrarLugares();
}


// Revisar si un lugar pasa los filtros
function pasaFiltros(lugar) {
    if (!tiposActivos.includes(lugar.tipo)) {
        return false;
    }
    if (soloPet.checked && !lugar.acepta_animales) {
        return false;
    }
    if (ocultarSaturados.checked && estaSaturado(lugar)) {
        return false;
    }
    return true;
}


// Barra de capacidad (titulo, libres, total)
function crearCapacidad(titulo, libres, total) {
    let porcentaje = Math.round((libres / total) * 100);

    return "<div class='capacidad'>" +
        "<div class='capacidad-texto'><span>" + titulo + "</span><strong>" + libres + "/" + total + "</strong></div>" +
        "<div class='progreso' role='progressbar' aria-label='" + titulo + "' aria-valuemin='0' aria-valuemax='100' aria-valuenow='" + porcentaje + "'>" +
        "<div class='progreso-relleno' style='width:" + porcentaje + "%'></div></div>" +
        "</div>";
}


// Dibujar los puntos en el mapa
function mostrarPuntos(lista) {
    for (let i = 0; i < puntos.length; i++) {
        mapa.removeLayer(puntos[i]);
    }
    puntos = [];

    for (let i = 0; i < lista.length; i++) {
        let punto = L.circleMarker([lista[i].latitud, lista[i].longitud], {
            radius: 8,
            color: "white",
            weight: 2,
            fillColor: colorDelTipo(lista[i].tipo),
            fillOpacity: 1
        }).addTo(mapa);

        punto.bindPopup("<strong>" + lista[i].nombre + "</strong><br>" + lista[i].direccion);
        puntos.push(punto);
    }
}


// Mostrar las tarjetas y los puntos
function mostrarLugares() {
    let items = "";
    let visibles = [];

    for (let i = 0; i < lugares.length; i++) {
        if (pasaFiltros(lugares[i])) {
            visibles.push(lugares[i]);
        }
    }

    for (let i = 0; i < visibles.length; i++) {
        let lugar = visibles[i];
        let clase = "tarjeta";
        let textoBadge = lugar.tipo;

        if (estaSaturado(lugar)) {
            clase = clase + " lugar-saturado";
            textoBadge = "Saturado";
        }

        items = items + "<article class='" + clase + "'>" +
            "<div class='lugar-titulo'><h2>" + lugar.nombre + "</h2>" +
            "<span class='badge badge-tipo'>" + textoBadge + "</span></div>" +
            "<p class='texto-suave lugar-direccion'>" + lugar.direccion + "</p>";

        if (lugar.camas_totales > 0) {
            items = items + crearCapacidad("Camas humanas", lugar.camas_disponibles, lugar.camas_totales);
        }

        if (lugar.acepta_animales && lugar.cupos_animales_totales > 0) {
            items = items + crearCapacidad("Espacio animal (" + lugar.especies + ")", lugar.cupos_animales_disponibles, lugar.cupos_animales_totales);
        } else if (lugar.tipo === "Refugio" && !lugar.acepta_animales) {
            items = items + "<p class='texto-suave'>No admite animales</p>";
        }

        items = items + "<div class='servicios'>";
        for (let j = 0; j < lugar.servicios.length; j++) {
            items = items + "<span class='servicio'>" + lugar.servicios[j] + "</span>";
        }
        items = items + "</div>";

        items = items + "<a class='enlace lugar-telefono' href='tel:" + lugar.telefono + "'>📞 " + lugar.telefono + "</a>" +
            "</article>";
    }

    listaLugares.innerHTML = items;
    mostrarPuntos(visibles);

    if (visibles.length === 0) {
        mensajeVacio.innerHTML = "No hay lugares con estos filtros.";
    } else {
        mensajeVacio.innerHTML = "";
    }
}


// Usar la ubicacion del usuario
function usarUbicacion() {
    if (!navigator.geolocation) {
        alert("Tu navegador no permite usar la ubicación.");
        return;
    }

    navigator.geolocation.getCurrentPosition(function (posicion) {
        let lat = posicion.coords.latitude;
        let lng = posicion.coords.longitude;

        if (puntoUsuario !== null) {
            mapa.removeLayer(puntoUsuario);
        }

        puntoUsuario = L.marker([lat, lng]).addTo(mapa);
        puntoUsuario.bindPopup("Tu ubicación").openPopup();
        mapa.setView([lat, lng], 14);
    }, function () {
        alert("No se pudo obtener tu ubicación.");
    });
}


// Eventos
filtrosTipo.addEventListener("click", function (evento) {
    let boton = evento.target.closest("button");
    if (boton !== null) {
        cambiarTipo(boton.getAttribute("data-tipo"));
    }
});
soloPet.addEventListener("change", mostrarLugares);
ocultarSaturados.addEventListener("change", mostrarLugares);
btnUbicacion.addEventListener("click", usarUbicacion);


mostrarFiltros();
mostrarLugares();
