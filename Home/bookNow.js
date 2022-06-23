
function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}


window.onload = getRoomData()

let rooms


function roomType(type){
    console.log(rooms)
    if(rooms[type-1]==0){
        document.getElementById("RoomQuantity").style.display="none"
        document.getElementById("RoomUnavailable").style.display = "inline"
    }
    else{
        document.getElementById("RoomQuantity").style.display = "inline"
        document.getElementById("RoomUnavailable").style.display = "none"
        for (i = 1; i < 9; i++) {
            document.getElementById("Option " + i).style.display = "block"
        }
        for (i = rooms[type - 1] + 1; i < 9; i++) {
            // console.log(i)
            document.getElementById("Option " + i).style.display = "none"
        }
    }
    
}

function getRoomData(){
    $.get("http://localhost:8080/getRooms",
        function (data) {
            rooms = data;
        });
}


function validate(){
    document.getElementById("InvalidErrorText").style.display = "none"
    document.getElementById("IncompleteErrorText").style.display = "none"
    document.getElementById("InvalidCheckInDate").style.display = "none"
    document.getElementById("InvalidCheckOutDate").style.display = "none"
    first_name=  document.getElementById("FName").value
    last_name = document.getElementById("LName").value
    gender=  $('input[name=Gender]:checked').val()
    email=  document.getElementById("Email").value
    phone=  document.getElementById("PhoneNo.").value
    checkin=  document.getElementById("CheckIn").value
    checkout= document.getElementById("CheckOut").value
    c1 = new Date(checkin)
    c2 = new Date(checkout)
    current = new Date()
    current.setHours(0,0,0,0)
    room_type=  $('input[name=roomType]:checked').val()
    room_quantity= $('#RoomQty').val()
    lst = [first_name,last_name,gender,email,phone,checkin,checkout,room_type,room_quantity]
    for(i = 0;i<lst.length;i++){
        if(!lst[i]){
            document.getElementById("IncompleteErrorText").style.display = "block"
            return false
        }
    }

    let err = false;
    if(!validateEmail(email)){
        err = true
    }
    if(phone.length>13 || phone.length<11){
        err = true;
    }

    if(c1<current){
        err = true
        document.getElementById("InvalidCheckInDate").style.display = "inline"
    }
    else if(c2<=c1){
        err = true
        document.getElementById("InvalidCheckOutDate").style.display = "inline"
    }

    if(err){
        document.getElementById("InvalidErrorText").style.display="block"
        return false
    }
    return true
    
}

function submit() {

    // let first_name = document.getElementById("FName").value
    // let last_name =  document.getElementById("LName").value
    // let gender = $('input[name=Gender]:checked').val()

    // window.alert(first_name+ " : "+last_name + " : " +gender)

    if(validate()){
        $.post("http://localhost:8080/bookData",
            {
                first_name : document.getElementById("FName").value,
                last_name: document.getElementById("LName").value,
                gender: $('input[name=Gender]:checked').val(),
                email: document.getElementById("Email").value,
                phone: document.getElementById("PhoneNo.").value,
                checkin: document.getElementById("CheckIn").value,
                checkout: document.getElementById("CheckOut").value,
                room_type: $('input[name=roomType]:checked').val(),
                room_quantity: $('#RoomQty').val()
            },
            function (data, status) {
                // console.log(data.state + "   " + status)
                // window.alert(data.state + "   "+ status)
                sessionStorage.setItem("username",data.username)
                sessionStorage.setItem("id",data.id)
                window.location.href="confirmBooking.html"
            });
    }


}




