require('dotenv').config();

var colors = require('./colors.js'),
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
    colors.log(`%Reset%[%Violet%SQL%Reset%] - connected as id %Violet:Dark%${connection.threadId}`);
});

exports.exmple = function (name) {
    connection.query("UPDATE `bans` SET `actif` = 0 WHERE `id` = ?", [id], function (error, results, fields) {
        if (error) console.log(error);
    });
};