$(document).ready(function() {


    createAndrunQuery();


});


function createAndrunQuery(){

      const driver = neo4j.driver('bolt://54.89.78.142:7687', neo4j.auth.basic('neo4j', 'screw-transistor-orifices'));
      // nombres de actores y directores 
      const actorName = document.getElementById(actor).value;
      const directorName = document.getElementById(director).value;

      // géneros de películas
      const genreAction = document.getElementById(genre-action).value;
      const genreComedy = document.getElementById(genre-comedy).value;
      const genreTerror = document.getElementById(genre-terror).value;
      const genreRomance = document.getElementById(genre-romance).value;
      const genreSciFi = document.getElementById(genre-SciFi).value;

      // ranking 
      const movieRating = document.getElementById(ranking).value; 

      // inicio de querys
      // querys para director y actor
      const queryActor = `MATCH (m:Movie)-[:Actor_in]->(a:Actor {name: '${actorName}'}) RETURN m.title`;
      const queryDirector = `MATCH (m:Movie)-[:Directed_by]->(d:Director {name: '${directorName}'}) RETURN m.title`;

      // querys para generos
      const queryAction = `MATCH (m:Movie) WHERE m.genre = '${genreAction}' RETURN m.title`;
      const queryComedy = `MATCH (m:Movie) WHERE m.genre = '${genreComedy}' RETURN m.title`;
      const queryTerror = `MATCH (m:Movie) WHERE m.genre = '${genreTerror}' RETURN m.title`;
      const queryRomance = `MATCH (m:Movie) WHERE m.genre = '${genreRomance}' RETURN m.title`;
      const querySciFi = `MATCH (m:Movie) WHERE m.genre = '${genreSciFi}' RETURN m.title`;

      // querys ranking
      const queryRating = `MATCH (m:Movie) WHERE m.rating = '${movieRating}' RETURN m.title`;


      
      const session = driver.session();


      session.run(query)
        .then(result => {
          result.records.forEach(record => {
            var node = record.get('n');
            var prop = node.properties;
            console.log(prop)

       

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