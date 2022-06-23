window.onload = review()

function review(){
    $.get("http://localhost:8080/getReviews",
        {
        },
        function (data, status) {
            // console.log(data.state + "   " + status)
            // window.alert(data.state + "   "+ status)
            for(var i = 0;i<4;i++){
                document.getElementById("Slot "+(i+1)).getElementsByClassName("UserName")[0].innerHTML = data[i].fname + " "+data[i].lname
                document.getElementById("Slot " + (i + 1)).getElementsByClassName("stars")[0].innerHTML = data[i].rating+" Stars"
                document.getElementById("Slot " + (i + 1)).getElementsByClassName("UserReview")[0].innerHTML = data[i].comments
            }
        });
    

}




