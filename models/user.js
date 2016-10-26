var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");
var crypto = require("crypto");

var UserSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true
    },
    password: {
        type: String
    },
    profile: {
        firstName: {type: String, default: ""},
        lastName: {type: String, default: ""},
        picture: {type: String, default: ""}
    },
    address:
    {
        street: {type: String, default: ""},
        city: {type: String, default: ""},
        postalCode: {type:String, default: ""},
        country: {type:String, default: ""},
        phoneNumber: {type:String, default: ""}
    },
    history: [{
        orderDate: {type: Date},
        orderStatus: {type: String},
        items: [
            {item: {type: Schema.Types.ObjectId, ref: "Product"},
            quantity: {type: Number}}   
        ]
    }]
});

UserSchema.pre("save", function (next) {
    var user = this;
    
   if(!user.isModified("password")) return next();
   bcrypt.genSalt(10, function (err, salt) {
      if(err) return next(err);
      bcrypt.hash(user.password, salt, null, function (err, hash) {
          if(err) return next(err);
          user.password = hash;
          next();
      }); 
   }); 
    
});

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.virtual("fullName").get(function () {
    return this.profile.firstName + " " + this.profile.lastName;
}).set(function(fullName) {
    var splitName = fullName.split(' ');
    this.profile.firstName = splitName[0] || '';
    this.profile.lastName = splitName[1] || '';
});

UserSchema.methods.gravatar = function (size) {
    if(!this.size) size = 200;
    if(!this.email) return "https://gravatar.com/avatar/?s" + size + "&d=retro";
    var md5 = crypto.createHash("md5").update(this.email).digest("hex");
    return "https://gravatar.com/avatar/" + md5 + "?s=" + size + "&d=retro";
};

UserSchema.set("toJSON", {setters: true, virtuals: true});

module.exports = mongoose.model("User", UserSchema);

