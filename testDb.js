const pool = require("./src/config/db");

async function testConnection() {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    console.log("Koneksi berhasil:", rows);
  } catch (error) {
    console.error("Koneksi gagal:", error.message);
  }
}

testConnection();
