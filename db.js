const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'metro.proxy.rlwy.net',
  port: process.env.DB_PORT || '15016',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'hYtgMQukWtJlnUpKJNfuihUCYkIKsHbk',
  database: process.env.DB_NAME || 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = {
  getConnection: () => pool.getConnection(),
  query: (sql, params) => pool.execute(sql, params)
};
