var express = require('express')
var router = express.Router()
let indexController = require('../controllers/indexController')

function requireAuth(req, res, next) {
  // check if the user is logged in
  if (!req.isAuthenticated()) {
    return res.redirect('/login')
  }
  if (req.session.passport.user !== 'admin') {
    return res.redirect('/')
  }
  next()
}

/* GET home page. */
router.get('/', indexController.displayHomePage)

router.get('/manageUsers', requireAuth, indexController.displayManageUsersPage)

router.get('/login', indexController.displayLogin)

router.post('/login', indexController.processLoginPage)

router.post('/login', indexController.processLoginPage)

router.get('/logout', indexController.performLogout)

router.get('/createAccount', indexController.displayCreateAccount)

router.post('/createAccount', indexController.performCreateAccount)

module.exports = router
