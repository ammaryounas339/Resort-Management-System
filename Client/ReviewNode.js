const config = {
    user: 'admin',
    password: '123',
    server: 'DESKTOP-TA4RQON', // You can use 'localhost\\instance' to connect to named instance
    database: 'Resort_DB',
    port: 1433,
    trustServerCertificate: true
}



async function postReview(id,stars,comments) {
    const sql = require('mssql')
    const { boolean } = require('webidl-conversions')


    sql.on('error', err => {
        console.log(err.message)
    })

    try {
        let pool = await sql.connect(config)
        await pool.request().query("exec postReview "+id+","+stars+",'"+comments+"'")
        sql.close()
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
app.post('/submitReview', (req, res) => {
    (async () => {
        console.log(req.body)
        let data = await postReview(req.body.id,req.body.stars,req.body.comments)
        // console.log(data)
        res.send(data)
    })()
});

const port = 8080;

app.listen(port, () => {
    console.log(`Server running on port${port}`);
});
