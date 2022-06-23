
window.onload = getClientData()

function getClientData(){
    $.get("http://localhost:8080/getClientData?id="+sessionStorage.getItem("id"),
        {
        },
        function (data, status) {
            // console.log(data.state + "   " + status)
            // window.alert(data.state + "   "+ status)
            document.getElementById("ClientName").innerHTML = data.client_name
            r = data.roomsBooked
            rooms = "#"+r[0]
            for(i = 1;i<r.length;i++){
                rooms+=", #"+r[i]
            }

            s = data.servicesOrdered
            services = ""
            if(s.length == 0) services = "None"
            else{
                for (i = 0; i < s.length; i++) {
                    var temp = s[i]
                    if(temp == 1){
                        services += "Tennis, "
                    }
                    else if(temp ==2){
                        services += "Bowling, "
                    }
                    else if (temp == 3) {
                        services += "Cinema, "
                    }
                    else{
                        services += "Food, "
                    }
                }
                services = services.substring(0,services.length-2)
            }
            document.getElementById("Rooms").innerHTML = rooms
            document.getElementById("Services").innerHTML = services
            cin_date = new Date(data.checkin_date)
            c1 = cin_date.getDate() + "-"+ (cin_date.getMonth()+1) + "-" + cin_date.getFullYear() 
            cout_date = new Date(data.checkout_date)
            c2 = cout_date.getDate() + "-"+(cout_date.getMonth()+1) + "-" + cout_date.getFullYear() 
            document.getElementById("Booking-Start").innerHTML = c1
            document.getElementById("Booking-End").innerHTML = c2

        });
}