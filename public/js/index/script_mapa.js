function selectingHospital(){
    if (current_hospital == 0){
        document.getElementById("no-hospital").style.display = "flex";
        document.getElementById("hospital-seleccionado").style.display = "none";
    }
    else{
        document.getElementById("no-hospital").style.display = "none";
        document.getElementById("hospital-seleccionado").style.display = "flex";
    }
}

var map = L.map('map').setView([-38.734547, -72.589724], 13);   // Creacion del mapa
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {     // Capa de OpenStreetMap
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

var HospitalIcon = L.Icon.extend({      // Todos los objetos del tipo HospitalIcon tendran las mismas propiedades
    options: {
        shadowUrl: "imagenes/marcador_sombra.png",
        iconSize: [69, 93],
        shadowSize: [68, 67],
        iconAnchor: [34,92],           // Punto del icono correspondiente a la ubicacion del marcador
        shadowAnchor: [1, 67],
        popupAnchor: [0, -93]             // Punto donde se abre el popup
    }
});

var MarcadorRojo = new HospitalIcon({iconUrl: "imagenes/marcador_rojo.png"});
var MarcadorVerde = new HospitalIcon({iconUrl: "imagenes/marcador_verde.png"});
var MarcadorAmarillo = new HospitalIcon({iconUrl: "imagenes/marcador_amarillo.png"});

var hospitales_cargados = [];

console.log("Cargando mapa...");
fetch("/mapdata") // obtiene los datos de los hospitales
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data);
        return data;
    })
    .then((hospitales) => {
        console.log("añadiendo hospitales...");
        hospitales.forEach(hospital => {
            console.log("añadiendo " + hospital.nombre);
            hospitales_cargados.push(hospital);     // guarda los hospitaes en un diccionario
        });
        console.log(hospitales_cargados);
    })
    .then(() => {
        console.log("Creating markers");
        for (let i = 0; i < hospitales_cargados.length; i++) {
            // Determinar el color del marcador segun la cantidad de personas en todas las filas de todas las secciones
            let cantidad_personas = 0;
            hospitales_cargados[i].secciones.forEach(seccion => {
                cantidad_personas += seccion.fila;
            });
            if (cantidad_personas > 15) {
                icono = MarcadorRojo;
            } else if (cantidad_personas > 5) {
                icono = MarcadorAmarillo;
            } else {
                icono = MarcadorVerde;
            }
            var marker = L.marker([hospitales_cargados[i].latitud, hospitales_cargados[i].longitud], {icon: icono}).addTo(map);
            marker.bindPopup("<b>" + hospitales_cargados[i].nombre + "</b>");

            marker.on('click', function(marker){    // Lo que ocurre al clickear un marcador del mapa

                document.getElementById("idseccion-form").value = "";


                document.getElementById("index-hospital-name").innerHTML = hospitales_cargados[i].nombre;

                let secciones_table_body = document.getElementById("index-secciones-lista");

                while (secciones_table_body.firstChild) {
                    secciones_table_body.removeChild(secciones_table_body.lastChild);       // mata a todos los hijos de la lista de secciones
                }

                current_hospital = hospitales_cargados[i].idcentro;

                hospitales_cargados[i].secciones.forEach(seccion => {        // añade las secciones del hospital al html
                    let table_row = document.createElement("tr");
                    let table_data = document.createElement("td");
                    table_data.innerHTML = seccion.nombreseccion;
                    table_row.appendChild(table_data);
                    table_row.setAttribute("role", "button");
                    secciones_table_body.appendChild(table_row);
                })

                document.getElementById("index-filas-seccion").innerHTML = "Seleccione una sección";
                document.getElementById("index-filas-cantidad").innerHTML = ". . .";


                let lista_secciones = document.getElementById("index-secciones-lista");
                lista_secciones.childNodes.forEach(child => {
                    child.addEventListener("click", function() {                        // funcion al clickear una sección
                        for (let k = 0; k < hospitales_cargados[i].secciones.length; k++) {
                            lista_secciones.childNodes[k].classList.remove("table-success");
                        }
                        this.classList.add("table-success");                // cambia el color de la seccion seleccionada y quita el color de las demas

                        document.getElementById("index-filas-seccion").innerHTML = this.textContent;    // muestra el nombre de la seccion seleccionada en el cuadro de filas

                        for (let k = 0; k < hospitales_cargados[i].secciones.length; k++) {          // busca el numero de fila correspondiente a la seccion seleccionada

                            // Si la seccion seleccionada es igual a una seccion en la lista de secciones...
                            if (hospitales_cargados[i].secciones[k].nombreseccion == this.textContent) {

                                // Agrega el id de la seccion al formulario
                                document.getElementById("idseccion-form").value = hospitales_cargados[i].secciones[k].idseccion;

                                // Muestra la cantidad de personas en la fila de la seccion seleccionada
                                document.getElementById("index-filas-cantidad").textContent = hospitales_cargados[i].secciones[k].fila + " personas";
                            }
                        }
                    })
                });
                
                selectingHospital();
            });
            hospitales_cargados[i].marker = marker;
        }
    })



// var marker = L.marker([-38.736703, -72.610633], {icon: MarcadorRojo}).addTo(map);  // Creacion de un marcador
var current_hospital = 0;

        
selectingHospital();