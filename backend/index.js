const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const UsersModel = require('./models/Users')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')

const app = express()
app.use(express.json())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.json({ limit: '50mb' })) // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

mongoose
  .connect('mongodb://127.0.0.1:27017/AnimalTracker')
  .then(() => console.log('mongoDB connected'))
  .catch((err) => console.log('mongoDB error'))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  },
})

const upload = multer({ storage: storage })

app.post('/addAnimal', upload.single('image'), (req, res) => {
  const {
    email,
    newAnimalName,
    newAnimalLat,
    newAnimalLng,
    iconName,
  } = req.body

  // Assuming iconName specifies the type of animal (cat, dog, lion)
  let iconUrl = ''

  console.log(iconName)
  if (iconName === 'elephant') {
    iconUrl = 'http://localhost:5173/src/images/elephant.webp'
  }
  if (iconName === 'cat') {
    iconUrl = 'http://localhost:5173/src/images/cat.png'
  }
  if (iconName === 'dog') {
    iconUrl = 'http://localhost:5173/src/images/dog.png'
  }
  if (iconName === 'lion') {
    iconUrl =
      'https://static.vecteezy.com/system/resources/previews/016/445/420/original/cute-lion-face-cartoon-icon-illustration-animal-icon-concept-isolated-flat-cartoon-style-lion-illustration-vector.jpg'
  }

  UsersModel.findOne({ userEmail: email })
    .then((user) => {
      if (user) {
        const newAnimal = {
          name: newAnimalName,
          positions: [[newAnimalLat, newAnimalLng]],
          icon: req.file ? req.file.filename : iconUrl,
        }

        UsersModel.updateOne(
          { userEmail: email },
          { $push: { allAnimals: newAnimal } },
        )
          .then(() => {
            UsersModel.findOne({ userEmail: email })
              .then((updatedUser) => {
                res.send(updatedUser)
              })
              .catch((err) => {
                console.error('Error fetching updated user:', err)
                res.status(500).json({ error: 'Error fetching updated user' })
              })
          })
          .catch((err) => {
            console.error('Error updating user:', err)
            res.status(500).json({ error: 'Error updating user' })
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

app.get('/fetchAnimalImage', (req, res) => {
  const { userEmail } = req.query

  console.log('userEmail, ', userEmail)

  UsersModel.findOne({ userEmail })
    .then((userModel) => {
      if (!userModel) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Check if the user has any animals
      if (!userModel.allAnimals || userModel.allAnimals.length === 0) {
        return res.status(404).json({ error: 'No animals found for the user' })
      }

      // Assuming you want to fetch the image URL of the first animal
      const firstAnimal = userModel.allAnimals[0].icon
      if (!firstAnimal) {
        return res
          .status(404)
          .json({ error: 'No icon found for the first animal of the user' })
      }

      res.json({ userImage: firstAnimal })
    })
    .catch((err) => res.status(500).json({ error: err.message }))
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
  console.log('Server is running')
})
