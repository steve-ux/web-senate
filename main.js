let chamber = document.querySelector("#congress-table-senate") ? "senate" : "house"
let endpoint = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`

let init = {
    headers:{
        "x-API-Key":"Eo4HEUMV0gufzTo8BcBhjhiYLaPt7TA8Qso5b8JU"
    }
}

fetch(endpoint, init)
    .then(res => res.json())
    .then(data =>{
        
const member = data.results[0].members
const cuerpoTabla = document.querySelector(`#congress-table-${chamber} tbody`)

// Inyectar Tablas


function inyectarTabla(members){
    
    cuerpoTabla.innerHTML = ""
    
    members.forEach(member => {
        let nombre = `${member.last_name} ${member.first_name} ${(member.middle_name) ? member.middle_name : ""} `
    
        cuerpoTabla.innerHTML += `
            <tr>
            <td><a target="blank" href=${member.url}> ${nombre}</a></td>
            <td>${member.party}</td>
            <td>${member.state}</td>
            <td>${member.seniority}</td>
            <td>${member.votes_with_party_pct} &percnt;</td>
            </tr>
            `
    })

}

inyectarTabla(member)


// FILTRO POR PARTIDO

function noRepetirPais(array) {
    
    let arrayAux = []
    array.forEach(member => {
        if(!arrayAux.includes(member.state)){
            arrayAux.push(member.state)
        }
    })
    return arrayAux;
    
}

let estados = noRepetirPais(member).sort()

let states = document.querySelector("#select-states")


function rellenarEstados() {
    estados.forEach(estado => {
    states.innerHTML += `
                        <option value="${estado}">
                        ${estado}
                        </option> 
                        `
    }) 
    
}
rellenarEstados(estados)


states.addEventListener("change", filtrarStates)


function filtrarStates() {
    
    let estadosElegidos;
    
    if(states.value != "All"){
        estadosElegidos = member.filter(estado => estado.state == states.value)
    }else{
    
        estadosElegidos = member
    }
    estadosElegidos = estadosElegidos.filter(estados => partidos.includes(estados.party))

    inyectarTabla(estadosElegidos)
}

// filtrar por checkbox

let partidos = ['D','R','ID']

let tiposDePartidos = document.querySelectorAll("input[type='checkbox']")
 
let partidosArray = Array.from(tiposDePartidos)


partidosArray.forEach(check => {
    check.addEventListener('change', evento => {
        
        let checkSeleccionado = evento.target.value;

        let checkeado = evento.target.checkbox;

    
        if(partidos.includes(checkSeleccionado) && !checkeado){
            partidos = partidos.filter(partido => partido != checkSeleccionado)
        }else{
            partidos.push(checkSeleccionado)
        }
        
        filtrarStates()
    })
})
   

    })
    .catch(err => console.log(err.message))



