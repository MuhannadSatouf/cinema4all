function renderMovie(cssSelector, movie) {
  let html = "";
  html += '<div class="movie-page">';
  html += '<div class="box">';
  html += '<div id="box-img" class="box-img" >';
  html += '<img src="./images/' + movie.image2 + '" alt="" />';
  html += "</div>";
  html += '<h3 id="h3">' + movie.title + "</h3>";
  html += '<h3 id="h3">' + "Director: " + movie.director + "</h3>";
  html += '<h3 id="h3">' + "Actors: " + movie.actors + "</h3>";
  html += '<h3 id="h3">' + "Aga Limit: +" + movie.ageLimit + "</h3>";
  html += '<h3 id="h3">' + "Movie's language: " + movie.language + "</h3>";
  html += "<span>" + movie.duration + " / " + movie.genre + "</span>";
  html += "</div >";
  html += '<div class="video-box">';
  html += "<iframe  src=" + movie.trailer + '>';
  html += "</iframe>";
  html += "</div >";
  html += "</div >";

  return html;
}

async function showMovieById(movieId) {
  document.querySelector("main").innerHTML = renderMovie(
    ".movieTrailerContainer",
    await getData("/api/allActiveMovies/" + movieId)
  );
  console.log(
    (document.querySelector("main").innerHTML = renderMovie(
      ".movieTrailerContainer",
      await getData("/api/allActiveMovies/" + movieId)
    ))
  );
}
