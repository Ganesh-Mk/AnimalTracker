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
  const { email, newAnimalName, newAnimalLat, newAnimalLng } = req.body

  console.log('Incoming request:', req.body)

  UsersModel.findOne({ userEmail: email })
    .then((user) => {
      if (user) {
        console.log('User found:', user.userEmail)
        console.log("User's animals before adding:", user.allAnimals)

        const newAnimal = {
          name: newAnimalName,
          positions: [[newAnimalLat, newAnimalLng]],
          icon: 'https://cdn-icons-png.flaticon.com/512/4775/4775679.png',
        }

        user.allAnimals.push(newAnimal)
        user
          .save()
          .then((savedUser) => {
            console.log("User's animals after adding:", savedUser.allAnimals)
            res.send(savedUser)
          })
          .catch((saveErr) => {
            console.error('Error saving user:', saveErr)
            res.status(500).json({ error: 'Error saving user' })
          })
      } else {
        console.log('User not exist')
        res.status(404).json({ error: 'User not exist' })
      }
    })
    .catch((err) => {
      console.error('Error finding user:', err)
      res.status(500).json({ error: 'Error finding user' })
    })
})

app.post('/setBorderPosition', (req, res) => {
  const { email, shape, mainBorder, nearestBorder, centerPosition } = req.body
  UsersModel.findOne({ userEmail: email }).then((user) => {
    if (user) {
      user.border.shape = shape
      user.border.mainBorder = mainBorder
      user.border.nearestBorder = nearestBorder
      user.border.centerPosition = centerPosition
      user.save()
      res.send(user)
    } else {
      res.json('User not exist')
    }
  })
})

app.post('/setOwner', (req, res) => {
  const { email, ownerLocation, ownerName } = req.body
  UsersModel.findOne({ userEmail: email }).then((user) => {
    if (user) {
      user.userLocation = ownerLocation
      user.userName = ownerName
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
