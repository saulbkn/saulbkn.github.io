
var templateHabitacion = document.querySelector("#tempBloqueHabitacion");

var templateBloqueDatos = document.querySelector("#tempBloqueDatos");
templateBloqueDatos.content.querySelector(".bloqueAgregar").addEventListener("click", añadirBloqueHabitacion);
templateBloqueDatos.content.querySelector("#botonTerminar").addEventListener("click", () => {
    $('.botonHabit').popover('hide');
});

var bloqueDatos = templateBloqueDatos.content.querySelector("#bloqueDatos");

document.getElementById("Buscar").addEventListener("click", recogerDatosBusqueda);

$('.botonHabit').popover({
    container: 'body',
    content: bloqueDatos,
    placement: "bottom",
    html: true
});

$('.botonHabit').on('hide.bs.popover', consultarDatosHabitaciones);


$('body').on('click', function (e) {
    if ($(e.target).data('toggle') !== 'popover' && $(e.target).parents('.bloqueDatos').length === 0) { 
        if(!e.target.parentNode.classList.contains("close")){
            $('[data-toggle="popover"]').popover('hide');
        }
    }
});

const maximasNoches = 14;
const edadMaxima = 12;
const maximoHabitacion = 4;

window.onload = () => {
    cargarNoches();
    deshabilitarDias();
   
    templateBloqueDatos.content.querySelector(".listaChilds").addEventListener("change", (event) => {
        cargarEdadesHijos(event.target);
    });   

    consultarDatosHabitaciones();
};

/**
 * coge el valor de la opcion seleccionada en el select enviado por paráemtro y
 * crea o destruye en el bloqueEdad tantos selects necesarios para llegar al valor.
 * @param {element} nodoSelectHijos 
 */
function cargarEdadesHijos(nodoSelectHijos){
    var valor = nodoSelectHijos.options[nodoSelectHijos.selectedIndex].value;
    var bloqueEdad = nodoSelectHijos.parentNode.parentNode.nextElementSibling;

    if(bloqueEdad.childElementCount < valor){
        while(bloqueEdad.childElementCount < valor){
            var lista = document.createElement("select");
            lista.setAttribute("class", "mt-2");
            crearNodoOpcion("Edad", "", lista, true);

            for(let i = 1; i <= edadMaxima; i++){
                crearNodoOpcion(i, i, lista);
            }

            bloqueEdad.appendChild(lista);
        }
    }else{
        while(bloqueEdad.childElementCount > valor){
            var elemento = bloqueEdad.lastChild;
            bloqueEdad.removeChild(elemento);
        }
    }
}

/**
 * Carga las opciones del select de elegir el número de noches
 */
function cargarNoches(){
    var selectNoches = document.getElementById("numeroNoches");

    crearNodoOpcion("Populares", "populares", selectNoches, true);    
    crearNodoOpcion("4 Noches", 4, selectNoches);
    crearNodoOpcion("7 Noches", 7, selectNoches);
    crearNodoOpcion("10 Noches", 10, selectNoches);
    crearNodoOpcion("14 Noches", 14, selectNoches);

    crearNodoOpcion("Diarios", "diario", selectNoches, true);
    for(let i = 1; i <= maximasNoches; i++){
        var texto = i == 1 ? i + " Noche" : i + " Noches";

        crearNodoOpcion(texto, i, selectNoches);
    }

    var defecto = document.createElement("option");
    defecto.selected = true;
    defecto.disabled = true;
    defecto.hidden = true;
    defecto.appendChild(document.createTextNode("0 Noches"));
    selectNoches.appendChild(defecto);

}

/**
 * Crea un nodo de tipo option con el texto y valor recibido por parámetro. Se lo añade al nodo padre recibido
 * y si se especifica en el último parámetro, se deshabilita esa opción para que no sea seleccionado
 * @param {String} texto 
 * @param {String} valor 
 * @param {element} padre 
 * @param {boolean} deshabilitar=false 
 */
function crearNodoOpcion(texto, valor, padre, deshabilitar=false){
    var nodo = document.createElement("option");
    nodo.setAttribute("value", valor);    
    var nodoTexto = document.createTextNode(texto);

    if(deshabilitar) nodo.setAttribute("disabled", true);
    nodo.appendChild(nodoTexto);

    padre.appendChild(nodo);
}

/**
 * Deshabilitar en el input de type Date cualquier fecha inferior al día actual
 */
function deshabilitarDias(){
    var today = new Date().toISOString().split('T')[0];
    document.getElementById("datepicker").setAttribute('min', today);
    document.getElementById("datepicker").value = today;
}

/**
 * Si no se ha llegado al máximo de habitaciones por reservar, se clona el template
 * del bloqueHabitación del html y se añade al bloqueDatos del popover
 */
function añadirBloqueHabitacion(){
    if(bloqueDatos.childElementCount < maximoHabitacion+1){
        var nodoHabitacion = templateHabitacion.content.querySelector("#bloqueHabitacion");
        var nodoClonado = nodoHabitacion.cloneNode(true);
        nodoClonado.style.display = "flex";

        nodoClonado.getElementsByClassName("close")[0].addEventListener("click", () => {
            borrarHabitacion(nodoClonado);
        });

        nodoClonado.getElementsByClassName("listaChilds")[0].addEventListener("change", (event) => {
            cargarEdadesHijos(event.target);
        });   

        if(bloqueDatos.childElementCount >= 2) nodoClonado.firstElementChild.firstElementChild.style.visibility = "visible";

        bloqueDatos.lastElementChild.before(nodoClonado);
        modificarNombresHabitaciones();
    }
}

/**
 * Recorre todas las habitaciones actuales y modifica el número de las habitaciones
 */
function modificarNombresHabitaciones(){
    document.querySelectorAll('#bloqueDatos #bloqueHabitacion').forEach( (elemento, index) => {
        elemento.getElementsByClassName("textoNumero")[0].innerHTML = index + 1;
    });

    $('.botonHabit').popover('update');
}

/**
 * Elimina la habitación recibida por parámetros
 * @param {element} element 
 */
function borrarHabitacion(element){
    bloqueDatos.removeChild(element);
    modificarNombresHabitaciones();
}

/**
 * Recoge los datos de las habitaciones para mostrar un resumen en el botón
 * del popover
 */
function consultarDatosHabitaciones(){
    var boton = document.querySelector(".bloqueNoches button");
    
    var numeroHabitaciones = bloqueDatos.getElementsByClassName("bloqueHabitacion").length;
    var numeroHuespedes =  0;
    bloqueDatos.querySelectorAll('.lista').forEach((elemento) => {
        numeroHuespedes += Number(elemento.options[elemento.selectedIndex].value);
    });

    boton.innerHTML = numeroHabitaciones + " habits y " + numeroHuespedes + " personas";
}

/**
 * Recoge todos los datos de búsqueda y los imprime por consola
 */
function recogerDatosBusqueda(){

    console.log("Destino: " + document.getElementById("textoDestino").value);
    console.log("Fecha de entrada: " + document.getElementById("datepicker").value);
    console.log("Número de noches: " + document.getElementById("numeroNoches").options[document.getElementById("numeroNoches").selectedIndex].value);

    bloqueDatos.querySelectorAll('.bloqueHabitacion').forEach((elemento, index) => {
        console.log("   En la habitación "+ Number(index + 1) + " se hospedarán: ");
        var listasPrincipales = elemento.getElementsByClassName("lista");
        console.log("       Adultos: " + listasPrincipales[0].value + " personas.");
        
        var texto = "       Niños: " + listasPrincipales[1].value + " niños";
        if(listasPrincipales[1].value != 0){
            texto += " con edades de ";
            var listaChilds = elemento.querySelectorAll(".edad select");

            listaChilds.forEach((elemento, index) => {
                texto += elemento.value + " años";
                index < listaChilds.length - 1 ? texto += ", " : texto += ".";
            });
        }

        console.log(texto);
        
    });


}