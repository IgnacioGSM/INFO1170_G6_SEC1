function fetchear(){
    console.log("fetching")

    fetch("fetch_testing/json_prueba.json")
        
        .then((response) => {
            console.log("json checkpoint");
            return response.json();
        })
        .then((data) => {
            console.log(data.secciones);
        });
}

var NombreHospital = document.getElementById("index-hospital-name");
var marcador = docu

function fetchHospital(){
    console.log("a fetchear")

    fetch("fetch_testing/hospitales.json")

}