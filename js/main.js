
document.getElementsByClassName("bloqueAgregar")[0].addEventListener("click", añadirBloqueHabitacion);

var bloqueDatos = document.getElementById("bloqueDatos");

const maximasNoches = 14;
const edadMaxima = 12;
const maximoHabitacion = 4;

window.onload = () => {
    cargarNoches();
    deshabilitarDias();
    añadirBloqueHabitacion();
};

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

function cargarNoches(){
    var selectNoches = document.getElementById("numeroNoches");

    crearNodoOpcion("Populares", "populares", selectNoches, true);    
    crearNodoOpcion("4 Noches", 4, selectNoches);
    crearNodoOpcion("7 Noches", 7, selectNoches);
    crearNodoOpcion("10 Noches", 10, selectNoches);
    crearNodoOpcion("14 Noches", 14, selectNoches);

    crearNodoOpcion("Diarios", "diario", selectNoches, true);
    for(let i = 1; i <= maximasNoches; i++){
        texto = i == 1 ? i + " Noche" : i + " Noches";

        crearNodoOpcion(texto, i, selectNoches);
    }

}

function crearNodoOpcion(texto, valor, padre, deshabilitar=false){
    var nodo = document.createElement("option");
    nodo.setAttribute("value", valor);    
    var nodoTexto = document.createTextNode(texto);

    if(deshabilitar) nodo.setAttribute("disabled", true);
    nodo.appendChild(nodoTexto);

    padre.appendChild(nodo);
}

function deshabilitarDias(){
    var today = new Date().toISOString().split('T')[0];
    document.getElementById("datepicker").setAttribute('min', today);
    document.getElementById("datepicker").value = today;
}

function añadirBloqueHabitacion(){
    if(bloqueDatos.childElementCount < maximoHabitacion+1){
        var nodoHabitacion = document.getElementsByClassName("bloqueHabitacion")[0];
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

function modificarNombresHabitaciones(){
    document.querySelectorAll('#bloqueDatos #bloqueHabitacion').forEach( (elemento, index) => {
        elemento.getElementsByClassName("texto")[0].innerHTML = index + 1 + " Habitacion";
    });
}

function borrarHabitacion(element){
    bloqueDatos.removeChild(element);
    modificarNombresHabitaciones();
};

$(function () {
    $('[data-toggle="popover"]').popover({
        trigger: 'focus',
        content: bloqueDatos.html(),
        placement: "bottom",
        container: "body",
        html: true
    });
});