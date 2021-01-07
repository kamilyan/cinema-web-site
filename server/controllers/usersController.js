let userModel = require('../models/odm/userDB/users')
let usersDAL = require('../models/dals/usersDAL')
let permissionDAL = require('../models/dals/permissionsDAL')

module.exports.displayUsers = function (req, res, next) {
  try {
    userModel.find(async (err, usersDB) => {
      if (err) {
        console.error(err)
        return res.end()
      } else {
        let users = []
        for (user of usersDB) {
          users.push({ id: user.id, username: user.username })
        }

        users = await Promise.all(
          users.map(async (user) => {
            let userData = await usersDAL.getUserById(user.id)
            let userPermission = await permissionDAL.getUserById(user.id)
            return {
              id: user.id,
              name: userData.firstName + ' ' + userData.lastName,
              username: user.username,
              sessionTimeOut: userData.sessionTimeOut,
              createdData: userData.createdData,
              permissions: userPermission.permissions,
            }
          })
        )

        return res.render('layout', {
          page: 'users/allUsers',
          usersDetails: users,
        })
      }
    })
  } catch (error) {
    console.log(error)
    return res.end()
  }
}

module.exports.displayEditUser = async function (req, res, next) {
  try {
    let user = await userModel.findById(req.params.id)
    let userData = await usersDAL.getUserById(req.params.id)
    let userPermission = await permissionDAL.getUserById(req.params.id)
    user_Details = {
      id: user._id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: user.username,
      sessionTimeOut: userData.sessionTimeOut,
      createdData: userData.createdData,
      permissions: userPermission.permissions,
    }
    return res.render('layout', {
      page: 'users/editUser',
      userDetails: user_Details,
    })
  } catch (error) {
    console.log(error)
    return res.end()
  }
}

module.exports.performEditUser = async function (req, res, next) {
  try {
    let editedUserDB = await userModel.findById(req.params.id)

    let editedUserData = {
      id: req.params.id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      createdData: req.body.createdData,
      sessionTimeOut: req.body.sessionTimeOut,
    }

    let editedUserPermission = [
      req.body.viewSubscriptions,
      req.body.createSubscriptions,
      req.body.deleteSubscriptions,
      req.body.updateSubscriptions,
      req.body.viewMovies,
      req.body.createMovies,
      req.body.deleteMovies,
      req.body.updateMovies,
    ].filter((item) => item) // remove empty strings

    let updatedUserPermission = {
      id: req.params.id,
      permissions: editedUserPermission,
    }

    editedUserDB.save(async (err) => {
      if (err) {
        console.log(err)
        return res.end(err)
      } else {
        let usersObj = await usersDAL.getUsers()
        usersObj.users = usersObj.users.map((user) => {
          if (user.id == req.params.id) return editedUserData
          else return user
        })
        await usersDAL.saveUsers(usersObj)
        let permissionsObj = await permissionDAL.getUsers()
        permissionsObj.users = permissionsObj.users.map((permission) => {
          if (permission.id == req.params.id) return updatedUserPermission
          else return permission
        })
        await permissionDAL.saveUsers(permissionsObj)

        return res.redirect('/users')
      }
    })
  } catch (error) {
    console.log(error)
    return res.end()
  }
}

module.exports.performDeleteUser = function (req, res, next) {
  try {
    userModel.findOneAndRemove({ _id: req.params.id }, async function (err) {
      if (err) {
        console.log(err)
        return res.end()
      }
      await usersDAL.deleteUserById(req.params.id)
      await permissionDAL.deleteUserById(req.params.id)

      return res.redirect('/users')
    })
  } catch (error) {
    console.log(error)
    return res.end()
  }
}

module.exports.displayAddUser = function (req, res, next) {
  res.render('layout', { page: 'users/addUser' })
}

module.exports.performAddUser = async function (req, res, next) {
  let newUserDB

  try {
    newUserDB = userModel({ username: req.body.username })
  } catch (error) {
    console.log(error)
    return res.end()
  }

  let newUserData = {
    id: newUserDB._id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    createdData: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
    sessionTimeOut: req.body.sessionTimeOut,
  }
  let userPermission = [
    req.body.viewSubscriptions,
    req.body.createSubscriptions,
    req.body.deleteSubscriptions,
    req.body.updateSubscriptions,
    req.body.viewMovies,
    req.body.createMovies,
    req.body.deleteMovies,
    req.body.updateMovies,
  ].filter((item) => item) // remove empty strings

  let newUserPermission = {
    id: newUserDB._id,
    permissions: userPermission,
  }

  try {
    userModel.create(newUserDB, async (err, userModel) => {
      if (err) {
        console.log(err)
        return res.end(err)
      } else {
        let usersObj = await usersDAL.getUsers()
        usersObj.users.push(newUserData)
        await usersDAL.saveUsers(usersObj)

        let permissionsObj = await permissionDAL.getUsers()
        permissionsObj.users.push(newUserPermission)
        await permissionDAL.saveUsers(permissionsObj)

        return res.redirect('/users')
      }
    })
  } catch (error) {
    console.log(error)
    return res.end()
  }
}
