
// Lista de animales registrados 
let animales = [];

const formFamilia = document.getElementById("form-familia");
const mensajeFamilia = document.getElementById("mensaje-familia");

const formAnimal = document.getElementById("form-animal");
const mensajeAnimal = document.getElementById("mensaje-animal");

const listaAnimales = document.getElementById("lista-animales");


// Revisar que un numero sea valido (0 o mas)
function esNumeroValido(valor) {
    return valor != "" && !isNaN(Number(valor)) && Number(valor) >= 0;
}


// Mostrar  animales registrados
function mostrarAnimales() {
    if (animales.length == 0) {
        listaAnimales.innerHTML = "<li class='texto-suave'>Aún no hay animales registrados.</li>";
    } else {
        let items = "";

        for (let i = 0; i < animales.length; i++) {
            let detalle = animales[i].especie;

            if (animales[i].peso != "") {
                detalle = detalle + " · " + animales[i].peso + " kg";
            }

            if (animales[i].observaciones != "") {
                detalle = detalle + " · " + animales[i].observaciones;
            }

            if (animales[i].vacunado) {
                detalle = detalle + " · Vacunación al día";
            }

            items = items +
                "<li>" +
                "<div><strong>" + animales[i].nombre + "</strong>" +
                "<p class='texto-suave'>" + detalle + "</p></div>" +
                "</li>";
        }

        listaAnimales.innerHTML = items;
    }
}


// Guardar  perfil de  familia
formFamilia.addEventListener("submit", function(evento) {

    evento.preventDefault();

    let inputNombre = document.getElementById("nombre-completo");
    let inputTelefono = document.getElementById("telefono");
    let inputUbicacion = document.getElementById("ubicacion");
    let inputAdultos = document.getElementById("adultos");
    let inputNinos = document.getElementById("ninos");
    let inputMayores = document.getElementById("mayores");
    let inputMovilidad = document.getElementById("movilidad");

    // Quitar  marcas de error 
    inputNombre.className = "";
    inputTelefono.className = "";
    inputUbicacion.className = "";
    inputAdultos.className = "";
    inputNinos.className = "";
    inputMayores.className = "";
    inputMovilidad.className = "";

    let hayError = false;

    if (inputNombre.value.trim() == "") {
        inputNombre.className = "invalido";
        hayError = true;
    }

    if (inputTelefono.value.trim() == "") {
        inputTelefono.className = "invalido";
        hayError = true;
    }

    if (inputUbicacion.value.trim() == "") {
        inputUbicacion.className = "invalido";
        hayError = true;
    }

    if (!esNumeroValido(inputAdultos.value)) {
        inputAdultos.className = "invalido";
        hayError = true;
    }

    if (!esNumeroValido(inputNinos.value)) {
        inputNinos.className = "invalido";
        hayError = true;
    }

    if (!esNumeroValido(inputMayores.value)) {
        inputMayores.className = "invalido";
        hayError = true;
    }

    if (!esNumeroValido(inputMovilidad.value)) {
        inputMovilidad.className = "invalido";
        hayError = true;
    }

    if (hayError) {
        mensajeFamilia.className = "mensaje error";
        mensajeFamilia.innerHTML = "Revisá los campos marcados en rojo.";
    } else {
        mensajeFamilia.className = "mensaje exito";
        mensajeFamilia.innerHTML = "Perfil guardado correctamente.";
    }

    mensajeFamilia.style.display = "block";
});


// Agregar  animal
formAnimal.addEventListener("submit", function(evento) {

    evento.preventDefault();

    let inputNombreAnimal = document.getElementById("nombre-animal");
    let inputEspecie = document.getElementById("especie");
    let inputPeso = document.getElementById("peso");
    let inputObservaciones = document.getElementById("observaciones");
    let inputVacuna = document.getElementById("vacunacion");

    let nombre = inputNombreAnimal.value.trim();
    let especie = inputEspecie.value;
    let peso = inputPeso.value;
    let observaciones = inputObservaciones.value.trim();

    // Quitar  marcas de error 
    inputNombreAnimal.className = "";
    inputEspecie.className = "";
    inputPeso.className = "";

    let hayError = false;

    if (nombre == "") {
        inputNombreAnimal.className = "invalido";
        hayError = true;
    }

    if (especie == "") {
        inputEspecie.className = "invalido";
        hayError = true;
    }

    //  peso  opcional,  mayor a 0
    if (peso != "" && (isNaN(Number(peso)) || Number(peso) <= 0)) {
        inputPeso.className = "invalido";
        hayError = true;
    }

    if (hayError) {
        mensajeAnimal.className = "mensaje error";
        mensajeAnimal.innerHTML = "Escribí el nombre, elegí la especie y revisá el peso.";
    } else {
        animales.push({
            nombre: nombre,
            especie: especie,
            peso: peso,
            observaciones: observaciones,
            vacunado: inputVacuna.checked
        });

        mostrarAnimales();

        // Deja  campos vacios siguiente animal
        inputNombreAnimal.value = "";
        inputEspecie.value = "";
        inputPeso.value = "";
        inputObservaciones.value = "";
        inputVacuna.checked = false;

        mensajeAnimal.className = "mensaje exito";
        mensajeAnimal.innerHTML = "Animal agregado correctamente.";
    }

    mensajeAnimal.style.display = "block";
});



mostrarAnimales();