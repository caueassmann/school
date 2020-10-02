document.addEventListener("DOMContentLoaded", function(event) {
    var captura =document.getElementById("svg-map").getElementsByTagName("a");
    for (var i = captura.length - 1; i >= 0; i--) {
        captura[i].addEventListener("click", decision , false);
    }
});


function decision(event){
    let id_estado= this.id;
    if (document.getElementById("data_inicial").value) {
        get_data_init(id_estado);
    }
    else{
        get_estado_nodata(id_estado);
    }
}


function get_estado_nodata(id_estado){
    const URL = "https://covid19-brazil-api.now.sh/api/report/v1/brazil/uf/"+ id_estado;
    fetch(URL)
    .then(response => response.json())
    .then(estado => {
        document.querySelector("#estado_name").innerHTML  = estado.state;
        document.querySelector("#numero_contaminados").innerHTML  = estado.cases ;
        document.querySelector("#numero_mortes").innerHTML  =  estado.deaths ;
         });
}
function get_data_init(sigla_estado){
    var data = document.getElementById("data_inicial").value;
    let data_string = data.split("-").join("");
    const URL = "https://covid19-brazil-api.now.sh/api/report/v1/brazil/" +data_string ;
    fetch(URL)
    .then(response => response.json())
    .then(data_estado => {
            for (var i = data_estado['data'].length - 1; i >= 0; i--) {
                if (data_estado['data'][i].uf == sigla_estado.toUpperCase()){
                    let data_end = get_data_end(sigla_estado);
                    console.log(data_end);
                    document.querySelector("#estado_name").innerHTML  = data_estado['data'][i].state;
                    console.log(data_estado['data'][i].cases);
                    document.querySelector("#numero_contaminados").innerHTML  = "Contaminados:" + (data_end.cases - data_estado['data'][i].cases)  ;
                    document.querySelector("#numero_mortes").innerHTML  = "Mortes:" + data_estado['data'][i].deaths ;
                }

            }
            
         });
}

function get_data_end(sigla_estado){
    let data = document.getElementById("data_final").value;
    var mortes = 1;
    let casos = 0;
    if (data) {
        let data_string = data.split("-").join("");
        const URL = "https://covid19-brazil-api.now.sh/api/report/v1/brazil/" +data_string ;
        fetch(URL)
        .then(response => response.json())
        .then(data_estado => {
             for (var i = data_estado['data'].length - 1; i >= 0; i--) {
                if (data_estado['data'][i].uf == sigla_estado.toUpperCase()){
                     return mortes = 2;
                     
                }
            }
            });
        console.log(mortes);
        return mortes;
    }else{
        return false;
    }
}