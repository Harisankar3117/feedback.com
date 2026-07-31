const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || 3306, 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'H@3117',
  database: process.env.DB_NAME || 'feedback', // We'll add a fallback if it doesn't exist yet
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// A separate connection just to create the DB if it doesn't exist
async function initDB() {
  let tempConn;
  try {
    tempConn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || 3306, 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'H@3117'
    });

    // Try to ensure database exists (Cloud providers might block this, which is fine since they pre-create it)
    try {
      await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'feedback'}\``);
    } catch (createErr) {
      console.log('Skipping database creation (Cloud Database Mode)');
    }
    await tempConn.end();

    // Now use the pool which points to 'feedback'
    await pool.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        department VARCHAR(100),
        year VARCHAR(50),
        college_name VARCHAR(255),
        mobile_number VARCHAR(20),
        student_mail VARCHAR(255),
        emoji_rating VARCHAR(50),
        content_quality INT,
        teaching_clarity INT,
        interaction_level INT,
        overall_experience INT,
        quick_feedback_tags TEXT,
        comments TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Add student_mail column if it doesn't exist
    try {
      await pool.query('ALTER TABLE feedback ADD COLUMN student_mail VARCHAR(255)');
    } catch (e) {
      // Ignore if it already exists
    }

    // Force existing tables to support 4-byte emojis
    await pool.query(`ALTER TABLE feedback CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);

    // Create settings table for passwords
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        access_password VARCHAR(100),
        admin_password VARCHAR(100)
      )
    `);

    // Seed settings if empty
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM settings');
    if (rows[0].count === 0) {
      await pool.query(`
        INSERT INTO settings (access_password, admin_password) 
        VALUES ('KSRCE@CN', 'KINGMAHENDRAN')
      `);
      console.log('Seed passcodes added to settings table.');
    }

    console.log('MySQL connected and schemas initialized successfully.');
  } catch (err) {
    console.error('Failed to connect or initialize MySQL:', err);
  }
}

initDB();

module.exports = pool;
