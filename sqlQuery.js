const mysql = require('mysql');

const options = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'book'
};
let con = mysql.createConnection(options);

function sqlQuery(sqlStr, arr) {
    console.log(sqlStr, arr);
    return new Promise((resolve, reject) => {
        con.query(sqlStr, arr, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        })
    })
}

module.exports= sqlQuery;