// const config = {
//     user: 'admin',
//     password: '123',
//     server: 'DESKTOP-TA4RQON', // You can use 'localhost\\instance' to connect to named instance
//     database: 'Resort_DB',
//     port: 1433,
//     trustServerCertificate: true
// }

//  const config = {
//     user: 'mishal',
//     password: '123',
//     server: 'LAPTOP-3V03CSAF', // You can use 'localhost\\instance' to connect to named instance
//     database: 'Resort_DB',
//     port: 1433,
//     trustServerCertificate: true
//  }

 const config = {
    user: 'admin1',
    password: '123',
    server: 'DESKTOP-IO2BR35',
    database: 'Resort_DB',
    port: 1433,
    trustServerCertificate: true
  }


async function getBillInfo(id) {
    const sql = require('mssql')
    const { boolean } = require('webidl-conversions')


    sql.on('error', err => {
        console.log(err.message)
    })

    try {
        let pool = await sql.connect(config)
        let result

        console.log("Yay")
        billno = (await pool.request().query("Select Max(BillNo) as BNo from Bill ")).recordset[0].BNo
        console.log(billno)
        billno += 1
        console.log(billno)

        cname = (await pool.request().query("Select ClientFirstName as fname,ClientLastName as lname from Client where ClientID = " + id)).recordset[0]
        full_name = cname.fname + " " + cname.lname

        // console.log("review")
        rooms_booked = (await pool.request().query("Select count(RoomNo) as totalRooms from Booking where ClientID = " + id)).recordset[0].totalRooms
        r = await (await pool.request().query("Select RoomNo as RNo from Booking where ClientID = " + id)).recordset
        rooms = []
        for (i = 0; i < r.length; i++) {
            rooms[i] = r[i].RNo
        }
        console.log(rooms)
        room_floor = await (await pool.request().query("SELECT r.RoomFloor as roomFloor from Client as c inner join Booking as b on c.ClientId=b.ClientId inner join Room as r on b.RoomNo=r.RoomNo where c.ClientId = " + id)).recordset[0].roomFloor
        if (room_floor == 1) {
            room_type = 'Luxury'
        }
        else if (room_floor == 2) {
            room_type = 'Economy'
        }
        else if (room_floor == 3) {
            room_type = 'Suite'
        }
        else if (room_floor == 4) {
            room_type = 'Penthouse'
        }
        room_price = await (await pool.request().query("SELECT RoomPrice as price from Room where RoomNo = " + rooms[0])).recordset[0].price

        date = await (await pool.request().query("SELECT DateDiff(day,CheckInDate,CheckOutDate) as diff from Booking where ClientID = " + id)).recordset[0].diff

        booking_dates = await (await pool.request().query("Select CheckInDate as cin, CheckOutDate as cout from Booking where ClientID = " + id)).recordset
        check_in = booking_dates[0].cin
        check_out = booking_dates[0].cout


        //accomodation = await (await pool.request().query("Select RoomNo as RNo from Booking where ClientID = "+id)).recordset 
        food = await (await pool.request().query("Select FoodPrice*FoodPeople as totalFood from FoodReservation where ClientID = " + id)).recordset
        tennis = await (await pool.request().query("select s.ServicePrice as sPrice from client as c inner join Orders as o on c.ClientID= o.clientid inner join service as s on o.serviceNo = s.ServiceNo where o.serviceNo=1 and c.ClientID= " + id)).recordset
        bowling = await (await pool.request().query("select s.ServicePrice as sPrice from client as c inner join Orders as o on c.ClientID= o.clientid inner join service as s on o.serviceNo = s.ServiceNo where o.serviceNo=2 and c.ClientID= " + id)).recordset
        cinema = await (await pool.request().query("select s.ServicePrice as sPrice from client as c inner join Orders as o on c.ClientID= o.clientid inner join service as s on o.serviceNo = s.ServiceNo where o.serviceNo=3 and c.ClientID= " + id)).recordset
        if (tennis.length > 0) {

            tennis = tennis[0].sPrice
        }
        else {
            tennis = "0"
        }
        if (food.length > 0) {
            food = food[0].totalFood
        }
        else {
            food = "0"
        }
        if (bowling.length > 0) {
            bowling = bowling[0].sPrice
        }
        else {
            bowling = "0"
        }
        if (cinema.length > 0) {
            cinema = cinema[0].sPrice
        }
        else {
            cinema = "0"
        }

        food = food * date
        accomodation = room_price * date * rooms_booked
        data = {
            rBooked: rooms_booked, roomsNo: rooms, sFood: food, sTennis: tennis, sBowling: bowling,
            sCinema: cinema, roomFloor: room_type, room_price: room_price, billno: billno,
            client_name: full_name, accomodation: accomodation, check_in: check_in, check_out: check_out
        }





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
app.get('/getBillData', (req, res) => {
    (async () => {
        let data = await getBillInfo(req.query.id)
        // console.log(data)
        res.send(data)
    })()
});


async function bookService(SNo, ClientId) {
    const sql = require('mssql')
    const { boolean } = require('webidl-conversions')


    sql.on('error', err => {
        console.log(err.message)
    })

    try {
        let pool = await sql.connect(config)
        console.log("Insert into Orders values (" + ClientId + "  ," + SNo + ")")

        await pool.request().query("Insert into Orders values (" + ClientId + "  ," + SNo + ")")


        sql.close()
    } catch (err) {
        console.log(err.message)
        sql.close()
    }
}

async function bookFood(ClientId, people) {
    const sql = require('mssql')
    const { boolean } = require('webidl-conversions')


    sql.on('error', err => {
        console.log(err.message)
    })

    try {
        let pool = await sql.connect(config)

        await pool.request().query("Insert into FoodReservation values (" + ClientId + "  ,Default, " + people + ")")


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
        Tennis = false
        Bowling = false
        Cinema = false
        Food = false

        let pool = await sql.connect(config)
        Service = await (await pool.request().query("Select ServiceNo as SNo from Orders where ClientId=" + id)).recordset
        for (i = 0; i < Service.length; i++) {
            s = Service[i].SNo
            if (s == 1) {
                Tennis = true
            }
            else if (s == 2) {
                Bowling = true
            }
            else if (s == 3) {
                Cinema = true
            }
        }
        f = await (await pool.request().query("select ClientID from FoodReservation where ClientID=" + id)).recordset
        if (f.length == 1) {
            Food = true
        }

        Data = {
            t: Tennis,
            b: Bowling,
            c: Cinema,
            f: Food
        }


        sql.close()
        return Data
    } catch (err) {
        console.log(err.message)
        sql.close()
    }
}




app.post('/bookService', (req, res) => {
    (async () => {
        console.log("SNO: " + req.body.SNo)
        await bookService(req.body.serviceNo, req.body.ClientId)
        // console.log(data)
    })()
});

app.post('/bookFood', (req, res) => {
    (async () => {
        await bookFood(req.body.ClientId, req.body.Food)
        // console.log(data)
    })()
});

app.get('/RefreshStats', (req, res) => {
    (async () => {
        let data = await RefreshStats(req.query.id)
        res.send(data)
        // console.log(data)
    })()
});


async function getClientData(id) {
    const sql = require('mssql')
    const { boolean } = require('webidl-conversions')


    sql.on('error', err => {
        console.log(err.message)
    })

    try {
        let pool = await sql.connect(config)

        // console.log("review")
        client_name = await (await pool.request().query("Select ClientFirstName as fname,ClientLastName as lname from Client where ClientID = " + id)).recordset
        full_name = client_name[0].fname + " " + client_name[0].lname
        r = await (await pool.request().query("Select RoomNo as RNo from Booking where ClientID = " + id)).recordset
        rooms = []
        for (i = 0; i < r.length; i++) {
            rooms[i] = r[i].RNo
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

        data = { checkin_date: check_in, checkout_date: check_out, roomsBooked: rooms, client_name: full_name, servicesOrdered: services }
        console.log(data)
        sql.close()
        return data
    } catch (err) {
        console.log(err.message)
        sql.close()
    }
}



app.get('/getClientData', (req, res) => {
    (async () => {
        let data = await getClientData(req.query.id)
        // console.log(data)
        res.send(data)
    })()
});




async function postReview(id, stars, comments) {
    const sql = require('mssql')
    const { boolean } = require('webidl-conversions')


    sql.on('error', err => {
        console.log(err.message)
    })

    try {
        let pool = await sql.connect(config)
        await pool.request().query("exec postReview " + id + "," + stars + ",'" + comments + "'")
        sql.close()
    } catch (err) {
        console.log(err.message)
        sql.close()
    }
}



app.post('/submitReview', (req, res) => {
    (async () => {
        console.log(req.body)
        let data = await postReview(req.body.id, req.body.stars, req.body.comments)
        // console.log(data)
        res.send(data)
    })()
});

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
        return [floor1, floor2, floor3, floor4]
    } catch (err) {
        console.log(err.message)
        sql.close()
    }
}





async function postClient(fname, lname, gender, email, phone, checkin, checkout, room_type, room_quantity) {
    const sql = require('mssql')
    const { boolean } = require('webidl-conversions')


    sql.on('error', err => {
        console.log(err.message)
    })

    try {
        let pool = await sql.connect(config)
        clientID = (await pool.request().query('Select Max(ClientId) as ID from Client')).recordsets[0][0].ID + 1
        console.log("Client ID: " + clientID)
        let UserName = fname + clientID
        r = await pool.request().query('Insert into Users values(' + clientID + ", 'password', '" + UserName + "')")
        r = await pool.request().query("Insert into Client "
            + "values(" + clientID + ", '" + fname + "', '" + lname + "', '" + phone + "', '" + gender + "', '" + email + "', 1)")
        rooms = (await pool.request().query("Select RoomNo as RNo from Room where RoomState = 0 and RoomFloor = " + room_type)).recordset
        console.log(UserName)
        for (i = 0; i < room_quantity; i++) {
            r = await pool.request().query("Insert into Booking "
                + "values(" + clientID + ", " + rooms[i].RNo + ", '" + checkin + "', '" + checkout + "')")
            r = await pool.request().query("Update Room set RoomState = 1 where RoomNo = " + rooms[i].RNo)
        }
        sql.close()
        return { username: UserName, id: clientID }
    } catch (err) {
        console.log(err.message)
        sql.close()
    }
}


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

// const config = {
//     user: 'mishal',
//     password: '123',
//     server: 'LAPTOP-3V03CSAF', // You can use 'localhost\\instance' to connect to named instance
//     database: 'Resort_DB',
//     port: 1433,
//     trustServerCertificate: true



async function getReviews() {
    const sql = require('mssql')
    const { boolean } = require('webidl-conversions')


    sql.on('error', err => {
        console.log(err.message)
    })

    try {
        let pool = await sql.connect(config)
        let result

        // console.log("review")
        result = await pool.request().query('Select C.ClientFirstName as fname,C.ClientLastName as lname,R.ReviewRating as rating,R.ReviewComments as comments from Client as C '
            + "inner join Review as R "
            + " on R.ClientID = C.ClientID")

        let reviews = []
        for (var i = 0; i < 4; i++) {
            reviews[i] = result.recordset[i]
            // console.log(result.recordset[i])
        }
        sql.close()
        return reviews
    } catch (err) {
        console.log(err.message)
        sql.close()
    }
}




app.get('/getReviews', (req, res) => {
    (async () => {
        let data = await getReviews()
        // console.log(data)
        res.send(data)
    })()
});



async function checkUser(name, pass, radio) {
    const sql = require('mssql')
    const { boolean } = require('webidl-conversions')


    sql.on('error', err => {
        console.log(err.message)
    })

    try {
        console.log("checkUser: " + name + " : " + pass + " : " + radio)
        let pool = await sql.connect(config)
        let result
        if (radio == 'true') {
            console.log("client")
            result = await pool.request().query('Select UserName,Pass from Users inner join Client on Users.UserID = Client.ClientID' +
                " where UserName = '" + name + "' and Pass = '" + pass + "' and ClientStatus = 1")
        }
        else {
            console.log("admin")
            result = await pool.request().query('Select UserName,Pass from Users inner join Admin on Users.UserID = Admin.AdminID' +
                " where UserName = '" + name + "' and Pass = '" + pass + "'")
        }
        id = await (await pool.request().query("Select UserID as id from Users where UserName = '" + name+"'")).recordset[0].id
        var flag = false
        console.log(result.recordsets[0][0].UserName)
        if (result.recordsets[0].length != 0) {
            var flag = true
        }
        sql.close()
        return {check:flag,id:id}
    } catch (err) {
        console.log(err.message)
        sql.close()
    }
}




app.post('/checkUser', (req, res) => {
    (async () => {
        let result = await checkUser(req.body.username, req.body.password, req.body.radio)
        res.send({ state: result.check,id:result.id })
    })()
});

//  const config = {
//     user: 'mishal',
//     password: '123',
//     server: 'LAPTOP-3V03CSAF', // You can use 'localhost\\instance' to connect to named instance
//     database: 'Resort_DB',
//     port: 1433,
//     trustServerCertificate: true
//  }



async function getBillInfo(id) {
    const sql = require('mssql')
    const { boolean } = require('webidl-conversions')


    sql.on('error', err => {
        console.log(err.message)
    })

    try {
        let pool = await sql.connect(config)
        let result

        console.log("Yay")
        billno = (await pool.request().query("Select Max(BillNo) as BNo from Bill ")).recordset[0].BNo
        console.log(billno)
        billno += 1
        console.log(billno)

        cname = (await pool.request().query("Select ClientFirstName as fname,ClientLastName as lname from Client where ClientID = " + id)).recordset[0]
        full_name = cname.fname + " " + cname.lname

        // console.log("review")
        rooms_booked = (await pool.request().query("Select count(RoomNo) as totalRooms from Booking where ClientID = " + id)).recordset[0].totalRooms
        r = await (await pool.request().query("Select RoomNo as RNo from Booking where ClientID = " + id)).recordset
        rooms = []
        for (i = 0; i < r.length; i++) {
            rooms[i] = r[i].RNo
        }
        console.log(rooms)
        room_floor = await (await pool.request().query("SELECT r.RoomFloor as roomFloor from Client as c inner join Booking as b on c.ClientId=b.ClientId inner join Room as r on b.RoomNo=r.RoomNo where c.ClientId = " + id)).recordset[0].roomFloor
        if (room_floor == 1) {
            room_type = 'Luxury'
        }
        else if (room_floor == 2) {
            room_type = 'Economy'
        }
        else if (room_floor == 3) {
            room_type = 'Suite'
        }
        else if (room_floor == 4) {
            room_type = 'Penthouse'
        }
        room_price = await (await pool.request().query("SELECT RoomPrice as price from Room where RoomNo = " + rooms[0])).recordset[0].price

        date = await (await pool.request().query("SELECT DateDiff(day,CheckInDate,CheckOutDate) as diff from Booking where ClientID = " + id)).recordset[0].diff

        booking_dates = await (await pool.request().query("Select CheckInDate as cin, CheckOutDate as cout from Booking where ClientID = " + id)).recordset
        check_in = booking_dates[0].cin
        check_out = booking_dates[0].cout


        //accomodation = await (await pool.request().query("Select RoomNo as RNo from Booking where ClientID = "+id)).recordset 
        food = await (await pool.request().query("Select FoodPrice*FoodPeople as totalFood from FoodReservation where ClientID = " + id)).recordset
        tennis = await (await pool.request().query("select s.ServicePrice as sPrice from client as c inner join Orders as o on c.ClientID= o.clientid inner join service as s on o.serviceNo = s.ServiceNo where o.serviceNo=1 and c.ClientID= " + id)).recordset
        bowling = await (await pool.request().query("select s.ServicePrice as sPrice from client as c inner join Orders as o on c.ClientID= o.clientid inner join service as s on o.serviceNo = s.ServiceNo where o.serviceNo=2 and c.ClientID= " + id)).recordset
        cinema = await (await pool.request().query("select s.ServicePrice as sPrice from client as c inner join Orders as o on c.ClientID= o.clientid inner join service as s on o.serviceNo = s.ServiceNo where o.serviceNo=3 and c.ClientID= " + id)).recordset
        if (tennis.length > 0) {

            tennis = tennis[0].sPrice
        }
        else {
            tennis = "0"
        }
        if (food.length > 0) {
            food = food[0].totalFood
        }
        else {
            food = "0"
        }
        if (bowling.length > 0) {
            bowling = bowling[0].sPrice
        }
        else {
            bowling = "0"
        }
        if (cinema.length > 0) {
            cinema = cinema[0].sPrice
        }
        else {
            cinema = "0"
        }

        food = food * date
        accomodation = room_price * date * rooms_booked
        data = {
            rBooked: rooms_booked, roomsNo: rooms, sFood: food, sTennis: tennis, sBowling: bowling,
            sCinema: cinema, roomFloor: room_type, room_price: room_price, billno: billno,
            client_name: full_name, accomodation: accomodation, check_in: check_in, check_out: check_out
        }





        console.log(data)
        sql.close()
        return data
    } catch (err) {
        console.log(err.message)
        sql.close()
    }
}





app.get('/getBillData', (req, res) => {
    (async () => {
        let data = await getBillInfo(req.query.id)
        // console.log(data)
        res.send(data)
    })()
});




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

app.get('/getUsers', (req, res) => {
    (async () => {
        let result = await getUsers()
        console.log(result + " 5543")
        let table = ''; //to store html table
        table = '<table id="table-decoration"><tr class = "tablerows"><th class="tableheader">#</th><th class="tableheader">ID</th><th class="tableheader">FirstName</th><th class="tableheader">LastName</th><th class="tableheader">PhoneNo</th><th class="tableheader">Gender</th><th class="tableheader">Email</th></tr>';

        //create html table with data from res.
        for (var i = 0; i < result.recordset.length; i++) {
            // console.log(result.recordsets)
            table += '<tr  class="tablerows"><td class="tablecell">' + (i + 1) + '</td><td class="tablecell">' + result.recordset[i].ClientID + '</td><td class="tablecell">' + result.recordset[i].ClientFirstName + '</td><td class="tablecell">' + result.recordset[i].ClientLastName + '</td><td class="tablecell">' + result.recordset[i].PhoneNo + '</td><td class="tablecell">' + result.recordset[i].Gender + '</td><td class="tablecell">' + result.recordset[i].Email + '</td></tr>';

        }

        table += "</table>"


        res.send(table)
    })()
});



async function getBookings() {
    const sql = require('mssql')
    const { boolean } = require('webidl-conversions')


    sql.on('error', err => {
        console.log(err.message)
    })
    try {
        let pool = await sql.connect(config)

        booked = []
        for (i = 1; i < 18; i++) {
            booked[i] = (await pool.request().query('SELECT COUNT(b.RoomNo) as no1 FROM Booking as b inner join Room as r on r.RoomNo = b.RoomNo WHERE Month(b.CheckInDate) = Month(GETDATE()) AND YEAR(b.CheckInDate) = YEAR(GETDATE()) AND r.RoomNo = ' + i)).recordset[0].no1
        }

        final = {
            r1: booked[1], r2: booked[2], r3: booked[3], r4: booked[4], r5: booked[5],
            r6: booked[6], r7: booked[7], r8: booked[8], r9: booked[9], r10: booked[10],
            r11: booked[11], r12: booked[12], r13: booked[13], r14: booked[14], r15: booked[15],
            r16: booked[16], r17: booked[17]
        }
        sql.close()
        return final
    } catch (err) {
        console.log(err.message)
        sql.close()
    }
}

async function getRoom(id) {
    const sql = require('mssql')
    const { boolean } = require('webidl-conversions')


    sql.on('error', err => {
        console.log(err.message)
    })
    try {
        let pool = await sql.connect(config)
        roomState = await pool.request().query('select RoomState  as State from Room WHERE RoomNo =' + id)
        roomRating = await pool.request().query(' SELECT Cast(AVG(Cast((R.ReviewRating) as Decimal(3,2))) as Decimal(3,2)) as rating FROM Review as R INNER JOIN Booking as B  on R.ClientID = B.ClientID  WHERE B.RoomNo = ' + id + 'Group BY RoomNo')
        // console.log(roomState.recordset[0].State);
        let roomStateSpan = '';
        let roomRatingResult = '';
        if (roomState.recordset[0].State == 1) {
            roomStateSpan = '<span>Booked</span>'

        }
        else {
            roomStateSpan = '<span>Free</span>'
        }
        roomRatingResult = '<span>' + roomRating.recordset[0].rating + '</span>'
        final = {
            rS: roomStateSpan, rR: roomRatingResult
        }
        return final

    }
    catch (err) {
        console.log(err.message)
        sql.close()
    }

}

app.get('/getBookings', (req, res) => {
    (async () => {

        let result = await getBookings()
        //let value ='';
        // let moreValue ='';
        //  console.log(result.recordset[0].freeRoom)
        //  console.log(moreResult.recordset[0].bookedRoom)
        //   value= '<span>'+result.recordset[0].freeRoom+'</span>'
        // moreValue = '<span>'+moreResult.recordset[0].bookedRoom+'</span>'
        res.send(result)
    })()
});


app.get('/getRoom', (req, res) => {
    (async () => {
        let result = await getRoom(req.query.id)
        //let value ='';
        // let moreValue ='';
        //  console.log(result.recordset[0].freeRoom)
        //  console.log(moreResult.recordset[0].bookedRoom)
        //  console.log(moreResult.recordset[0].bookedRoom)
        //   value= '<span>'+result.recordset[0].freeRoom+'</span>'
        // moreValue = '<span>'+moreResult.recordset[0].bookedRoom+'</span>'
        res.send(result)
    })()
});


async function getAdminStats() {
    const sql = require('mssql')
    const { boolean } = require('webidl-conversions')


    sql.on('error', err => {
        console.log(err.message)
    })

    try {
        let pool = await sql.connect(config)

        freeResult = await pool.request().query('SELECT COUNT(RoomNo) as freeRoom FROM Room WHERE RoomState = 0')
        bookedResult = await pool.request().query('SELECT COUNT(RoomNo) as bookedRoom FROM Room WHERE RoomState = 1')
        averageResult = await pool.request().query('SELECT Cast(AVG(Cast((ReviewRating) as Decimal(3,2))) as Decimal(3,2)) as avg FROM Review')
        bookingThisMonthResult = await pool.request().query('SELECT COUNT(*) as countofBooking FROM BOOKING  WHERE Month(CheckInDate) = Month(GETDATE()) AND YEAR(CheckInDate) = YEAR(GETDATE())')
        servicesThisMonthResult = await pool.request().query('SELECT COUNT(*) as countofServices FROM ORDERS AS o INNER JOIN BOOKING AS B  ON B.ClientID =  o.ClientID WHERE Month(CheckInDate) = Month(GETDATE()) AND YEAR(CheckInDate) = YEAR(GETDATE())')
        averageRating = await pool.request().query('SELECT Cast(AVG(Cast((R.ReviewRating) as Decimal(3,2))) as Decimal(3,2)) as avgRatingThisMonth FROM Review as R  INNER JOIN BOoking as B ON R.ClientID = B.ClientID WHERE Month(B.CheckInDate) = Month(GETDATE()) AND YEAR(B.CheckInDate) = YEAR(GETDATE())')
        freevalue = freeResult.recordset[0].freeRoom
        bookedValue = bookedResult.recordset[0].bookedRoom
        averageValue = '<span>' + averageResult.recordset[0].avg + '</span>'
        bookingThisMonthValue = '<span>' + bookingThisMonthResult.recordset[0].countofBooking + '</span>'
        ServicesThisMonthValue = '<span>' + servicesThisMonthResult.recordset[0].countofServices + '</span>'
        averageRatingValue = '<span>' + averageRating.recordset[0].avgRatingThisMonth + '</span>'
        final = { fv: freevalue, bv: bookedValue, av: averageValue, btv: bookingThisMonthValue, sv: ServicesThisMonthValue, arv: averageRatingValue }
        sql.close()
        return final
    } catch (err) {
        console.log(err.message)
        sql.close()
    }
}

app.get('/getAdminStats', (req, res) => {
    (async () => {
        let result = await getAdminStats()
        let value = '';
        let moreValue = '';
        //  console.log(result.recordset[0].freeRoom)
        //  console.log(moreResult.recordset[0].bookedRoom)
        //   value= '<span>'+result.recordset[0].freeRoom+'</span>'
        // moreValue = '<span>'+moreResult.recordset[0].bookedRoom+'</span>'
        res.send(result)
    })()
});





const port = 8080;

app.listen(port, () => {
    console.log(`Server running on port${port}`);
});
