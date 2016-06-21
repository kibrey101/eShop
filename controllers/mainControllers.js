var Product = require("../models/product");
var Cart = require("../models/cart");
var stripe = require("stripe")("sk_test_Oka1n8mYSm8qMfURCPsDh1od");
var async = require("async");

function paginate(req, res, next) {
    var itemsPerPage = 12;
    var page = req.params.page || 1;
    Product.find()
        .skip(itemsPerPage * (page -1 ))
        .limit(itemsPerPage)
        .populate("category")
        .exec(function (err, products) {
            if(err) return next(err);
            Product.count().exec(function (err, count) {
                if(err) return next(err);
                res.render("main/product-main", {
                    products: products,
                    pages: Math.ceil(count/itemsPerPage),
                    message: req.flash("cartMessage")
                });
            });
        });
}

exports.renderHome = function (req, res, next) {
   if (req.user){
       paginate(req, res, next);
   } else {
       res.render("main/home");
   }
};

exports.renderAbout = function (req, res, next) {
    res.render("main/about");
};

exports.renderCategoryProducts = function (req, res, next) {
    var queryObject = {category: req.params.id};
    if(req.params.manufacturer) queryObject.manufacturer = req.params.manufacturer;

    var itemsPerPage = 12;
    var page = req.params.categoryPage || 1;
    
   Product
       .find(queryObject)
       .skip(itemsPerPage * (page -1 ))
       .limit(itemsPerPage)
       .populate("category")
       .exec( function (err, products) {
        if(err) return next(err);

           var keys = {};
           var results = [];
           var agManufacturer = [];
           var hnManufacturer = [];
           var ouManufacturer = [];
           var vzManufacturer = [];
           Product.find({category: req.params.id})
               .populate("category")
               .exec(function (err, manufacturerResults) {
                   if(err) return next(err);

                   for(var i = 0; i< manufacturerResults.length; i++) {
                       var val = manufacturerResults[i].manufacturer;
                       if(typeof keys[val] == "undefined"){
                           keys[val] = true;

                           if(val.toUpperCase().charAt(0) <= 'G'){
                               agManufacturer.push(val);
                           } else if (val.toUpperCase().charAt(0) > 'G' && val.toUpperCase().charAt(0) <= 'N'){
                               hnManufacturer.push(val);
                           } else if (val.toUpperCase().charAt(0) > 'N' && val.toUpperCase().charAt(0) <= 'U'){
                               ouManufacturer.push(val);
                           } else {
                               vzManufacturer.push(val);
                           }
                       }
                   }

                   Product.count(queryObject).exec(function (err, count) {
                       if(err) return next(err);

                       var checkManufacturer = "/";
                       if(req.params.manufacturer) checkManufacturer = checkManufacturer + req.params.manufacturer + "/";
                       res.render("main/category", {
                           products: products,
                           pages: Math.ceil(count/itemsPerPage),
                           manufacturerAG: agManufacturer,
                           manufacturerHN: hnManufacturer,
                           manufacturerOU: ouManufacturer,
                           manufacturerVZ: vzManufacturer,
                           currentManufacturer: checkManufacturer,
                           currentCategory: req.params.id});
                   });
               });
    });
};

exports.renderProduct = function (req, res, next) {
    Product.findById({_id: req.params.id})
        .populate("category")
        .exec(function (err, product) {
        if(err) return next(err);
        if(!product){
            return next("product does not exist");
        }
        res.render("main/product", {product: product, errorMessage: req.flash("error")});
    });
};

exports.search = function (req, res, next) {
   res.redirect("/search?q=" + req.body.q); 
};

exports.renderSearch = function (req, res, next) {
   if(req.query.q) {
       Product.search({
           query_string: {query: req.query.q }
       }, function (err, results) {
           if(err) return next(err);
           var data = results.hits.hits.map(function (hit) {
               return hit;
           });
           res.render("main/search-result", {
               query: req.query.q,
               results: data
           });
       });
   }
};

exports.addToCart = function (req, res, next) {
    var itemExists = false;
    Cart.findOne({owner: req.user._id}, function (err, cart) {
        if(err) return next(err);

        if(cart.items.length > 0) {

            for(var i = 0; i < cart.items.length; i++){
                if(cart.items[i].item == req.body.product_id){
                    cart.items[i].quantity += parseInt(req.body.quantity);
                    //cart.items[i].price += parseFloat(req.body.priceHidden * req.body.quantity);
                    //cart.total += parseFloat(req.body.priceHidden).toFixed(2);
                    itemExists = true;
                    cart.save(function (err) {
                        if(err) return next(err);
                        req.flash("cartMessage", "Item/s added to cart");
                        var backURL=req.header('Referer') || '/';
                        return res.redirect(backURL);
                    });
                }
            }

        }

        if(cart.items.length == 0 || !itemExists){
            cart.items.push({
                item: req.body.product_id,
                quantity: parseInt(req.body.quantity)
            });

            //cart.total += parseFloat(req.body.priceHidden).toFixed(2);
            itemExists = false;
            cart.save(function (err) {
                if(err) return next(err);
                req.flash("cartMessage", "Item/s added to cart");
                var backURL=req.header('Referer') || '/';
                return res.redirect(backURL);

            });
        }



    });
};

exports.updateCart = function (req, res, next) {
    Cart.findOne({ owner: req.user._id}, function (err, cart) {
        if(err) return next(err);

        for(var i = 0; i < cart.items.length; i++){
            if(cart.items[i].item == req.body.product_id){
                cart.items[i].quantity = parseInt(req.body.quantity);
                cart.save(function (err) {
                    if(err) return next(err);
                    req.flash("cartUpdateMessage", "Cart updated");
                    var backURL=req.header('Referer') || '/';
                    return res.redirect(backURL);
                });
            }
        }
    });
};
exports.renderCart = function (req, res, next) {
    Cart.findOne({owner: req.user._id})
        .populate("items.item")
        .populate("category")
        .exec(function (err, userCart) {
            if(err) return next(err);
            res.render("main/cart", {foundCart: userCart, removeMessage: req.flash("remove")});
        });
};


exports.remove = function (req, res, next) {
    Cart.findOne({owner: req.user._id}, function (err, foundCart) {
        if(err) return next(err);
        foundCart.items.pull(String(req.body.item));
        foundCart.total = 0 ;
        foundCart.save(function (err) {
            if(err) return next(err);

            req.flash("remove", "item/s removed from cart");
            return res.redirect("/cart");
        });

    });
};

exports.payment = function (req, res, next) {
   var stripeToken = req.body.stripeToken;
    var currentCharges = Math.round(req.body.stripeMoney * 100);
    stripe.customers.create({
        source: stripeToken
    }).then(function (customer) {
        return stripe.charges.create({
            amount: currentCharges,
            currency: "eur",
            customer: customer.id
        });
    });
    res.redirect("/");
};

Product.createMapping(function (err, mapping) {
    if(err){
        console.log("error while creating mapping");
        console.log(err);
    } else {
        console.log("mapping created");
        console.log(mapping);
    }
});

var stream = Product.synchronize();
var count = 0;

stream.on("data", function () {
    count++;
});

stream.on("close", function () {
    console.log("indexed " + count + " documents");
});

stream.on("error", function (err) {
    console.log(err);
});

