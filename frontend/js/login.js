function renderLoginForm(retry = false) {
  return `<link rel="stylesheet" href="../css/login.css" />
    <form name="login">
      <button onclick="document.getElementById('LoginBox').style.display='block'" style="width:auto;">Login</button>

    <div id="LoginBox" class="modal">

     <div class="modal-content animate">
      <div class="imgcontainer">
        <span onclick="document.getElementById('LoginBox').style.display='none'" class="close"
          title="Close Modal">&times;</span>

      </div>

      <div class="container">
     <label>  
        <span <b>Username</b></span>
        <input id="userAlias"type="text" placeholder="Enter Username" name="uname" required>
     </label>
     <label>
        <span><b>Password</b></span>
        <input id="password"type="password" placeholder="Enter Password" name="psw" required>
      </label>
        <button  id="loginButton" type="submit">Login</button>

      </div>

      <div type="submit" class="container" style="background: color #000;">
        <button id='cancelButton'type="submit" onclick="document.getElementById('LoginBox').style.display='none'&& document.location.replace('/')"
          class="cancelbtn">Cancel</button>
        </div>
     </div>
 </form>
  `;
}

// Add a delegated event listener for submitting the form
document.querySelector('body').addEventListener('submit', async (event) => {

  // the target is the actual thing clicked/submitted
  let target = event.target;

  // uses closest to th see if the target or any of its parents
  // matches the form we want to work with (otherwise do nohting)
  if (!target.closest('form[name="login"]')) { return; }

  event.preventDefault();

  // For comments on this logic see register.js
  let formElements = document.forms.login.elements;
  let requestBody = {
  }
  for (let element of formElements) {
    if (element.type === 'submit') { continue; }

    requestBody = Object.assign(requestBody, { [element.name]: element.value })

    console.log({ [element.name]: element.value })

  }





  // Try to login
  let result;

  try {
    console.log(requestBody)
    result = await (await fetch('/api/login', {
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

  // Succesfully logged in, reload the page
  console.log("Logged In")

});

// Add a delegated event listener för showing the form 
// when we click the Login link
document.querySelector('body').addEventListener('click', (event) => {

  // Do nothing if the link wasn't clicked
  if (!event.target.closest('a[href="/login"]')) { return; }

  // Prevent following the link (reloading the page)
  event.preventDefault();

  // Render the login form and show it
  let loginDiv = document.querySelector('.login');
  loginDiv.innerHTML = renderLoginForm();
  loginDiv.classList.remove('hidden');
  document.querySelector('.modal-hider').classList.remove('hidden');
});

// This is useful for both login and registration
// - we will hide whatever form/"modal" that is shown
// when you click outside outside - i.e. click on the modal-hider
document.querySelector('body').addEventListener('click', (event) => {
  if (!event.target.closest('.modal-hider')) { return; }
  let elementsToHide = document.querySelectorAll('.login, .modal-hider');
  for (element of elementsToHide) {
    element.classList.add('hidden');
  }

});