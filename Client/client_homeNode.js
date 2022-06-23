const config = {
    user: 'admin',
    password: '123',
    server: 'DESKTOP-TA4RQON', // You can use 'localhost\\instance' to connect to named instance
    database: 'Resort_DB',
    port: 1433,
    trustServerCertificate: true
}



async function getClientData(id) {
    const sql = require('mssql')
    const { boolean } = require('webidl-conversions')


    sql.on('error', err => {
        console.log(err.message)
    })

    try {
        let pool = await sql.connect(config)

        // console.log("review")
        client_name = await (await pool.request().query("Select ClientFirstName as fname,ClientLastName as lname from Client where ClientID = "+id)).recordset
        full_name = client_name[0].fname +" "+ client_name[0].lname
        r = await (await pool.request().query("Select RoomNo as RNo from Booking where ClientID = " + id)).recordset
        rooms = []
        for(i = 0;i<r.length;i++){
            rooms[i]=r[i].RNo
        }

        booking_dates = await (await pool.request().query("Select CheckInDate as cin, CheckOutDate as cout from Booking where ClientID = " + id)).recordset
        check_in = booking_dates[0].cin
        check_out = booking_dates[0].cout  
        
        o = await (await pool.request().query("Select ServiceNo as ONo from Orders where ClientID = " + id)).recordset
        services = []
        for (i = 0; i < o.length; i++) {
            services[i] = o[i].ONo
        }
        console.log("Service Length: " + services.length)

        data = {checkin_date:check_in,  checkout_date:check_out,  roomsBooked: rooms, client_name: full_name, servicesOrdered:services}
        console.log(data)
        sql.close()
        return data
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
app.get('/getClientData', (req, res) => {
    (async () => {
        let data = await getClientData(req.query.id)
        // console.log(data)
        res.send(data)
    })()
});

const port = 8080;

app.listen(port, () => {
    console.log(`Server running on port${port}`);
});
