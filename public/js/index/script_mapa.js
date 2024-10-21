function onMapClick(e) {                                   // Funcion que muestra un popup con Latitud/Longitud al hacer click en el mapa
    popup
        .setLatLng(e.latlng)
        .setContent("Has hecho click en " + e.latlng.toString())
        .openOn(map);
    }

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


var popup = L.popup();                                     // Creacion de un popup


map.on('click', onMapClick);


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

var hospitales_en_json = {};

console.log("Fetching json");
fetch("fetch_testing/json_prueba.json")     // este fetch crea los marcadores en relación a los hospitales en el json, además de configurar listeners que actualizaran la información de la pagina al hacer click en un marcador
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data);
        return data;
    })
    .then((hospitales) => {
        console.log("añadiendo hospitales del json");
        hospitales.forEach(hospital => {
            console.log("añadiendo " + hospital.nombre);
            hospitales_en_json[hospital.id] = hospital;     // guarda los hospitaes en un diccionario
        });
    })
    .then(() => {
        console.log("Creating markers");
        for (let i = 1; i < Object.keys(hospitales_en_json).length + 1; i++) {
            var marker = L.marker([hospitales_en_json[i].latitud, hospitales_en_json[i].longitud], {icon: MarcadorRojo}).addTo(map);
            marker.bindPopup("<b>" + hospitales_en_json[i].nombre + "</b>");

            marker.on('click', function(marker){    // Lo que ocurre al clickear un marcador del mapa
                document.getElementById("index-hospital-name").innerHTML = hospitales_en_json[i].nombre;

                let secciones_table_body = document.getElementById("index-secciones-lista");

                while (secciones_table_body.firstChild) {
                    secciones_table_body.removeChild(secciones_table_body.lastChild);       // mata a todos los hijos de la lista de secciones
                }

                current_hospital = hospitales_en_json[i].id;

                hospitales_en_json[i].secciones.forEach(seccion => {        // añade las secciones del hospital al html
                    let table_row = document.createElement("tr");
                    let table_data = document.createElement("td");
                    table_data.innerHTML = seccion;
                    table_row.appendChild(table_data);
                    table_row.setAttribute("role", "button");
                    secciones_table_body.appendChild(table_row);
                })

                document.getElementById("index-filas-seccion").innerHTML = "Seleccione una sección";
                document.getElementById("index-filas-cantidad").innerHTML = ". . .";


                let lista_secciones = document.getElementById("index-secciones-lista");
                lista_secciones.childNodes.forEach(child => {
                    child.addEventListener("click", function() {                        // funcion al clickear una sección
                        for (let k = 0; k < hospitales_en_json[i].secciones.length; k++) {
                            lista_secciones.childNodes[k].classList.remove("table-success");
                        }
                        this.classList.add("table-success");                // cambia el color de la seccion seleccionada y quita el color de las demas

                        document.getElementById("index-filas-seccion").innerHTML = this.textContent;    // muestra el nombre de la seccion seleccionada en el cuadro de filas

                        for (let k = 0; k < hospitales_en_json[i].secciones.length; k++) {          // busca el numero de fila correspondiente a la seccion seleccionada
                            console.log(hospitales_en_json[i].secciones[k] + " contra " + this.textContent);
                            if (hospitales_en_json[i].secciones[k] == this.textContent) {
                                document.getElementById("index-filas-cantidad").textContent = hospitales_en_json[i].filas[k] + " personas";
                            }
                        }
                    })
                });



                    /*lista_secciones.childNodes[j].addEventListener("click", function() {        // cambia el color de la seccion seleccionada
                        for (let k = 0; k < hospitales_en_json[i].secciones.length; k++) {
                            lista_secciones.childNodes[k].class = '';
                        }
                        this.class = "selected";

                        document.getElementById("index-filas-subtitulo").innerHTML = this.innerHTML;    // muestra el nombre de la seccion seleccionada en el cuadro de filas
                        for (let k = 0; k < hospitales_en_json[i].secciones.length; k++) {          // busca el numero de fila correspondiente a la seccion seleccionada
                            if (hospitales_en_json[i].secciones[k] == this.innerHTML) {
                                document.getElementById("index-filas-value").innerHTML = hospitales_en_json[i].filas[k] + " personas";
                            }
                        }
                    })*/
                

                selectingHospital();
            });
            hospitales_en_json[i].marker = marker;
        }
    })



// var marker = L.marker([-38.736703, -72.610633], {icon: MarcadorRojo}).addTo(map);  // Creacion de un marcador
var current_hospital = 0;

        
selectingHospital();



/* marker.bindPopup("<b>Clinica Alemana</b>");  // Popup del marcador
marker.on('click', function(marker){        // Al clickear un hospital se recolecta se información en el servidor y se muestra en la pagina
fetch("fetch_testing/json_prueba.json")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        document.getElementById("index-hospital-name").innerHTML = data.nombre;
        current_hospital = data.nombre;
        selectingHospital();
    });
}) */
        