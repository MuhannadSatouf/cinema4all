async function getData(restRoute) {
  let rawData = await fetch(restRoute);
  let result = {};
  result = await rawData.json();
  return result;
}

//returns the header object with id in it
async function getHeader(userId, scheduleId) {
  let object = await getData("/api/bookingHeader/" + userId + '/' + scheduleId);
  console.log("object id: " + object.id);
  return object;
}

async function postHeader(header) {

}



async function createHeader(userId, scheduleId) {
  const header = new BookingHeader(userId, scheduleId);
  //put record in the DB
  postHeader(header);

  //get the latest header with auto ID for this user and schedule
  return await getHeader(header.userId, header.scheduleId)
}