const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const UsersModel = require('./models/Users')

const app = express()
app.use(express.json())
app.use(cors())

mongoose
  .connect('mongodb://127.0.0.1:27017/AnimalTracker')
  .then(() => console.log('mongoDB connected'))
  .catch((err) => console.log('mongoDB error'))

app.get('/alluser', (req, res) => {
  UsersModel.find()
    .then((users) => res.send(users))
    .catch((err) => res.send(err))
})

app.post('/addAnimal', (req, res) => {
  const {
    email,
    newAnimalName,
    nearestBorder,
    mainBorder,
    shape,
    newAnimalLat,
    newAnimalLng,
  } = req.body
  UsersModel.findOne({ userEmail: email }).then((user) => {
    if (user) {
      const newAnimal = {
        name: newAnimalName,
        positions: [[newAnimalLat, newAnimalLng]],
        icon: 'https://cdn-icons-png.flaticon.com/512/147/147144.png',
      }
      user.allAnimals.push(newAnimal)
      user.border.nearestBorder = nearestBorder
      user.border.mainBorder = mainBorder
      user.border.shape = shape
      user.save()
      res.send(user)
    } else {
      res.json('User not exist')
    }
  })
})

app.post('/register', (req, res) => {
  UsersModel.create(req.body)
    .then((user) => res.send(user))
    .catch((err) => res.send(err))
})

app.post('/login', (req, res) => {
  const { userEmail, userPassword } = req.body
  UsersModel.findOne({ userEmail: userEmail }).then((user) => {
    if (user) {
      if (user.userPassword === userPassword) {
        res.send('Success')
      } else {
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
