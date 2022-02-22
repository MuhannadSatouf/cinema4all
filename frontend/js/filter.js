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

//Click on Submit button for filtering
async function applyFilter() {
  let type = document.getElementById("filter-down-box-type").value;
  let age = document.getElementById("filter-down-box-age").value;

  if (age != "all") {
    age = Math.floor(age);
  }

  let movieList = await getData("/api/allActiveMovies");
  let filterList = [];

  for (let i = 0; i < movieList.length; i++) {
    if (movieList[i].ageLimit <= age) {
      if (type != "all") {
        if (movieList[i].genre.includes(type)) {
          filterList.push(movieList[i]);
        }
      }
      if (type == "all") {
        filterList.push(movieList[i]);
      }
      renderMovieList(".active-movies-container", filterList);
    }
    if (age == "all") {
      if (type != "all") {
        if (movieList[i].genre.includes(type)) {
          filterList.push(movieList[i]);
        }
      }
      renderMovieList(".active-movies-container", filterList);
    }

    if (age == "all" && type == "all") {
      // Will rerender the first page with all movies
      start();
    }
    if (filterList.length == 0) {
      //Another thing ti display at there is no movie with that filter
    }
  }
}
