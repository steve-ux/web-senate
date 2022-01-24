let chamber =
  document.title === "Data Insight Group - Senate" ? "senate" : "house";
let endpoint = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`;

let init = {
  headers: {
    "x-API-Key": "Eo4HEUMV0gufzTo8BcBhjhiYLaPt7TA8Qso5b8JU",
  },
};

fetch(endpoint, init)
  .then((res) => res.json())
  .then((data) => {
    const members = data.results[0].members;
    let estadisticas = {
      democrats: [],
      republicans: [],
      independents: [],
    };

    estadisticas.democrats = members.filter((miembro) => miembro.party === "D");
    estadisticas.republicans = members.filter(
      (miembro) => miembro.party === "R"
    );
    estadisticas.independents = members.filter(
      (miembro) => miembro.party === "ID"
    );

    // Sacar el promedio

    function encontrarPromedio(array, parametro) {
      let promedio = 0;
      let suma = 0;

      array.forEach((element) => {
        suma += element[parametro];
      });

      promedio = suma / array.length;

      return isNaN(promedio) ? 0 : promedio.toFixed(2);
    }

    let promedioDem = parseFloat(
      encontrarPromedio(estadisticas.democrats, "votes_with_party_pct")
    );
    let promedioRep = parseFloat(
      encontrarPromedio(estadisticas.republicans, "votes_with_party_pct")
    );
    let promedioInd = parseFloat(
      encontrarPromedio(estadisticas.independents, "votes_with_party_pct")
    );

    let tabla = document.querySelector("#table-glance");

    // Tabla AtGlance

    function renderAtGlance(estadistic) {
      let suma1 =
        estadisticas.democrats.length +
        estadisticas.republicans.length +
        estadisticas.independents.length;
      let suma2 =
        (promedioDem + promedioRep + promedioInd) /
        (members.party === "ID" ? 3 : 2);

      tabla.innerHTML += `
                            <tr>
                            <th scope="row">Democrats</th>
                            <td>${estadistic.democrats.length}</td>
                            <td>${promedioDem} &percnt;</td>
                            </tr>
                            <tr>
                            <th scope="row">Republican</th>
                            <td>${estadistic.republicans.length}</td>
                            <td>${promedioRep} &percnt;</td>
                            </tr>
                            <tr>
                            <th scope="row">Independents</th>
                            <td>${estadistic.independents.length}</td>
                            <td>${promedioInd} &percnt;</td>
                            </tr>
                            <tr>
                            <th scope="row">Total</th>
                            <td>${suma1}</td>
                            <td>${suma2}&percnt;</td>
                            </tr>
                            `;
    }

    renderAtGlance(estadisticas);

    // Funcion de los porcentajes

    function mostrarPorcentaje(array) {
      let porcentaje = array.length * 0.1;
      return porcentaje;
    }

    let resultadoDePorcentaje = Math.round(mostrarPorcentaje(members));

    const arraySinTotalVotesCero = members.filter(
      (elemento) => elemento.total_votes != 0
    );

    // Filtrar datos de tablas

    function filtrarDatos(array, propiedad, boolean) {
      let arrayAuxiliar = [...array];

      let resultado = arrayAuxiliar.sort((a, b) => {
        return boolean
          ? b[propiedad] - a[propiedad]
          : a[propiedad] - b[propiedad];
      });

      return resultado.slice(0, resultadoDePorcentaje);
    }

    let resultadoAusentes = filtrarDatos(members, "missed_votes_pct", true);
    let resultadoPresentes = filtrarDatos(members, "missed_votes_pct", false);
    let resultadoMenosLeales = filtrarDatos(
      arraySinTotalVotesCero,
      "votes_with_party_pct",
      false
    );
    let resultadoMasLeales = filtrarDatos(
      members,
      "votes_with_party_pct",
      true
    );

    // Render de tablas

    function renderTables(array, id, parametro, parametro2) {
      const tablasInferiores = document.querySelector(`#${id} tbody`);
      if (tablasInferiores) {
        array.forEach((element) => {
          let fila = document.createElement("tr");

          let nombre = `${element.last_name}, ${element.first_name} ${
            element.middle_name ? element.middle_name : ""
          } `;
          fila.innerHTML += `
                                    <td><a target="blank" href=${element.url}>${nombre}</a></td>
                                    <td>${element[parametro]}</td>
                                    <td>${element[parametro2]}&percnt;</td>
                                    `;
          tablasInferiores.appendChild(fila);
        });
      }
    }

    renderTables(
      resultadoPresentes,
      "table-top",
      "missed_votes",
      "missed_votes_pct"
    );
    renderTables(
      resultadoAusentes,
      "table-bottom",
      "missed_votes",
      "missed_votes_pct"
    );
    renderTables(
      resultadoMenosLeales,
      "table-no-leal",
      "total_votes",
      "votes_with_party_pct"
    );
    renderTables(
      resultadoMasLeales,
      "table-leal",
      "total_votes",
      "votes_with_party_pct"
    );
  })
  .catch((err) => console.log(err.message));
