// db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Cria um pool de conexões
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Testa a conexão (opcional, mas recomendado)
pool.getConnection()
  .then(connection => {
    console.log('Conexão com o MySQL bem-sucedida!');
    connection.release(); // Libera a conexão de volta ao pool
  })
  .catch(err => {
    console.error('Erro ao conectar com o MySQL:', err.message);
  });

module.exports = pool;
