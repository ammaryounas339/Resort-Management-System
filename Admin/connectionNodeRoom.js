// const config = {
//     user: 'admin1',
//     password: '123',
//     server: 'DESKTOP-IO2BR35',
//     database: 'Resort_DB',
//     port: 1433,
//     trustServerCertificate: true
//   }



const config = {
    user: 'admin',
    password: '123',
    server: 'DESKTOP-TA4RQON', // You can use 'localhost\\instance' to connect to named instance
    database: 'Resort_DB',
    port: 1433,
    trustServerCertificate: true
}

// const config = {
//     user: 'sa',
//     password: '456',
//     server: 'DESKTOP-584F9IS', // You can use 'localhost\\instance' to connect to named instance
//     database: 'Resort_DB',
//     port: 1433,
//     trustServerCertificate: true
// }


  

async function getBookings() {
  const sql = require('mssql')
  const { boolean } = require('webidl-conversions')


  sql.on('error', err => {
      console.log(err.message)
  })
  try {
    let pool = await sql.connect(config)

    booked = []
    for(i = 1;i<18;i++){
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

async function getRoom(id){
        const sql = require('mssql')
  const { boolean } = require('webidl-conversions')


  sql.on('error', err => {
      console.log(err.message)
  })
  try {
    let pool = await sql.connect(config)
    roomState = await pool.request().query('select RoomState as State from Room WHERE RoomNo ='+id)
    roomRating = await pool.request().query(' SELECT Cast(AVG(Cast((R.ReviewRating) as Decimal(3,2))) as Decimal(3,2)) as rating FROM Review as R INNER JOIN Booking as B  on R.ClientID = B.ClientID  WHERE B.RoomNo = '+id+'Group BY RoomNo')
   // console.log(roomState.recordset[0].State);
    let roomStateSpan = '';
    let roomRatingResult = '';
    if(roomState.recordset[0].State == 1){
        roomStateSpan = '<span>Booked</span>'
     
    }
    else{
        roomStateSpan = '<span>Free</span>'
    }
    roomRatingResult = '<span>'+roomRating.recordset[0].rating+'</span>'
    final = {
        rS : roomStateSpan , rR : roomRatingResult
    }
    return final

}
catch (err) {
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


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.get('/getRoom' , (req, res) => {
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


const port = 8080;

app.listen(port, () => {
    console.log(`Server running on port${port}`);
});