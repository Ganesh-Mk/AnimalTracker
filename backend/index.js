const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const UsersModel = require('./models/Users')

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect('mongodb://127.0.0.1:27017/Users')

app.post('/register', (req, res) => {
  UsersModel.create(req.body)
  .then(user => res.json(user))
  .catch(err => res.json(err))

})

app.post('/login', (req, res) =>  {
  const {userEmail, userPassword} = req.body
  UsersModel.findOne({userEmail: userEmail})
    .then(user => {
      if(user) {
        if(user.userPassword === userPassword) {
          res.json('Success')
        }else {
          res.json('Password is incorrect')
        }
      } else {
        res.json('User not exist')
      }
    })
})


app.listen(3001, () => {
  console.log('Server is running')
})
