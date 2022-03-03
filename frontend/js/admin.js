/*
function renderList(cssSelector, list) {
  let html = "<table>";
  html += "<thead><tr>";

  for (let key of Object.keys(list[0])) {
    html += '<th class="' + typeof key + '">' + dict[key] + "</th>";
  }
  html += "</tr></thead>";
  html += "<tbody>";
  for (let item of list) {
    html += "<tr>";
    for (let [key, value] of Object.entries(item)) {
      // must
      html += '<td class="' + typeof value + '">' + value + "</td>";
    }
    html += "</tr>";
  }
  html += "</tbody>";
  html += "</table>";
  document.querySelector(cssSelector).innerHTML = html;
}

async function showMovieById() {
  document.querySelector("main").innerHTML = renderMovie(
    ".movieTrailerContainer",
    await getData("/api/allBooking/")
  );
}

*/
