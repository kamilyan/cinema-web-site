const seeder = require('mongoose-seed')
const db = require('./db')
const usersDAL = require('../models/dals/usersDAL')
const permissionsDAL = require('../models/dals/permissionsDAL')
const userModel = require('../models/odm/userDB/users')

// seeds user DB (intialize an admin)

seeder.connect(
  db.URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  async function () {
    seeder.loadModels([__dirname + '/../models/odm/userDB/users'])

    seeder.clearModels(['User'], async function () {
      let populateAdmin = getAdmin()
      seeder.populateModels([populateAdmin], async function () {
        await intializeAdminFile()
      })
    })
  }
)

function getAdmin() {
  return {
    model: 'User',
    documents: [{ username: 'admin', password: 'admin' }],
  }
}

async function intializeAdminFile() {
  userModel.find({ username: 'admin' }, async (err, user) => {
    //intialize admin.
    let adminDetails = {
      id: user[0]._id,
      firstName: 'admin',
      lastName: 'admin',
      createdData: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
      sessionTimeOut: null,
    }

    let adminPermissions = {
      id: user[0]._id,
      permissions: [
        'viewSubscriptions',
        'createSubscriptions',
        'deleteSubscriptions',
        'updateSubscriptions',
        'viewMovies',
        'createMovies',
        'deleteMovies',
        'updateMovies',
      ],
    }

    //intialize json files with admin info, everytime the system starts.
    await usersDAL.saveUsers({ users: [adminDetails] })
    await permissionsDAL.saveUsers({ users: [adminPermissions] })

    try {
      userModel.findOne({ username: 'admin' }, (err, user) => {
        // setup password for the user account
        user.setPassword('admin', () => user.save())
      })
    } catch (error) {
      console.log(error)
    }
  })
}
