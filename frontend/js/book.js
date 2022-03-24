let selectedSeats = [];
let list1 = [];
let total = 0;
let newBooking = null;
let toBuy = [];
const seats = document.querySelectorAll('.row .seat:not(.occupied)');

async function bookAMovie() {

  let movieSelect = await renderOptionList();
  let container = document.querySelector('.container');
  let count = document.getElementById('count');
  let date = document.getElementById('date');



  populateUI();

  // Update count
  function updateSelectedCount() {
    selectedSeats = document.querySelectorAll('.row .seat.selected');

    const seatsIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat));

    localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));

    const selectedSeatsCount = selectedSeats.length;
    count.innerText = selectedSeatsCount;
  }

  // Get data from localstorage and populate UI
  function populateUI() {

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
    // get the list of available places for this movie view
    requestLatestContainerState(e.target.value);

    setMovieData(e.target.selectedIndex, e.target.value);
    updateSelectedCount();
    toBuy = [];
    document.querySelector('.records').innerHTML = "";
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
    scheduleId = arr[0];
    console.log(scheduleId);
    let hallId = arr[1];

    rebuildContainer(hallId, scheduleId);
    newBooking = new BookingHeader(2, scheduleId);

  }

  async function rebuildContainer(hallId, scheduleId) {
    list1 = await getData("/api/places/" + hallId);
    let list2 = await getData("/api/bookedPlaces/" + scheduleId);

    let sits = [];
    for (let item of list2) {
      sits.push(item);
    }

    let html = '';

    html += '<div class="row">';
    for (let j = 0; j < list1.length; j++) {
      let ifOccupied = list2.filter(obj => {
        return obj.placeId === list1[j].id;
      });

      if (ifOccupied.length === 0) {
        html += '<div class="seat" id=' + list1[j].id + '>' + '</div >';
      } else {
        html += '<div class="seat occupied" id=' + list1[j].id + '>' + '</div >';
      }

      if (((j + 1) % 10 == 0) && ((j + 1) != list1.length)) {
        html += '</div >';
        html += '<div class="row">';
      } else if ((j + 1) == list1.length) {
        html += '</div >';
      }
    }

    document.querySelector('.places').innerHTML = html;
  }


}
bookAMovie();
async function continue_() {
  if (toBuy.length > 0) {
    toBuy = [];
  }

  selectedSeats = document.querySelectorAll('.row .seat.selected');
  if (selectedSeats.length > 0) {

    for (let i = 0; i < list1.length; i++) {
      for (let j = 0; j < selectedSeats.length; j++) {
        let value = selectedSeats[j].outerHTML;
        let str = 'id="' + list1[i].id + '"';
        if (value.toString().includes(str)) {
          toBuy.push(list1[i]);
          break;
        }
      }
    }
    renderBooking(toBuy);
  }
}

async function checkout() {
  //console.log(newBooking);
  //let number = await (createHeader(2, scheduleId));
  let tableData = document.getElementById('tab_checkout').getElementsByTagName('th');
  let prices = [];
  for (i = 7; i < tableData.length; i = i + 4) {
    let price = tableData[i].innerText;
    if (price !== null) {
      prices.push(price);
      total = total + parseInt(price);
    }
  }

  let lines = [];
  for (i = 0; i < toBuy.length; i++) {
    //param 1 = number
    let newLine = new BookingLine(2, toBuy[i].id, prices[i], newBooking.scheduleId);
    lines.push(newLine);
  }

  newBooking.lines = lines;
  console.log(newBooking);
  localStorage.setItem('booking', newBooking);
  alert("The booking was successfully added. Total amount to pay is " + total + "kr.");
  document.querySelector('.records').innerHTML = "";
  console.log(selectedSeats);
  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (selectedSeats.indexOf(index) > -1) {
        seat.className.replace('selected', 'occupied');
        //seat.classList.replace('seat selected', 'seat occupied');
      }
    });
  }
}

function getSource(theSelectBox, index) {
  console.log(theSelectBox.options[theSelectBox.selectedIndex].value);
  document.getElementById("tb" + index).textContent = theSelectBox.options[theSelectBox.selectedIndex].value;
}

async function renderBooking(seatsToBuy) {
  let html = "<table id='tab_checkout'>";
  html += `<tr>
      <th>Row</th>
      <th>Seat</th>
      <th>Price</th>
      <th>kr.</th>
    </tr>`;

  let i = 0;

  for (let k = 0; k < seatsToBuy.length; k++) {
    html += `<tr>
        <th>${seatsToBuy[k].row}</th>
        <th>${seatsToBuy[k].seat}</th>
        <th><select id="drop${k}" onchange="getSource(this, ${k})"> 
        <option value="85">adult</option>
        <option value="65">child</option>
        <option value="75">senior</option>
        </select>
        </th>
        <th class="price" id="tb${k}">85</th>
      </tr>`;
    i++;
  }
  html += '</table>';
  html += '<button class="checkout_btn" onClick="checkout()">Check out</button> ';

  i = 0;

  document.querySelector('.records').innerHTML = html;

  return document.querySelector('.records');
}