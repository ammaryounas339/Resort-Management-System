window.onload = getData()
function getData(){ 
  $.get("http://localhost:8080/getUsers",
            function (data) {
                document.getElementById("table").innerHTML = data;
               // console.log(data)
            });
}

// function search(){
// let input = document.getElementById("search").value;

//  let tab = document.getElementById("table-decoration");
//  var  tr = tab.getElementsByClassName('tablerows');
//  for(var i = 0; i < tr.length; i++){
//    var td = tr[i].getElementsByClassName('tablecell')[1];
//    let txtValue =td.innerText;
//     if (input != txtValue) {
//       tr[i].style.display = "none";
      
//     } else {
//       tr[i].style.display = "block";
//     }

//   }    
// }
function search(){
  let filter = document.getElementById('myInput').value.toUpperCase();
  let myTable = document.getElementById('table-decoration');
  let tr = myTable.getElementsByTagName('tr');
  for(var i = 0;i<tr.length;i++){
     let td = tr[i].getElementsByTagName('td')[2];
     if(td){
       let textValue= td.textContent || td.innerHTML
       if(textValue.toUpperCase().indexOf(filter) > -1){
          tr[i].style.display = "";
       }
       else{
         tr[i].style.display = "none";
       }
     }
  }
}

 
