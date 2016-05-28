var mongoose = require("mongoose");
var mongoosastic = require("mongoosastic");
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId, ref: "Category"
    },
    name: {
        type: String,
        trim: true
    },
    price: {type: Number},
    image: {type: String}
});

ProductSchema.plugin(mongoosastic, {
    hosts: [
        "localhost:9200",
        'https://bEKlklRJkOiBxk588NYAmP3Q1eSFiEel:@jani.east-us.azr.facetflow.io'
    ]
});

module.exports = mongoose.model("product", ProductSchema);