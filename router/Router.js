const express = require("express");
const router = express();

router.use("/lib/withdrawal/", require("./Withdrawal.js"));
router.use("/lib/book/", require("./Book"));

module.exports = router;
