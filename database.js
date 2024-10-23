const mysql = require('mysql2');


const { host, user, password, database } = require('./credenciales_mysql.js');  // cambiar los datos en el archivo credenciales_mysql.js para que funcione en sus equipos

const db = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
    });

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Conexión a la base de datos exitosa");
    }
});

module.exports = db;