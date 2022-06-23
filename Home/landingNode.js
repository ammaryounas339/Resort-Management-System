// const config = {
//     user: 'mishal',
//     password: '123',
//     server: 'LAPTOP-3V03CSAF', // You can use 'localhost\\instance' to connect to named instance
//     database: 'Resort_DB',
//     port: 1433,
//     trustServerCertificate: true
// }

const config = {
    user: 'admin',
    password: '123',
    server: 'DESKTOP-TA4RQON', // You can use 'localhost\\instance' to connect to named instance
    database: 'Resort_DB',
    port: 1433,
    trustServerCertificate: true
}



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



const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var cors = require('cors')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.get('/getReviews', (req, res) => {
    (async () => {
        let data = await getReviews()
        // console.log(data)
        res.send(data)
    })()
});

const port = 8080;

app.listen(port, () => {
    console.log(`Server running on port${port}`);
});





