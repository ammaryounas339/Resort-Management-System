const config = {
    user: 'admin',
    password: '123',
    server: 'DESKTOP-TA4RQON', // You can use 'localhost\\instance' to connect to named instance
    database: 'Resort_DB',
    port:1433,
    trustServerCertificate: true
}
const sql = require('mssql')

    
sql.on('error', err => {
    console.log(err.message)
})
async function getReviews(){
    try {
        let pool = await sql.connect(config)
        let result = await pool.request().query('Select * from Review')
        console.log(result.recordset[0].ReviewNo)
        sql.close()
    }catch(err){
        console.log(err.message)
        sql.close()
    }
}

getReviews()