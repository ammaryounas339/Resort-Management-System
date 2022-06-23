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


  

async function getAdminStats() {
  const sql = require('mssql')
  const { boolean } = require('webidl-conversions')


  sql.on('error', err => {
      console.log(err.message)
  })

  try {
      let pool = await sql.connect(config)

      freeResult = await pool.request().query('SELECT COUNT(RoomNo) as freeRoom FROM Room WHERE RoomState = 0')
      bookedResult= await pool.request().query('SELECT COUNT(RoomNo) as bookedRoom FROM Room WHERE RoomState = 1')
      averageResult = await pool.request().query('SELECT Cast(AVG(Cast((ReviewRating) as Decimal(3,2))) as Decimal(3,2)) as avg FROM Review')
      bookingThisMonthResult = await pool.request().query('SELECT COUNT(*) as countofBooking FROM BOOKING  WHERE Month(CheckInDate) = Month(GETDATE()) AND YEAR(CheckInDate) = YEAR(GETDATE())')
      servicesThisMonthResult = await pool.request().query('SELECT COUNT(*) as countofServices FROM ORDERS AS o INNER JOIN BOOKING AS B  ON B.ClientID =  o.ClientID WHERE Month(CheckInDate) = Month(GETDATE()) AND YEAR(CheckInDate) = YEAR(GETDATE())')
      averageRating = await pool.request().query('SELECT Cast(AVG(Cast((R.ReviewRating) as Decimal(3,2))) as Decimal(3,2)) as avgRatingThisMonth FROM Review as R  INNER JOIN BOoking as B ON R.ClientID = B.ClientID WHERE Month(B.CheckInDate) = Month(GETDATE()) AND YEAR(B.CheckInDate) = YEAR(GETDATE())')
      freevalue= freeResult.recordset[0].freeRoom
      bookedValue = bookedResult.recordset[0].bookedRoom
      averageValue =  '<span>'+averageResult.recordset[0].avg+'</span>'
      bookingThisMonthValue = '<span>'+bookingThisMonthResult.recordset[0].countofBooking+'</span>'
      ServicesThisMonthValue = '<span>'+servicesThisMonthResult.recordset[0].countofServices+'</span>'
      averageRatingValue = '<span>'+averageRating.recordset[0].avgRatingThisMonth +'</span>'
      final = {fv: freevalue,bv: bookedValue , av : averageValue , btv : bookingThisMonthValue,sv : ServicesThisMonthValue , arv : averageRatingValue}
      sql.close()
      return final
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
app.get('/getAdminStats', (req, res) => {
    (async () => {
        let result = await getAdminStats()
         let value ='';
         let moreValue ='';
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
