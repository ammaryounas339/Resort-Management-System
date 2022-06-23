window.onload=RefreshStats()


function bookService(SNo) {
        $.post("http://localhost:8080/bookService",
            {
                serviceNo: SNo,  ClientId: sessionStorage.getItem("id")
                
            },
            function (data, status) {
            });
    window.location.reload()


}

function bookFood(){
    people = document.getElementById("quantity").value;
    if(people>0){
    $.post("http://localhost:8080/bookFood",
            {
                Food: people, ClientId: sessionStorage.getItem("id")
            },
            function (data, status) {
            });
        window.location.reload()
    }
    else{
        document.getElementById("People-Error").style.display="inline-block"
    }
}

function RefreshStats( ){

    document.getElementById("People-Error").style.display = "none"
    $.get("http://localhost:8080/refreshStats?id=" + sessionStorage.getItem("id"),
        function (data) {
           if(data.t){
            document.getElementById("TennisBookButton").style.display="none"
            document.getElementById("TennisBooked").style.display="inline-block"
           }

         if(data.b){
            document.getElementById("BowlingBookButton").style.display="none" 
            document.getElementById("BowlingBooked").style.display="inline-block"  
        }
        if(data.c){
            document.getElementById("MovieBookButton").style.display="none"
            document.getElementById("MovieBooked").style.display="inline-block"
        }
        if(data.f){
            document.getElementById("FoodBookButton").style.display="none"
            document.getElementById("FoodBooked").style.display="inline-block"
        }
        });

}

