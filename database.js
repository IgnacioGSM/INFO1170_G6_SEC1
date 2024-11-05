const mysql = require('mysql2');
require('dotenv').config();


// Configuración de la base de datos usando variables de entorno
const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const database = process.env.DB_NAME;


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