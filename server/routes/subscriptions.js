var express = require("express");
var router = express.Router();
let subscriptionsController = require("../controllers/subscriptionsController");

// local authentication function

function requireAuth(req, res, next) {
  // check if the user is logged in
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
}

router.get("/", requireAuth, subscriptionsController.displayMembers);

router.get("/add", requireAuth, subscriptionsController.displayAddMember);

router.get("/:id", requireAuth, subscriptionsController.displayMember);

router.post("/add", requireAuth, subscriptionsController.performAddMember);

router.put(
  "/addMovie/:id",
  requireAuth,
  subscriptionsController.performAddMovieToMember
);

router.get("/edit/:id", requireAuth, subscriptionsController.displayEditMember);

router.post(
  "/edit/:id",
  requireAuth,
  subscriptionsController.performEditMember
);

router.get(
  "/delete/:id",
  requireAuth,
  subscriptionsController.performDeleteMember
);

module.exports = router;
