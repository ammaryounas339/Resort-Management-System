// const config = {
//   user: 'admin1',
//   password: '123',
//   server: 'DESKTOP-IO2BR35',
//   database: 'Resort_DB',
//   port: 1433,
//   trustServerCertificate: true
// }

const config = {
  user: 'admin',
  password: '123',
  server: 'DESKTOP-TA4RQON', // You can use 'localhost\\instance' to connect to named instance
  database: 'Resort_DB',
  port: 1433,
  trustServerCertificate: true
}



// const http = require('http');
// const { result } = require('lodash');
// const sql = require('mssql');

// //html string that will be send to browser
// var reo = '<html><head><title>Node.js MySQL Select</title></head><body><h1>Node.js MySQL Select</h1>{${table}}</body></html>';

// async function setResHtml(sql, cb) {
//   sql.on('error', err => {
//     console.log(err.message)
//   })

//   try {
//     let pool = await sql.connect(config)
//     let result = await pool.request().query('Select * from Client  ')

    // let table = ''; //to store html table
    // table = '<table border="1"><tr><th>Nr.</th><th>ID</th><th>FirstName</th><th>LastName</th><th>PhoneNo</th><th>Gender</th>+<th>Email</th></tr></table>';
    // //create html table with data from res.
    // console.log(result.recordset[0].ClientID)
    // for (var i = 0; i < result.recordsets.length; i++) {
    //   // console.log(result.recordsets)
    //   table +='<tr><td>'+ (i+1) +'</td><td>'+ result.recordset[i].ClientID +'</td><td>'+ result.recordset[i].ClientFirstName +'</td><td>'+ result.recordset[i].ClientLastName +'</td><td>'+ result.recordset[i].PhoneNo +'</td><td>'+ result.recordset[i].Gender +'</td><td>'+ result.recordset[i].Email +'</td></tr>';

    // }
//     // console.log(table)
//     sql.close()
//        return cb(table);

//   } catch (err) {
//     console.log("Error: "+err.message)
//     sql.close()
//   }
// }







// //create the server for browser access
// const server = http.createServer((req, res) => {
//   setResHtml(sql, resql => {
//    reo = reo.replace('{${table}}', resql);
//     res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
//     res.write(reo, 'utf-8');
//     res.end();
//   });
// });

// server.listen(8080, () => {
//   console.log('Server running at //localhost:8080/');
// });

// async function getUsers(){
//   const config = {
//   user: 'admin1',
//   password: '123',
//   server: 'DESKTOP-IO2BR35', // You can use 'localhost\\instance' to connect to named instance
//   database: 'Resort_DB',
//   port:1433,
//   trustServerCertificate: true
// }

//   const { result } = require('lodash');
//   const sql = require('mssql')
  
      
//   sql.on('error', err => {
//       console.log(err.message)
//   })
 

//   try {
     
//       let pool = await sql.connect(config)
     
//     //  let insertion = await pool.request().query("Insert into Users values("+x+",'password','Guy68')")
//       let result = await pool.request().query('Select * from Client ')
//       console.log(result)
//       sql.close()
//   }catch(err){
//       console.log(err.message)
//       sql.close()

//   }

// }


// getUsers();

async function getUsers() {
  const sql = require('mssql')
  const { boolean } = require('webidl-conversions')


  sql.on('error', err => {
      console.log(err.message)
  })

  try {
      let pool = await sql.connect(config)

      result = await pool.request().query('Select * from Client')
      
      sql.close()
      return result
  } catch (err) {
      console.log(err.message)
      sql.close()
  }
}

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var cors = require('cors')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.get('/getUsers', (req, res) => {
    (async () => {
        let result = await getUsers()
        console.log(result + " 5543")
        let table = ''; //to store html table
        table = '<table id="table-decoration"><tr class = "tablerows"><th class="tableheader">#</th><th class="tableheader">ID</th><th class="tableheader">FirstName</th><th class="tableheader">LastName</th><th class="tableheader">PhoneNo</th><th class="tableheader">Gender</th><th class="tableheader">Email</th></tr>';

        //create html table with data from res.
        for (var i = 0; i < result.recordset.length; i++) {
          // console.log(result.recordsets)
          table +='<tr  class="tablerows"><td class="tablecell">'+ (i+1) +'</td><td class="tablecell">'+ result.recordset[i].ClientID +'</td><td class="tablecell">'+ result.recordset[i].ClientFirstName +'</td><td class="tablecell">'+ result.recordset[i].ClientLastName +'</td><td class="tablecell">'+ result.recordset[i].PhoneNo +'</td><td class="tablecell">'+ result.recordset[i].Gender +'</td><td class="tablecell">'+ result.recordset[i].Email +'</td></tr>';

        }

        table+="</table>"


          res.send(table)
      })()
});

 


const port = 8080;

app.listen(port, () => {
    console.log(`Server running on port${port}`);
});





//id = "'+result.recordset[i].ClientID+'"