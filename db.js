const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'metro.proxy.rlwy.net',
  user: 'root',
  password: 'hYtgMQukWtJlnUpKJNfuihUCYkIKsHbk',
  database: 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = {
  getConnection: () => pool.getConnection(),
  query: (sql, params) => pool.execute(sql, params)
};
