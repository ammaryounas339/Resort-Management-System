window.onload = getData();


function getData(){ 
  $.get("http://localhost:8080/getBookings",
            function (data) {
              var xValues = ["Room1", "Room2", "Room3", "Room4", "Room5","Room6","Room7","Room8","Room9","Room10","Room11","Room12","Room13","Room14","Room15","Room16","Room17"]
              var yValues = [data.r1,data.r2, data.r3, data.r4, data.r5,data.r6,data.r7,data.r8,data.r9,data.r10,data.r11,data.r12,data.r13,data.r14,data.r15,data.r16,data.r17];
            
              
              new Chart("myChart", {
                axisY:{
                  interval:1,
                },
                type: "bar",
                data: {
                  labels: xValues,
                  datasets: [{
                    backgroundColor: "cadetblue",
                    data: yValues
                  }]
                },
                options: {
                  legend: {display: false},
                  scales: {
                    yAxes: [{
                      
                        ticks: {
                          stepSize:1,
                           precision:0,
                            beginAtZero: true
                        }
                    }]
                },
                  title: {
                    display: true,
                    text: "No of Bookings this Month"
                  }
                  
                }
              });
            });
          }




 function getDataRoom(id){ 
              let content  = document.getElementById(id)
            $.get("http://localhost:8080/getRoom?id="+id,
            function (data) 
            {
              if(id){
                if(content.innerHTML == "Room "+id){
                  content.innerHTML= "Status :" + data.rS +"<br>Rating :"+ data.rR;
                }
                else {
                  content.innerHTML = "Room "+id;
                }
               }
              




            })
          }






function toggleEco() {
    document.getElementById("dropdownEco").classList.toggle("show");
  }
  function toggleLux() {
    document.getElementById("dropdownLux").classList.toggle("show");
  }
  function toggleSuite() {
    document.getElementById("dropdownSuite").classList.toggle("show");
  }
  function togglePh() {
    document.getElementById("dropdownPh").classList.toggle("show");
  }
  
  // function graph(){
  //   var xValues = ["Room1", "Room2", "Room3", "Room4", "Room5","Room6","Room7","Room8","Room9","Room10","Room11","Room12","Room13","Room14","Room15","Room16","Room17"]
  //   var yValues = [10,2, 3, 24, 13,14,17,1,3,5,1,6,11,12,17,12,3];
  
    
  //   new Chart("myChart", {
  //     type: "bar",
  //     data: {
  //       labels: xValues,
  //       datasets: [{
  //         backgroundColor: "cadetblue",
  //         data: yValues
  //       }]
  //     },
  //     options: {
  //       legend: {display: false},
  //       title: {
  //         display: true,
  //         text: "No of Bookings this Month"
  //       }
  //     }
  //   });
  // }

  
