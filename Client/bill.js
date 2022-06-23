window.onload = getBillInfo()
function displayBill()
{
    document.getElementById("Bill").style.display="block";
    document.getElementById("checkout").style.display="none";
}
function getBillInfo() { 
    $.get("http://localhost:8080/getBillData?id=" + sessionStorage.getItem("id"),
    {
    },
    function (data, status) {


        document.getElementById("BillName").innerHTML = data.client_name
        document.getElementById("BillNo").innerHTML = data.billno
        document.getElementById("Accomodation").innerHTML = "$"+(Math.round(data.accomodation * 100) / 100).toFixed(2);


        cin_date = new Date(data.check_in)
        c1 = cin_date.getDate() + "-" + (cin_date.getMonth() + 1) + "-" + cin_date.getFullYear()
        cout_date = new Date(data.check_out)
        c2 = cout_date.getDate() + "-" + (cout_date.getMonth() + 1) + "-" + cout_date.getFullYear() 


        
        document.getElementById("CheckInDate").innerHTML = c1
        document.getElementById("CheckOutDate").innerHTML = c2

        document.getElementById("RoomPrice").innerHTML = "$" +data.room_price

        document.getElementById("RoomsBooked").innerHTML = data.rBooked
        r = data.roomsNo
            rooms = r[0]
            for(i = 1;i<r.length;i++){
                rooms+=r[i]+", "
            }

        document.getElementById("RoomNo").innerHTML = rooms
        document.getElementById("Food").innerHTML = "$" +data.sFood
        document.getElementById("Tennis").innerHTML = "$" +data.sTennis
        document.getElementById("Bowling").innerHTML = "$" +data.sBowling
        document.getElementById("Movies").innerHTML = "$" +data.sCinema
        document.getElementById("RoomType").innerHTML = data.roomFloor

        amount = parseFloat(data.sFood) + parseFloat(data.sTennis) + parseFloat(data.sBowling) + parseFloat(data.sCinema) + parseFloat(data.accomodation)
        document.getElementById("BillAmount").innerHTML ="$" + (Math.round(amount * 100) / 100).toFixed(2)

    });

}
