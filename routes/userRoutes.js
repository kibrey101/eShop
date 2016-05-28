var user = require("../controllers/userControllers");
var router = require("express").Router();

module.exports = router;

router.route("/signup").get(user.renderSignup).post(user.signup);

router.route("/login").get(user.renderLogin).post(user.login);

router.route("/profile").get(user.renderProfile);

router.route("/logout").get(user.logout);

router.route("/edit-profile").get(user.renderEdit).post(user.edit);