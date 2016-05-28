var Category = require("../models/category");
exports.renderAddCategory = function (req, res) {
   res.render("admin/category", {message: req.flash("success")});
};

exports.addCategory = function (req, res, next) {
   var category = new Category();

    category.name = req.body.name;

    category.save(function (err) {
        if(err) return next(err);
        req.flash("success", "category added successfully");
        return res.redirect("/add-category");
    });
};