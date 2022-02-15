document.querySelectorAll(".filter-label-age").forEach(setupSelectorAge);
document.querySelectorAll(".filter-label-type").forEach(setupSelectorType);

function setupSelectorAge(selector) {
  selector.addEventListener("change", (e) => {
    console.log("changed", e.target.value);
  });

  selector.addEventListener("mousedown", (e) => {
    if (window.innerWidth >= 420) {
      // override look for non mobile
      e.preventDefault();

      const select = selector.children[0];
      const dropDown = document.createElement("ul");
      dropDown.className = "selector-options";

      [...select.children].forEach((option) => {
        const dropDownOption = document.createElement("li");
        dropDownOption.textContent = option.textContent;

        dropDownOption.addEventListener("mousedown", (e) => {
          e.stopPropagation();
          select.value = option.value;
          selector.value = option.value;
          select.dispatchEvent(new Event("change"));
          selector.dispatchEvent(new Event("change"));
          dropDown.remove();
        });

        dropDown.appendChild(dropDownOption);
      });

      selector.appendChild(dropDown);

      // handle click out
      document.addEventListener("click", (e) => {
        if (!selector.contains(e.target)) {
          dropDown.remove();
        }
      });
    }
  });
}

function setupSelectorType(selector) {
  selector.addEventListener("change", (e) => {
    MovieType = e.target.value;
    console.log("changed", e.target.value);
  });

  selector.addEventListener("mousedown", (e) => {
    if (window.innerWidth >= 420) {
      // override look for non mobile
      e.preventDefault();

      const select = selector.children[0];
      const dropDown = document.createElement("ul");
      dropDown.className = "selector-options";

      [...select.children].forEach((option) => {
        const dropDownOption = document.createElement("li");
        dropDownOption.textContent = option.textContent;

        dropDownOption.addEventListener("mousedown", (e) => {
          e.stopPropagation();
          select.value = option.value;
          selector.value = option.value;
          select.dispatchEvent(new Event("change"));
          selector.dispatchEvent(new Event("change"));
          dropDown.remove();
        });

        dropDown.appendChild(dropDownOption);
      });

      selector.appendChild(dropDown);

      // handle click out
      document.addEventListener("click", (e) => {
        if (!selector.contains(e.target)) {
          dropDown.remove();
        }
      });
    }
  });
}

function renderMovieList(cssSelector, list) {
  let html = "";

  for (let i in Object.entries(list)) {
    html += '<div class="box">';
    html += "<div id=" + list[i].id + "></div>";
    html += '<div class="box-img">';
    html += '<img src="./images/' + list[i].image2 + '" alt="" />';
    html += "</div>";
    html += "<h3>" + list[i].title + "</h3>";
    html += "<span>" + list[i].duration + " / " + list[i].genre + "</span>";
    html += "</div >";
  }

  document.querySelector(cssSelector).innerHTML = html;
  var items = document.getElementsByClassName("box");
  for (let i = 0; i < items.length; i++) {
    items[i].addEventListener("click", function () {
      console.log(items[i]);
    });
  }
  return html;
}

async function start() {
  renderMovieList(
    ".active-movies-container",
    await getData("/api/allActiveMovies")
  );
  renderMovieList(
    ".coming-movies-container",
    await getData("/api/allComingMovies")
  );
}

async function applyFilter() {
  let type = document.getElementById("filter-down-box-type").value;
  let age = document.getElementById("filter-down-box-age").value;

  console.log(type);
  if (age != "all") {
    age = Math.floor(age);
  }

  let movieList = await getData("/api/allActiveMovies");
  let filterList = [];

  for (let i = 0; i < movieList.length; i++) {
    //let genre = movieList[i].genre.split(", ");

    if (movieList[i].ageLimit <= age) {
      console.log(movieList[i].genre);
      if (type != "all") {
        if (movieList[i].genre.includes(type)) {
          filterList.push(movieList[i]);
        }
      }

      console.log(filterList.length);
      renderMovieList(".active-movies-container", filterList);
    }

    if (age == "all" && type == "all") {
      start();
    }
  }
}
function loopGenre(genre) {
  console.log("genre List :" + genre);
  let genreText;
  for (let i = 0; i < genre.length; i++) {
    genreText = genre[i];
    console.log("genre List :" + genreText);
  }
  return genreText;
}
