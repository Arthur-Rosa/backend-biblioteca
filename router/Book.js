const express = require("express");
const router = express.Router();

const BookController = require("../controllers/BookController");

// createh
router.post("/register", BookController.createBook);
// update
router.put("/:id", BookController.updateBook);
// find
router.get("/all", BookController.getAllBook);
// findById
router.get("/:id", BookController.getOneBook);
// delete
router.delete("/:id", BookController.deleteBook);

module.exports = router;
