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

/* <div class="movies-container">
      <!--Box1 -->
      <div class="box">
        <div class="box-img">
          <img src="/images/spider-man_portr.jpeg" alt="" />
        </div>
        <h3>Spider Man</h3>
        <span>130 min / Action </span>
      </div>*/


function renderMovieList(cssSelector, list) {
  let html = '';

  for (let item in Object.entries(list)) {
    console.log(list[item].title);

    html += '<div class="box">';
    html += '<div class="box-img">';
    html += '<img src="/images/' + list[item].image2 + '" alt="" />';
    html += '</div>';
    html += '<h3>' + list[item].title + '</h3>';
    html += '<span>' + list[item].duration + ' / ' + list[item].genre + '</span>';
    html += '</div >';
  }
  document.querySelector(cssSelector).innerHTML = html;
  return html;
}

function renderComingMovieList(cssSelector, list) {
  let html = '';
  html += '<div class="coming-container swiper">';
  html += '<div class="swiper-wrapper">';

  for (let item in Object.entries(list)) {
    console.log(list[item].title);

    html += '<div class="swiper-slide box">';
    html += '<div class="box-img">';
    html += '<img src="/images/' + list[item].image2 + '" alt="" />';
    html += '</div>';
    html += '<h3>' + list[item].title + '</h3>';
    html += '<span>' + list[item].duration + ' / ' + list[item].genre + '</span>';
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
/*
function generateCommonInfo(html, Object) {
  html += '<div class="box-img">';
  html += '<img src="/images/' + Object.image2 + '" alt="" />';
  html += '</div>';
  html += '<h3>' + Object.title + '</h3>';
  html += '<span>' + Object.duration + ' / ' + Object.genre + '</span>';
  return html;
}*/

start();