window.onload  = loadUser()

function loadUser(){
    document.getElementById("username").innerHTML=sessionStorage.getItem("username")
}