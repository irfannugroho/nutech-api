const pool = require("../config/db");

exports.topUpBalance = async (req, res) => {
  const email = req.email;
  const { top_up_amount } = req.body;

  // Validasi input (pastikan amount adalah angka dan lebih besar dari 0)
  if (isNaN(top_up_amount) || top_up_amount <= 0) {
    return res.status(400).json({
      status: 109,
      message: "Amount harus berupa angka positif dan lebih besar dari 0",
      data: null,
    });
  }

  try {
    // Ambil saldo pengguna sebelumnya
    const [userRows] = await pool.query(
      "SELECT balance FROM users WHERE email = ?",
      [email]
    );

    if (userRows.length === 0) {
      return res.status(401).json({
        status: 108,
        message: "Token tidak valid atau kadaluwarsa",
        data: null,
      });
    }

    const user = userRows[0];
    const newBalance = user.balance + top_up_amount;

    // Update saldo pengguna di database
    await pool.query("UPDATE users SET balance = ? WHERE email = ?", [
      newBalance,
      email,
    ]);

    // Simpan transaksi topup ke database
    await pool.query(
      "INSERT INTO transactions (email, transaction_type, amount) VALUES (?, ?, ?)",
      [email, "TOPUP", top_up_amount]
    );

    // Kirim response dengan saldo baru
    res.status(200).json({
      status: 0,
      message: "Top-up berhasil",
      data: { balance: newBalance },
    });
  } catch (error) {
    console.error("Error during top-up:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null,
    });
  }
};
