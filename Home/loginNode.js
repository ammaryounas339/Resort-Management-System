// const config = {
//     user: 'mishal',
//     password: '123',
//     server: 'LAPTOP-3V03CSAF', // You can use 'localhost\\instance' to connect to named instance
//     database: 'Resort_DB',
//     port: 1433,
//     trustServerCertificate: true
// }

const config = {
    user: 'admin1',
    password: '123',
    server: 'DESKTOP-IO2BR35',
    database: 'Resort_DB',
    port: 1433,
    trustServerCertificate: true
  }




async function checkUser(name, pass, radio) {
    const sql = require('mssql')
    const { boolean } = require('webidl-conversions')


    sql.on('error', err => {
        console.log(err.message)
    })

    try {
        console.log("checkUser: "+name+" : "+pass+" : "+radio)
        let pool = await sql.connect(config)
        let result
        if(radio=='true'){
            console.log("client")
            result = await pool.request().query('Select UserName,Pass from Users inner join Client on Users.UserID = Client.ClientID' +
                " where UserName = '" + name + "' and Pass = '" + pass + "' and ClientStatus = 1")
        }
        else{
            console.log("admin")
            result = await pool.request().query('Select UserName,Pass from Users inner join Admin on Users.UserID = Admin.AdminID' +
                " where UserName = '" + name + "' and Pass = '" + pass + "'")
        }
        id = await (await pool.request().query('Select UserID as id from Users where UserName = '+name)).recordset[0].id
        var flag = false
        console.log(result.recordsets[0][0].UserName)
        if (result.recordsets[0].length != 0) {
            var flag = true
        }
        sql.close()
        return {flag:flag,id:id}
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
app.post('/checkUser', (req, res) => {
    (async () => {
        let result = await checkUser(req.body.username, req.body.password,req.body.radio)
        res.send({state:result.flag,id:result.id})
    })()
});

const port = 8080;

app.listen(port, () => {
    console.log(`Server running on port${port}`);
});





