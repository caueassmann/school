document.addEventListener("DOMContentLoaded", function(event) {
    //displaying country data when loading a page//
    //Brazil API requisition//
    const URL = "https://covid19-brazil-api.now.sh/api/report/v1/brazil";
    fetch(URL)
    .then(response => response.json())
    .then(brasil => {
        //print
        document.querySelector("#estado_name").innerHTML  = "Brasil";
        document.querySelector("#numero_contaminados").innerHTML  = brasil['data'].confirmed ;
        document.querySelector("#numero_mortes").innerHTML  =  brasil['data'].deaths ;
         });//close api requisition
    //button to get all states and your data//
    var captura = document.getElementById("svg-map").getElementsByTagName("a");
    for (var i = captura.length - 1; i >= 0; i--) {
        captura[i].addEventListener("click", decision , false);
    }

    //button to rank by deaths//
    var captura_ranking_mortes = document.getElementById("deaths");
    captura_ranking_mortes.addEventListener("click", get_ranking, false);

    //button to rank by cases//
    var captura_ranking_casos = document.getElementById("casos");
    captura_ranking_casos.addEventListener("click", get_ranking, false);

    //rank by cases when loading a page//
    get_ranking(captura_ranking_casos.id);
});




//function to determinate if there is date or not//
function decision(event){
    let id_estado= this.id; //id off the button//
    if (document.getElementById("data_final").value) {
        //with date//
        get_data_final(id_estado);
    }
    else if(document.getElementById("data_inicial").value){//cannot get a initial date without final date//
        alert("datas incongruentes, por favor selecione uma data válida");
        document.location.reload(true);
    }
    else{
        //without date//
        get_estado_nodata(id_estado);
    }
}

//function to get data state without date//
function get_estado_nodata(id_estado){
    //api requisition
    const URL = "https://covid19-brazil-api.now.sh/api/report/v1/brazil/uf/"+ id_estado;//id of the button//
    fetch(URL)
    .then(response => response.json())
    .then(estado => {
        //print
        document.querySelector("#estado_name").innerHTML  = estado.state;
        document.querySelector("#numero_contaminados").innerHTML  = estado.cases ;
        document.querySelector("#numero_mortes").innerHTML  =  estado.deaths ;
         });//close api requisition
}



/*function to get state cases from a specific date or final date of a period*/
function get_data_final(sigla_estado){
    var data = document.getElementById("data_final").value;//get date//
    let data_string = data.split("-").join("");//concatenate date//
    if (data) {//if there is a valid date//
        //api requisition//
        const URL = "https://covid19-brazil-api.now.sh/api/report/v1/brazil/" +data_string ;
        fetch(URL)
        .then(response => response.json())
        .then(data_estado_final => {
             if (data_estado_final['data'].length !== 0) {//if the array is not empty
                for (var i = data_estado_final['data'].length - 1; i >= 0; i--) {
                    if (data_estado_final['data'][i].uf == sigla_estado.toUpperCase()){//go through array until find specific state//
                        //if there is no second date//
                        if (!get_data_inicial(sigla_estado,data_estado_final['data'][i].deaths, data_estado_final['data'][i].cases, data)) {//function of the initial date
                            //print//
                            document.querySelector("#estado_name").innerHTML  = data_estado_final['data'][i].state;
                            document.querySelector("#numero_contaminados").innerHTML  = data_estado_final['data'][i].cases;
                            document.querySelector("#numero_mortes").innerHTML  =  data_estado_final['data'][i].deaths ;
                       }     
                    }
                }
            }else{//if the array is empty//
                alert("ainda não temos dados referentes a essas datas");
                document.location.reload(true);
            }         
        });//close api requisition//
    }else{//if the date is not valid//
        alert("datas incongruentes, por favor selecione uma data válida");
        document.location.reload(true);
    }
}

//function of initial date and state data//
function get_data_inicial(sigla_estado, mortes, casos, data_final){
    let data = document.getElementById("data_inicial").value;//get date//
    if (data && data_final) {//if both initial date and final date are valid//
        if (data_final > data ) {//if final date is more recent then initial date//
            let data_string = data.split("-").join("");//concatenate date//
            //api requisition//
            const URL = "https://covid19-brazil-api.now.sh/api/report/v1/brazil/" +data_string ;
            fetch(URL)
            .then(response => response.json())
            .then(data_estado_inicial => {
                if (data_estado_inicial['data'].length !== 0) {//if the array is not empty
                     for (var i = data_estado_inicial['data'].length - 1; i >= 0; i--) {
                        if (data_estado_inicial['data'][i].uf == sigla_estado.toUpperCase()){//go through array until find specific state//
                            //print//
                            document.querySelector("#estado_name").innerHTML  = data_estado_inicial['data'][i].state;
                            document.querySelector("#numero_contaminados").innerHTML  = casos - data_estado_inicial['data'][i].cases;
                            document.querySelector("#numero_mortes").innerHTML  =   mortes - data_estado_inicial['data'][i].deaths;   
                        }   
                    }
                }else{//if the array is empty
                    alert("a data inserida é inválida ou ocorreu outro erro, tente novamente");
                    document.location.reload(true);
                }
            });
        }else{//if the initial date is more recent then final date//
            alert("datas incongruentes, por favor selecione uma data válida");
            document.location.reload(true);
        }
    }
}

//function to get ranking of the states//
function get_ranking(event){
    let dado = this.id;//is deaths or cases//
    const URL = "https://covid19-brazil-api.now.sh/api/report/v1";
    fetch(URL)
    .then(response => response.json())
    .then(estado => {
        let estado_numeros = [];
        let value= 0;
         for (var i = estado['data'].length - 1; i >= 0; i--) {//add api values to an array 
                if (dado=="deaths") {
                    estado_numeros[i] = estado['data'][i].deaths;
                    }
                    else{
                        estado_numeros[i] = estado['data'][i].cases;
                    }
            
            }
            estado_numeros = estado_numeros.sort(function (a, b){
                return (b - a) //causes the array to be ordered numerically and in descending order.
            });
            for (var y = 0; y <=estado_numeros.length - 1 ; y++) {
                for (var i = 0; i <= estado['data'].length - 1; i++) {
                    if (dado =="deaths") {
                        value = estado['data'][i].deaths;//value = deaths of each state
                    }
                    else{
                        value = estado['data'][i].cases;//value = cases of each state
                    }
                    if (estado_numeros[y]== value) {//go through array until find specific state//
                        //function to create divs//
                        print_table(y, estado_numeros.length -1);
                        //print//
                        document.querySelector(".dado"+ y + "2").innerHTML= estado['data'][i].uf;
                        document.querySelector(".dado"+ y + "1").innerHTML= estado['data'][i].cases;
                        document.querySelector(".dado"+ y + "0").innerHTML= estado['data'][i].deaths;
                    }
                }
                
            }
            

         });
}
//functioon to create divs of ranking//
function print_table(i, tamanho){
    if (!document.querySelector(".dado"+ tamanho + "2")) {//if the last div is not created//
        let area_dados_estado = document.querySelector("#dados_estados");
        let tr = document.createElement('tr');
        area_dados_estado.appendChild(tr);
        let th = document.createElement('th');
        th.setAttribute('class', 'row');
        tr.appendChild(th);
        th.innerHTML = i+1;
        for (var z = 2; z >= 0; z--) {
        let td = document.createElement('td');
        td.setAttribute('class','dado'+ i + "" + z);
        tr.appendChild(td);
        }
    }
}