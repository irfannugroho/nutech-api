const express = require("express");
const { register, login } = require("../controllers/authController");
const { getBalance } = require("../controllers/balanceController");
const { verifyToken } = require("../middleware/authJwt");
const router = express.Router();

// Rute untuk registrasi
router.post("/registration", register);
//Rute untuk login
router.post("/login", login);

module.exports = router;
