let User = require('../models/odm/userDB/users')
let mongoose = require('mongoose')
let passport = require('passport')
let usersDAL = require('../models/dals/usersDAL')

module.exports.displayHomePage = function (req, res, next) {
  return res.redirect('/login')
}

module.exports.displayManageUsersPage = function (req, res, next) {
  return res.redirect('/users')
}

module.exports.displayLogin = function (req, res, next) {
  // check if user already logged in
  if (!req.user) {
    return res.render('layout', {
      page: 'contentMain/login',
      messages: req.flash('loginMessage'),
    })
  } else {
    return res.redirect('/movies')
  }
}

module.exports.performLogout = (req, res, next) => {
  req.logout()
  return res.redirect('/login')
}

module.exports.processLoginPage = async (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    // server error
    if (err) {
      return next(err)
    }
    if (!user) {
      req.flash('loginMessage', 'Athentication Error')
      return res.redirect('/login')
    }

    req.logIn(user, async (err) => {
      // another type of server error
      if (err) {
        return next(err)
      }

      //set timeout to the user session.
      let userDetails = await usersDAL.getUserById(user._id)
      let sessionTimeout = userDetails.sessionTimeOut
      if (sessionTimeout) {
        req.session.cookie.originalMaxAge =
          parseFloat(sessionTimeout) * 1000 * 60
      }
      // all is good - login
      return res.redirect('/movies')
    })
  })(req, res, next)
}

module.exports.displayCreateAccount = function (req, res, next) {
  // check if user already logged in
  if (!req.user) {
    res.render('layout', {
      page: 'contentMain/createAccount',
      messages: req.flash('registerMessage'),
    })
  } else {
    return res.redirect('/movies')
  }
}

module.exports.performCreateAccount = (req, res, next) => {
  // check if the user exits in the db.
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      console.log(err)
      return res.end()
    }
    if (!user) {
      req.flash('registerMessage', 'username not found')
      return res.redirect('/createAccount')
    }
    // setup password for the user account
    user.setPassword(req.body.password, function (err) {
      if (err) {
        console.log(err)
        return res.end()
      }
      user.save(function (err) {
        if (err) {
          console.log(err)
          return res.end()
        } else {
          return res.redirect('/login')
        }
      })
    })
  })
}
