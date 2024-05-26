const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  userPassword: String,
});

const UsersModel = mongoose.model("users", UsersSchema);
module.exports = UsersModel;
