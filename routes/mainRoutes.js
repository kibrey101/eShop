var main = require("../controllers/mainControllers");
var router = require("express").Router();
var Product = require("../models/product");
module.exports = router;

router.route("/").get(main.renderHome);
router.route("/page/:page").get(main.renderHome);
router.route("/about").get(main.renderAbout);
router.route("/products/:id").get(main.renderCategoryProducts);
router.route("/products/:id/:manufacturer").get(main.renderCategoryProducts);

router.route("/products/:id/page/:categoryPage").get(main.renderCategoryProducts);
router.route("/products/:id/:manufacturer/page/:categoryPage").get(main.renderCategoryProducts);

router.route("/product/:id").get(main.renderProduct);
router.route("/search").get(main.renderSearch).post(main.search);
router.route("/addToCart").post(main.addToCart);
router.route("/updateCart").post(main.updateCart);
router.route("/cart").get(main.renderCart);
router.route("/remove").post(main.remove);
router.route("/checkout").get(main.renderCheckout);
router.route("/payment").post(main.payment);