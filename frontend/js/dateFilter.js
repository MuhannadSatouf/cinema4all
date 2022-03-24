async function filter() {
  let date = document.querySelector('input[type="date"]');
  let list = await getData("/api/scheduleFilter");
  console.log(date.value);

  let filtered = list.filter(function (e) {
    return e.date == date.value;
  });
  if (filtered.length > 0) {
    drawTable(filtered);
  } else {
    document.querySelector('.filtered_schedule').innerHTML = `<p>
      The are no shows planned for this date
    </p>`;
  }

}

async function drawTable(filteredList) {
  let html = "<table>";
  html += `<tr>
      <th>Time</th>
      <th>Title</th>
      <th>Duration</th>
      <th>Hall</th>
    </tr>`;

  for (let k = 0; k < filteredList.length; k++) {
    html += `<tr>
        <td>${filteredList[k].time}</td>
        <td>${filteredList[k].title}</td>
        <td>${filteredList[k].duration}</td>
        <td>${filteredList[k].hallName}</td>
      </tr>`;
  }
  html += '</table>';
  document.querySelector('.filtered_schedule').innerHTML = html;
}