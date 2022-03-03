//const container = document.querySelector('.container');
//const seats = document.querySelectorAll('.row .seat:not(.occupied)');



async function bookAMovie() {
  let movieSelect = await renderOptionList();
  let container = document.querySelector('.container');
  let seats = document.querySelectorAll('.row .seat:not(.occupied)');
  let count = document.getElementById('count');
  let total = document.getElementById('total');

  populateUI();

  let ticketPrice = +movieSelect.value;

  // Save selected movie index and price
  function setMovieData(movieIndex, moviePrice) {
    localStorage.setItem('selectedMovieIndex', movieIndex);
    localStorage.setItem('selectedMoviePrice', moviePrice);
  }

  // Update total and count
  function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');

    const seatsIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat));

    localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));

    const selectedSeatsCount = selectedSeats.length;

    count.innerText = selectedSeatsCount;
    total.innerText = selectedSeatsCount * ticketPrice;

    setMovieData(movieSelect.selectedIndex, movieSelect.value);
  }

  // Get data from localstorage and populate UI
  function populateUI() {
    // renderOptionList();

    movieSelect = document.getElementById('movie');

    const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));

    if (selectedSeats !== null && selectedSeats.length > 0) {
      seats.forEach((seat, index) => {
        if (selectedSeats.indexOf(index) > -1) {
          seat.classList.add('selected');
        }
      });
    }

    const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');

    if (selectedMovieIndex !== null) {
      movieSelect.selectedIndex = selectedMovieIndex;
    }
  }

  // Movie select event
  movieSelect.addEventListener('change', e => {
    // ticketPrice = +e.target.value;
    console.log(e.target.value); // the schedule ID
    // get the list of available places for this movie view
    requestLatestContainerState(e.target.value);


    setMovieData(e.target.selectedIndex, e.target.value);
    //updateSelectedCount();
    console.log(e.target.innerText);
  });

  // Seat click event
  container.addEventListener('click', e => {
    if (
      e.target.classList.contains('seat') &&
      !e.target.classList.contains('occupied')
    ) {
      e.target.classList.toggle('selected');

      updateSelectedCount();
    }
  });

  // Initial count and total set
  updateSelectedCount();

  async function renderOptionList() {
    let list = await getData("/api/scheduleFilter");
    let html = "";
    html += '<label>Make your choice:</label>';
    html += '<select name = "drop" id="movie">';
    let i = 0;

    for (let option of list) {
      if (i === 0) {
        html += '<option selected value="';
      } else {
        html += '<option value="';
      }

      html += option.scheduleId + '.' + option.hallId + '">';   // merge two id's together for splitting them later
      html += option.title + ' ' + option.date + ' ' + option.time;
      html += '</option>';
      i++;
    }
    html += '</select>';

    i = 0;

    document.querySelector('.movie-container').innerHTML = html;

    return document.querySelector('.movie-container').querySelectorAll('option');
  }

  async function requestLatestContainerState(scheduleHall) {
    let arr = scheduleHall.split(".")
    let scheduleId = arr[0];
    let hallId = arr[1];

    rebuildContainer(hallId);
    let list2 = await getData("/api/bookedPlaces/" + scheduleId);
    // console.log();
    /* let sits = [];
     for (let item of list) {
       if (item.hallId == hallId) {
         console.log(item);
         sits.push(item);
       }
     }*/

  }

  async function rebuildContainer(hallId) {
    let list1 = await getData("/api/places/" + hallId);
    console.log(list1);
    let html = '';

    html += '<div class="row">';
    for (let j = 0; j < list1.length; j++) {
      html += '<div class="seat" id=' + list1[j].id + '>' + list1[j].placement + '</div >';
      if (((j + 1) % 10 == 0) && ((j + 1) != list1.length)) {
        html += '</div >';
        html += '<div class="row">';
      } else if ((j + 1) == list1.length) {
        html += '</div >';
      }
    }


    console.log(html);
    document.querySelector('.places').innerHTML = html;

    /*    <div class="row">
          <div class="seat" id=22>A1</div>
          <div class="seat"></div>
          <div class="seat"></div>
          <div class="seat"></div>
          <div class="seat"></div>
          <div class="seat"></div>
          <div class="seat"></div>
          <div class="seat"></div>
          <div class="seat"></div>
          <div class="seat"></div>
        </div>
        let html = '';
    
        let row = listOfSits[0].row;
    
        while (j < 3) {
          if ()
            html += '<div class="row">';
    
          for (let seat of listOfSits) {
            if (seat.scheduleId == null) {
              html += '<div class="seat">' + seat.row + seat.seat + '</div>';
            } else {
              html += '<div class="seat occupied">' + seat.row + seat.seat + '</div>';
            }
          }
    
          html += '</div >';
          j++;
        }*/
  }

}
bookAMovie();