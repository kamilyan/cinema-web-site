let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");

// modules for authentication
let session = require("express-session");
let passport = require("passport");
let passportLocal = require("passport-local");
let localStrategy = passportLocal.Strategy;
let flash = require("connect-flash");

let indexRouter = require("../routes/index");
let usersRouter = require("../routes/users");
let moviesRouter = require("../routes/movies");
let subscriptionsRouter = require("../routes/subscriptions");

require("./seed");

let app = express();

// database setup
let mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
let DB = require("./db");

mongoose.connect(DB.URI, { useNewUrlParser: true, useUnifiedTopology: true });

let mongoDB = mongoose.connection;
mongoDB.on("error", console.error.bind(console, "Connection Error: "));
mongoDB.once("open", () => {
  console.log("Connected to MongoDB...");
});
mongoDB.once("disconnected", () => {
  console.log("Disconnected from MongoDB...");
});

// view engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../../public")));

// setup express-session
app.use(
  session({
    secret: "someSecret",
    saveUninitialized: false,
    resave: false,
  })
);

// intialize flash
app.use(flash());

// intialize passport
app.use(passport.initialize());
app.use(passport.session());

// passport user configuration
let userModel = require("../models/odm/userDB/users");
let User = userModel; // create an alias for the User object

// implement a user authentication strategy
passport.use(User.createStrategy());

// serialize and deserialize the user info
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/movies", moviesRouter);
app.use("/subscriptions", subscriptionsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
