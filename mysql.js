import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: "3306",
    database: "banco_tcc"
});

export async function execute(query, params = []) {
    try {
        const [results] = await pool.execute(query, params);
        return results;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

export default { execute };