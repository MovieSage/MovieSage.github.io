$(document).ready(function() {
  // Código adicional que puedas tener dentro de esta función
});

function mainQuery(){
  createAndrunQuery();
}

function createAndrunQuery() {
  
  var counter = 1
  var counterD = 0
  const driver = neo4j.driver('bolt://52.70.153.190:7687', neo4j.auth.basic('neo4j', 'thirteen-photos-snow'));
  const actorName = document.getElementById('actor').value;
  const directorName = document.getElementById('director').value;
  const rankingSlider = document.getElementById('ranking');
  const rankingValue = parseFloat(rankingSlider.value).toFixed(1);
  const selectedRadioButton = document.querySelector('input[name="genre"]:checked');
  let labelText = ''; // Valor predeterminado si no se selecciona ningún radio button
  
  if (selectedRadioButton) {
    labelText = selectedRadioButton.value;
  }
  
  const conditions = [];

  let query = 'MATCH (m:Movie) ';

    // Condiciones para unir con actores y directores
    if (actorName) {
        query += `MATCH (a:Actor {name: '${actorName}'})-[:Acted_in]->(m)`;
    }

    if (directorName) {
        query += `MATCH (d:Director {name: '${directorName}'})-[:Directed]->(m)`;
    }

    // Condiciones para género y ranking
    if ((labelText && !(labelText.match("No importa")) )) {
        conditions.push(`m.genre = '${labelText}'`);
    }

    if (rankingValue && rankingValue != 0) {
        conditions.push(`m.rating >= ${rankingValue}`);
    }

    // Agregar las condiciones a la consulta
    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    // Decidir qué retornar
    if (actorName || directorName) {
        query += ' RETURN m.title, m.year, m.rating, m.genre';
        
        if (directorName) {
            query += ', d.name';
        }
    } else {
        query += ' RETURN m.title, m.year, m.rating, m.genre';
    }
  


  //const query = `MATCH (a:Actor {name: 'Arnold Schwarzenegger'})-[:Acted_in]->(m:Movie) MATCH (d:Director {name: 'James Cameron'})-[:Directed]->(m) WHERE m.genre = 'Acción' AND m.rating >= 8.0 RETURN m.title`;
  //const query = `MATCH (a:Actor {name: '${actorName}'})-[:Acted_in]->(m:Movie)  MATCH (d:Director {name: '${directorName}'})-[:Directed]->(m) WHERE m.genre = '${labelText}' AND m.rating >= ${rankingValue} RETURN m.title, m.year, m.rating, m.genre, d.name`;

  //console.log(query);
  console.log(query);

  for (let index = counter; index <= 6; index++) {
    document.getElementById('movieTitle' + (index)).textContent = 'Película ' + index;
    document.getElementById('movieYear' + (index)).textContent = 'año';
    document.getElementById('movieRank' + (index)).textContent = 'punteo';
    document.getElementById('movieGenre' + (index)).textContent = 'Género';
    document.getElementById('movieDirector' + (index)).textContent = 'Director'; 
    document.getElementById('movieSpace' + (index)).style.display = 'none';
    
  }

  

  const session = driver.session();
  session.run(query)
        .then(result => {
          result.records.forEach(record => {
            
            let moviesAsObject = [];
            
            var movieName = record.get('m.title');
            var movieYear = record.get('m.year');
            var movieGenre = record.get('m.genre');
            var movieRanking = record.get('m.rating')

            let movieYearExtracted;

            if(counterD == 1){
              var movieDirector = record.get('d.name')
              document.getElementById('movieDirector' + (counter)).textContent = movieDirector;  
            }

            console.log(record);

            if (typeof movieYear === 'object' && 'low' in movieYear && 'high' in movieYear) {
            // Si es una representación de Integer
            movieYearExtracted = movieYear.low || movieYear.high;
            } else {
            // Si es un número regular
            movieYearExtracted = movieYear;
            }

            const movieObj= [{mName: movieName, mYear: movieYearExtracted, mRating: movieRanking, mGenre: movieGenre, mDirector: movieDirector}];
            moviesAsObject.push(movieObj);


            document.getElementById('movieTitle' + (counter)).textContent = movieName
            document.getElementById('movieYear' + (counter)).textContent = movieYearExtracted
            document.getElementById('movieRank' + (counter)).textContent = (movieRanking).toString();
            document.getElementById('movieGenre' + (counter)).textContent = movieGenre;
            document.getElementById('movieSpace' + (counter)).style.display = 'block';

        
            counter++;

            
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

function setCards(arrayMoviesAsObj){

  console.log("si")
  let cardCounter = 0;
  
  if(arrayMoviesAsObj.length < 6){
    cardCounter = arrayMoviesAsObj.length;
  } else if(arrayMoviesAsObj.length > 6){
    cardCounter = 6;
  }

  for (let i = 0; i < cardCounter; i++) {
    

    
      document.getElementById('movieTitle' + (i + 1)).textContent = arrayMoviesAsObj[i].mName;
      document.getElementById('movieYear' + (i + 1)).textContent = arrayMoviesAsObj[i].mYear;
      document.getElementById('movieRank' + (i + 1)).textContent = (arrayMoviesAsObj[i].mRating).toString();
      document.getElementById('movieGenre' + (i + 1)).textContent = arrayMoviesAsObj[i].mGenre;
      document.getElementById('movieDirector' + (i + 1)).textContent = arrayMoviesAsObj[i].mDirector;

    
  }

}