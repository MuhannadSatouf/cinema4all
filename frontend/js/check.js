async function getLogInfo() {
  let div = document.querySelector('.login-link');
  // check if you are logged in
  let loggedIn;
  try {
    loggedIn = await (await fetch('/api/login')).json();
  }
  catch (ignore) { }
  // if not logged in
  if (!loggedIn || loggedIn._error) {
    div.innerHTML = ` <a href="/login">Login</a>`

  }
  // you are logged in
  else {
    console.log("You are logged in");
  }

  // Show the dashboard / start page for logged in users
}

getLogInfo();


// Delegated event listener for logout
document.querySelector('main').addEventListener('click', async (event) => {

  if (!event.target.closest('a[href="/logout"]')) { return; }

  // do not follow the link
  event.preventDefault();

  // log out using our REST-api
  let result;
  try {
    result = await (await fetch('/api/login', { method: 'DELETE' })).json();
  }
  catch (ignore) { }

  document.location.replace('/')
})

