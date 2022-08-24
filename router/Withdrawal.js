const express = require("express");
const router = express.Router();

const WithdrawController = require("../controllers/WithdrawController");

// createh
router.post("/register", WithdrawController.createWithdraw);
// update
router.put("/:id", WithdrawController.updateWithdraw);
// find
router.get("/all", WithdrawController.getAllWithdraw);
// findById
router.get("/:id", WithdrawController.getOneWithdraw);
// delete
router.delete("/:id", WithdrawController.deleteWithdraw);

module.exports = router;
