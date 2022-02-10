async function getData(restRoute) {
  let rawData = await fetch(restRoute);
  let result = {};
  result = await rawData.json();
  return result;
}

let menu = document.querySelector("#fa-bars");
let navbar = document.querySelector(".navbar");

menu.onclick = () => {
  menu.classList.toggle("fa-bars");
  navbar.classList.toggle("active");
};

window.onscroll = () => {
  menu.classList.remove("fa-bars");
  navbar.classList.remove("active");
};

var swiper = new Swiper(".home", {
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 6000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

var swiper = new Swiper(".coming-container", {
  spaceBetween: 20,
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  centeredSlides: true,
  breakpoints: {
    0: {
      slidesPerView: 2,
    },
    568: {
      slidesPerView: 3,
    },
    768: {
      slidesPerView: 4,
    },
    968: {
      slidesPerView: 5,
    },
  },
});

function renderMovieList(cssSelector, list) {
  let html = '';

  for (let i in Object.entries(list)) {
    html += '<div class="box">';
    html += '<div class="box-img">';
    html += '<img src="/images/' + list[i].image2 + '" alt="" />';
    html += '</div>';
    html += '<h3>' + list[i].title + '</h3>';
    html += '<span>' + list[i].duration + ' / ' + list[i].genre + '</span>';
    html += '</div >';
  }

  document.querySelector(cssSelector).innerHTML = html;
  return html;
}

function renderComingMovieList(cssSelector, list) {
  let html = '';
  html += '<div class="coming-container swiper">';
  html += '<div class="swiper-wrapper">';

  for (let i in Object.entries(list)) {
    html += '<div class="swiper-slide box">';
    html += '<div class="box-img">';
    html += '<img src="/images/' + list[i].image2 + '" alt="" />';
    html += '</div>';
    html += '<h3>' + list[i].title + '</h3>';
    html += '<span>' + list[i].duration + ' / ' + list[i].genre + '</span>';
    html += '</div >';
  }

  html += '</div></div>';
  document.querySelector(cssSelector).innerHTML = html;
  return html;
}

async function start() {
  renderMovieList('.active-movies-container', await getData('/api/allActiveMovies'));
  renderMovieList('.coming-movies-container', await getData('/api/allComingMovies'));
}

start();