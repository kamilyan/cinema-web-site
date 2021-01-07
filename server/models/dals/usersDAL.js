const jsonfile = require("jsonfile");

module.exports.getUsers = getAllUsers;

function getAllUsers() {
  return new Promise((resolve) => {
    jsonfile.readFile(__dirname + "/../dataSource/users.json", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports.saveUsers = saveAllUsers;

function saveAllUsers(users) {
  return new Promise((resolve) => {
    jsonfile.writeFile(
      __dirname + "/../dataSource/users.json",
      users,
      (err) => {
        if (err) {
          console.log(err);
        } else {
          resolve();
        }
      }
    );
  });
}

module.exports.getUserById = function (id) {
  return new Promise((resolve) => {
    jsonfile.readFile(__dirname + "/../dataSource/users.json", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        let index = data.users.findIndex((user) => user.id == id);
        resolve(data.users[index]);
      }
    });
  });
};

module.exports.deleteUserById = async function (id) {
  let usersObj = await getAllUsers();
  let index = usersObj.users.findIndex((user) => user.id == id);
  usersObj.users.splice(index, 1);
  await saveAllUsers(usersObj);
};
