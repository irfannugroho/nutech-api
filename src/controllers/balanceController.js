const pool = require("../config/db");

exports.getBalance = async (req, res) => {
  const email = req.email; // Diperoleh dari payload JWT

  try {
    // Ambil saldo berdasarkan email pengguna
    const [rows] = await pool.query(
      "SELECT balance FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        status: 108,
        message: "Token tidak valid atau kadaluwarsa",
        data: null,
      });
    }

    const user = rows[0];
    res.status(200).json({
      status: 0,
      message: "Get Balance Berhasil",
      data: {
        balance: user.balance, // Mengambil saldo pengguna
      },
    });
  } catch (error) {
    console.error("Error during balance check:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
};
