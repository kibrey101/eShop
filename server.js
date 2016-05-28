var express = require("express");
var morgan = require("morgan");
var session = require("express-session");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var ejs = require("ejs");
var ejsMate = require("ejs-mate");
var flash = require("express-flash");
var MongoStore = require("connect-mongo")(session);
var passport = require("passport");

var config = require("./config/secret");
var Category = require("./models/category");

var mongoose = require("./config/mongoose");
var db = mongoose();

var app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());

app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    store: new MongoStore({url: config.database, autoReconnect: true})
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});

app.use(require("./middleware/middleware"));

app.use(function (req, res, next) {
   Category.find({}, function (err, categories) {
      if(err) return next(err);
       res.locals.categories = categories;
       next();
   });
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");

app.use(require("./routes/mainRoutes"));
app.use(require("./routes/userRoutes"));
app.use(require("./routes/adminRoutes"));
app.use("/api",require("./api/api"));


app.use(express.static(__dirname + "/public"));

app.listen(config.port, function (err) {
    if(err) console.log(err);
    
    console.log("hi kib server started at port " + config.port);
});