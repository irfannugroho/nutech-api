const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const balanceRoutes = require("./routes/balanceRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();
app.use(bodyParser.json());

//menangani rute
app.use("/auth", authRoutes);
app.use("/balance", balanceRoutes);
app.use("/transaction", transactionRoutes);

//jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
