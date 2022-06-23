// const config = {
//     user: 'admin',
//     password: '123',
//     server: 'DESKTOP-TA4RQON', // You can use 'localhost\\instance' to connect to named instance
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




  



async function bookService(SNo,ClientId) {
    const sql = require('mssql')
    const { boolean } = require('webidl-conversions')


    sql.on('error', err => {
        console.log(err.message)
    })

    try {
        let pool = await sql.connect(config)
        console.log("Insert into Orders values ("+ClientId+"  ,"+ SNo+")")

        await pool.request().query("Insert into Orders values ("+ClientId+"  ,"+ SNo+")")

        
        sql.close()
    } catch (err) {
        console.log(err.message)
        sql.close()
    }
}

async function bookFood(ClientId,people) {
    const sql = require('mssql')
    const { boolean } = require('webidl-conversions')


    sql.on('error', err => {
        console.log(err.message)
    })

    try {
        let pool = await sql.connect(config)
       // console.log("Insert into FoodReservation values ("+ClientId+"  ,Default, "+ people+")")

        await pool.request().query("Insert into FoodReservation values ("+ClientId+"  ,Default, "+ people+")")

        
        sql.close()
    } catch (err) {
        console.log(err.message)
        sql.close()
    }
}

async function RefreshStats(id) {
    const sql = require('mssql')
    const { boolean } = require('webidl-conversions')


    sql.on('error', err => {
        console.log(err.message)
    })

    try {
        Tennis=false
        Bowling=false
        Cinema= false
        Food=false

        let pool = await sql.connect(config)
         Service =await (await pool.request().query("Select ServiceNo as SNo from Orders where ClientId="+id)).recordset
         for ( i=0; i<Service.length; i++){
             s=Service[i].SNo
             if(s==1){
                 Tennis  = true
             }
             else if(s==2){
                 Bowling = true
             }
             else if(s==3){
                 Cinema = true
             }
         }
        f =  await (await pool.request().query("select ClientID from FoodReservation where ClientID="+id)).recordset
        if(f.length==1){
            Food=true
        }

            Data= {
               t:Tennis,
               b:Bowling,
               c:Cinema,
               f:Food
             }

        
        sql.close()
        return Data
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
app.post('/bookService', (req, res) => {
    (async () => {
        console.log("SNO: "+req.body.SNo)
        await bookService(req.body.serviceNo, req.body.ClientId)
        // console.log(data)
    })()
});

app.post('/bookFood', (req, res) => {
    (async () => {
        await bookFood(req.body.ClientId,req.body.Food)
        // console.log(data)
    })()
});

app.get('/RefreshStats', (req, res) => {
    (async () => {
        let data  = await RefreshStats(req.query.id)
        res.send(data)
        // console.log(data)
    })()
});
const port = 8080;

app.listen(port, () => {
    console.log(`Server running on port${port}`);
});
