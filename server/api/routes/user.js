const express = require("express");
const router = express.Router();

const UserController = require('../controllers/user');
//const checkAuth = require("../middleware/check-auth");


//POST-signup
router.post("/signup", UserController.user_signup);

//POST-login
router.post("/login", UserController.user_login);

//DELETE
router.delete("/:userId", UserController.user_delete)           //, checkAuth

module.exports = router;