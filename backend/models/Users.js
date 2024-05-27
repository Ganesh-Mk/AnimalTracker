const mongoose = require('mongoose')

const UsersSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  userPassword: String,
  allAnimals: [
    {
      name: String,
      walked: [[Number]],
    },
  ],
  border: {
    mainBorder: Number,
    nearestBorder: Number,
  },
})

const UsersModel = mongoose.model('users', UsersSchema)
module.exports = UsersModel
