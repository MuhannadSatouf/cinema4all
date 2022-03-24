async function getData(restRoute) {
  let rawData = await fetch(restRoute);
  let result = {};
  result = await rawData.json();
  return result;
}

//returns the header object with id in it
async function getHeader(userId, scheduleId) {
  let object = await fetch("/api/bookingHeader/?userId=" + userId + '&scheduleId=' + scheduleId);

  console.log("object id: " + object.id);
  return object;
}

async function postHeader(header) {
  let requestBody = {
  }
  /*for (let element of header) {
    if (element.type === 'submit') { continue; }

    requestBody = Object.assign(requestBody, { [element.name]: element.value })

    console.log({ [element.name]: element.value })

  }*/

  let result;

  try {
    console.log(requestBody)
    result = await (await fetch('/api/bookingHeader', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })).json()
    console.log(result)
  }
  catch (ignore) { }

  // React on incorrect login or any other error
  if (!result || result._error) {
    document.querySelector('.login').innerHTML = renderLoginForm(true);
    return;
  }
}



async function createHeader(userId, scheduleId) {
  const header = new BookingHeader(userId, scheduleId);
  //put record in the DB
  // postHeader(header);

  //get the latest header with auto ID for this user and schedule
  return await getHeader(header.userId, header.scheduleId)
}