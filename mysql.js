import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: "3307",
    database: "tcc_banco"
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