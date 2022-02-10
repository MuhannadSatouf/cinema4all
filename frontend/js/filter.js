document.querySelectorAll(".filter-label-age").forEach(setupSelectorAge);
document.querySelectorAll(".filter-label-type").forEach(setupSelectorType);
var age = "age-all";
var MovieType = "all";

function setupSelectorAge(selector) {
  selector.addEventListener("change", (e) => {
    console.log("changed", e.target.value);
    age = e.target.value;
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

async function filterType(type) {}

async function filterAge(age) {
  if (age === "age-16") {
    renderMovieList(
      ".active-movies-container",
      await getData("/api/allActiveMoviesOver")
    );
  } else if (age === "age-10") {
    renderMovieList(
      ".active-movies-container",
      await getData("/api/allActiveMoviesOver")
    );
  } else if (age === "age-6") {
    renderMovieList(
      ".active-movies-container",
      await getData("/api/allActiveMoviesOver")
    );
  } else {
    renderMovieList(
      ".active-movies-container",
      await getData("/api/allActiveMovies")
    );
  }
}

async function applyFilter(age, MovieType) {
  console.log("This is the 2 " + MovieType);
  console.log("This is the " + age);

  //Here will inject data for filtering.
}
