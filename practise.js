



const form  = document.querySelector("form");
const username = document.querySelector("input[type=text]")
const email = document.querySelector("input[type=email]")
const password = document.querySelector("input[type=password]")




form.addEventListener("submit",(e)=>{
  e.preventDefault();
  console.log(username.value)
  console.log(email.value)
  console.log(password.value)
  form.reset()
})