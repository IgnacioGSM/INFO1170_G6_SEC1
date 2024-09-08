var map = L.map('map').setView([-38.734547, -72.589724], 13);   // Creacion del mapa
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {     // Capa de OpenStreetMap
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);


        var popup = L.popup();

        function onMapClick(e) {                                   // Funcion que muestra un popup con Latitud/Longitud al hacer click en el mapa
        popup
            .setLatLng(e.latlng)
            .setContent("Has hecho click en " + e.latlng.toString())
            .openOn(map);
        }
        map.on('click', onMapClick);