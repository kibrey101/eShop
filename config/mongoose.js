var mongoose = require("mongoose");
var config = require("./secret");

module.exports = function () {
    var db = mongoose.connect(config.database, function (err) {
        if(err) console.log(err);

        console.log("connected to database successfully")
    });

    require("../models/category");
    return db;
};