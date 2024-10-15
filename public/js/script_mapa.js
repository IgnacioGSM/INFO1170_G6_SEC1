var map = L.map('map').setView([-38.734547, -72.589724], 13);   // Creacion del mapa
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {     // Capa de OpenStreetMap
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);


        var popup = L.popup();                                     // Creacion de un popup

        function onMapClick(e) {                                   // Funcion que muestra un popup con Latitud/Longitud al hacer click en el mapa
        popup
            .setLatLng(e.latlng)
            .setContent("Has hecho click en " + e.latlng.toString())
            .openOn(map);
        }
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


        var marker = L.marker([-38.736703, -72.610633], {icon: MarcadorRojo}).addTo(map);  // Creacion de un marcador

        marker.bindPopup("<b>Clinica Alemana</b>");  // Popup del marcador