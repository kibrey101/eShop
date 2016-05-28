var admin = require("../controllers/adminControllers");
var router = require("express").Router();

module.exports = router;

router.route("/add-category").get(admin.renderAddCategory).post(admin.addCategory);
