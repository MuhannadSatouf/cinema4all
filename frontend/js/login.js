function loginLoad(){


document.querySelector('#loginButton').addEventListener('click',function(){

let userAlias = document.querySelector("#userAlias").value
let password= document.querySelector("#password").value

sendInfo(userAlias,password)


})
   
async function sendInfo(userAlias,password){




console.log(await getData("/api/validateUser/"+ userAlias))

var user = await getData("/api/validateUser/"+ userAlias)

if(user.userAlias==="admin"){

  
//Load the admin page 

}

let userPassword = user.password




if(password===userPassword){

console.log("Correct login")

//Load a new html page
//Use similar code to how we render the movies

}




}

}
