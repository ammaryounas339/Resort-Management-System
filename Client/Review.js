function validate(){
    comments=  document.getElementById("comments").value
    stars=  $('input[name=star]:checked').val()
    if(!comments || !stars){
        document.getElementById("Error-Text").style.display="block"
        return false
    }

    return true
}

function submit_data() {
    if(validate()){

        $.post("http://localhost:8080/submitReview",
            {
                // id: sessionStorage.getItem(id),
                id: sessionStorage.getItem("id"),
                comments: document.getElementById("comments").value,
                stars: $('input[name=star]:checked').val()
            },
            function (data, status) {
                document.getElementById("Review").style.display = "none"
                document.getElementById("Goodbye").style.display="flex";
                setTimeout(() => { window.location.href = "..\\Home\\landing.html" }, 2000);
                
            }
        );


    }


}
