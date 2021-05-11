/*
    To use:
    
    client.libs.sql.***(args1, args2, ...)
*/

require('dotenv').config();

var log = require('./log.js'),
    mysql = require('mysql'),
    connection = mysql.createConnection({
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        port: process.env.SQL_PORT,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DB,
        charset: 'utf8mb4_bin',
        supportBigNumbers: true
    });

connection.connect(function (err) {
    if (err) return console.error('error connecting: ' + err.stack);
    log(`%Reset%[%Violet%SQL%Reset%] - connected as id %Violet%${connection.threadId}`);
});

/**
*
* @param {String} name
*/
exports.tables = function (name, callback) {
    connection.query("SHOW TABLES;", [name], function (error, results, fields) {
        if (error) console.log(error);
        callback(results)
    });
};

// ...
