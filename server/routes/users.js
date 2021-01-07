var express = require("express");
var router = express.Router();
let usersController = require("../controllers/usersController");

// local authentication function

function requireAuth(req, res, next) {
  // check if the user is logged in
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
}

router.get("/", requireAuth, usersController.displayUsers);

router.get("/add", requireAuth, usersController.displayAddUser);

router.post("/add", requireAuth, usersController.performAddUser);

router.get("/edit/:id", requireAuth, usersController.displayEditUser);

router.post("/edit/:id", requireAuth, usersController.performEditUser);

router.get("/delete/:id", requireAuth, usersController.performDeleteUser);

module.exports = router;
