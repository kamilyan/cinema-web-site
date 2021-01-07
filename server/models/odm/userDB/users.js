let mongoose = require("mongoose");
let passportLocalMongoose = require("passport-local-mongoose");

// create a model class
let userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: "username is required",
    },
    /* taken out because password will be encrypted by passport-local-mongoose
    password : String
    */
  },
  {
    collection: "users",
  }
);

// configureoptions of the UserSchema

let options = {
  missingPasswordError: "Wrong / Missing Password",
};

userSchema.plugin(passportLocalMongoose, options);

module.exports = mongoose.model("User", userSchema);
