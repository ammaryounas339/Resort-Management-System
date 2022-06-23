window.onload = getData()

function getData(){ 
    $.get("http://localhost:8080/getAdminStats",
              function (data) {
                //   document.getElementById("freeRooms").innerHTML = data.fv;
                //   document.getElementById("bookedRooms").innerHTML = data.bv;
                  document.getElementById("avgRating").innerHTML = data.av;
                  document.getElementById("noOfCustomers").innerHTML = data.btv;
                  document.getElementById("services").innerHTML = data.sv;
                  console.log(data.fv+" "+data.bv)
                  document.getElementById("avgRatingmonth").innerHTML = data.arv;
                  console.log(data.bv)
                  var xValues = ["Free", "Booked"];
                  var yValues = [data.fv,data.bv];
                  var barColors = [
                  "cadetblue",
                  "rgb(238, 226, 226)"
                   ];

                   new Chart("myChart", {
                    type: "pie",
                    data: {
                      labels: xValues,
                      datasets: [{
                        backgroundColor: barColors,
                        data: yValues
                      }]
                    },
                    options: {
                      title: {
                        display: true,
                        text: "No of Free and Booked Rooms"
                      }
                    }
                  });









              });
            }
