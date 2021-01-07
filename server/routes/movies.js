var express = require("express");
var router = express.Router();
let moviesController = require("../controllers/moviesController");

// local authentication function

function requireAuth(req, res, next) {
  // check if the user is logged in
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
}

router.get("/", requireAuth, moviesController.displayMovies);

router.get("/add", requireAuth, moviesController.displayAddMovie);

router.get("/:id", requireAuth, moviesController.displayMovie);

router.post("/add", requireAuth, moviesController.performAddMovie);

router.get("/edit/:id", requireAuth, moviesController.displayEditMovie);

router.post("/edit/:id", requireAuth, moviesController.performEditMovie);

router.get("/delete/:id", requireAuth, moviesController.performDeleteMovie);

module.exports = router;
