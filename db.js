import mysql from "mysql2/promise";

export const db = await mysql.createPool({
  host: "localhost",   // seu host (ex: localhost ou IP do servidor)
  user: "root",        // seu usuário do MySQL
  password: "root",        // sua senha do MySQL
  database: "", // banco de dados
});
