const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Mario7711',
  database: 'microservicios',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = {
  getConnection: () => pool.getConnection(),
  query: (sql, params) => pool.execute(sql, params)
};
