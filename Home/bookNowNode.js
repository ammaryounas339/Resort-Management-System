const config = {
    user: 'admin',
    password: '123',
    server: 'DESKTOP-TA4RQON', // You can use 'localhost\\instance' to connect to named instance
    database: 'Resort_DB',
    port: 1433,
    trustServerCertificate: true
}



async function getRooms() {
    const sql = require('mssql')
    const { boolean } = require('webidl-conversions')


    sql.on('error', err => {
        console.log(err.message)
    })

    try {
        let pool = await sql.connect(config)        
        floor1 = (await pool.request().query("Select Count(RoomState) as Num from Room  where RoomState = 0 and RoomFloor = 1")).recordsets[0][0].Num
        floor2 = (await pool.request().query("Select Count(RoomState) as Num from Room  where RoomState = 0 and RoomFloor = 2")).recordsets[0][0].Num
        floor3 = (await pool.request().query("Select Count(RoomState) as Num from Room  where RoomState = 0 and RoomFloor = 3")).recordsets[0][0].Num
        floor4 = (await pool.request().query("Select Count(RoomState) as Num from Room  where RoomState = 0 and RoomFloor = 4")).recordsets[0][0].Num
        sql.close()
        return [floor1,floor2,floor3,floor4]
    } catch (err) {
        console.log(err.message)
        sql.close()
    }
}





async function postClient(fname, lname, gender,email,phone,checkin,checkout,room_type,room_quantity) {
    const sql = require('mssql')
    const { boolean } = require('webidl-conversions')


    sql.on('error', err => {
        console.log(err.message)
    })

    try {
        let pool = await sql.connect(config)
        clientID = (await pool.request().query('Select Max(ClientId) as ID from Client')).recordsets[0][0].ID + 1
        console.log("Client ID: "+clientID)
        let UserName = fname+clientID
        r = await pool.request().query('Insert into Users values(' + clientID + ", 'password', '" + UserName + "')")
        r = await pool.request().query("Insert into Client "
            + "values(" + clientID + ", '" + fname + "', '" + lname + "', '" + phone + "', '" + gender + "', '" + email + "', 1)")
        rooms = (await pool.request().query("Select RoomNo as RNo from Room where RoomState = 0 and RoomFloor = "+room_type)).recordset
        console.log(UserName)
        for(i = 0;i<room_quantity;i++){
            r = await pool.request().query("Insert into Booking "
                +"values("+clientID+", "+rooms[i].RNo+", '"+checkin+"', '"+checkout+"')")
            r = await pool.request().query("Update Room set RoomState = 1 where RoomNo = "+rooms[i].RNo)
        }
        sql.close()
        return {username: UserName,id:clientID}
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
app.get('/getRooms', (req, res) => {
    (async () => {
        let data = await getRooms()
        res.send(data)
    })()
});

app.post('/bookData', (req, res) => {
    (async () => {
        let result = await postClient(req.body.first_name,
            req.body.last_name, req.body.gender, req.body.email,
            req.body.phone, req.body.checkin, req.body.checkout,
            req.body.room_type, req.body.room_quantity)
        res.send(result)
        console.log(req.body)
    })()
});
const port = 8080;

app.listen(port, () => {
    console.log(`Server running on port${port}`);
});





