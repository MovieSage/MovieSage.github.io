$(document).ready(function() {
  // Código adicional que puedas tener dentro de esta función
});

function createAndrunQuery() {
  
  const driver = neo4j.driver('bolt://52.70.153.190:7687', neo4j.auth.basic('neo4j', 'thirteen-photos-snow'));
  const actorName = document.getElementById('actor').value;
  const directorName = document.getElementById('director').value;
  const selectedRadioButton = document.querySelector('input[name="genre"]:checked');
  const rankingSlider = document.getElementById('ranking');
  const rankingValue = parseFloat(rankingSlider.value).toFixed(1);

  let labelText = ''; // Valor predeterminado si no se selecciona ningún radio button

  if (selectedRadioButton) {
    labelText = selectedRadioButton.parentNode.textContent.trim();
  }

  
  const conditions = [];

  let query = '';

  
  if (actorName) {
    query += `MATCH (a:Actor {name: '${actorName}'})-[:Acted_in]->(m:Movie)`;
  }

  if (directorName) {
    query += `MATCH (d:Director {name: '${directorName}'})-[:Directed]->(m)`;
  }

  if (labelText && !(labelText.match("No Importa"))) {
    conditions.push(`m.genre = '${labelText}'`);
  }

  if (rankingValue && rankingValue != 0) {
    conditions.push(`m.rating >= ${rankingValue}`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' RETURN m.title, m.year, m.rating, m.genre, d.name';




  //const query = `MATCH (a:Actor {name: 'Arnold Schwarzenegger'})-[:Acted_in]->(m:Movie) MATCH (d:Director {name: 'James Cameron'})-[:Directed]->(m) WHERE m.genre = 'Acción' AND m.rating >= 8.0 RETURN m.title`;
  //const query = `MATCH (a:Actor {name: '${actorName}'})-[:Acted_in]->(m:Movie)  MATCH (d:Director {name: '${directorName}'})-[:Directed]->(m) WHERE m.genre = '${labelText}' AND m.rating >= ${rankingValue} RETURN m.title, m.year, m.rating, m.genre, d.name`;

  //console.log(query);
  console.log(query);

  const session = driver.session();
  session.run(query, {actorName, directorName, labelText, rankingValue})
        .then(result => {
          result.records.forEach(record => {
            var movieName = record.get('m.title');
            var movieYear = record.get('m.year');
            var movieRanking = record.get('m.genre');
            var movieDirector = record.get('d.name');

            let movieYearExtracted;

            if (typeof movieYear === 'object' && 'low' in movieYear && 'high' in movieYear) {
            // Si es una representación de Integer
            movieYearExtracted = movieYear.low || movieYear.high;
            } else {
            // Si es un número regular
            movieYearExtracted = movieYear;
            }


            console.log(movieName);
            console.log(movieYearExtracted);
            console.log(movieRanking);
            console.log(movieDirector);
          });
        })
        .catch(error => {
          console.error('Error executing Cypher query', error);
        })
        .finally(() => {
          session.close();
          driver.close();
        });


}
