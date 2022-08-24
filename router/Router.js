const express = require("express");
const router = express();

router.use("/lib/withdrawal", require("./Withdrawal.js"));

module.exports = router;
