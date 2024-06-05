require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UsersModel = require('./models/Users');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const { check, validationResult } = require('express-validator');

const app = express();
const saltRounds = 10;

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Ensure the environment variable is loaded correctly
if (!process.env.MONGODB_URI) {
  console.error('Missing MONGODB_URI environment variable');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('mongoDB connected'))
  .catch((err) => {
    console.error('mongoDB error', err);
    process.exit(1);
  });

app.get('/alluser', (req, res) => {
  UsersModel.find()
    .then((users) => res.send(users))
    .catch((err) => res.send(err));
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/addAnimal', upload.single('image'), (req, res) => {
  const { email, newAnimalName, newAnimalLat, newAnimalLng } = req.body;

  UsersModel.findOne({ userEmail: email })
    .then((user) => {
      if (user) {
        const newAnimal = {
          name: newAnimalName,
          positions: [[newAnimalLat, newAnimalLng]],
          icon: req.file ? req.file.filename : 'https://cdn-icons-png.flaticon.com/512/4775/4775679.png',
        };

        UsersModel.updateOne(
          { userEmail: email },
          { $push: { allAnimals: newAnimal } }
        )
          .then(() => {
            UsersModel.findOne({ userEmail: email })
              .then((updatedUser) => {
                res.send(updatedUser);
              })
              .catch((err) => {
                logger.error('Error fetching updated user:', err);
                res.status(500).json({ error: 'Error fetching updated user' });
              });
          })
          .catch((err) => {
            logger.error('Error updating user:', err);
            res.status(500).json({ error: 'Error updating user' });
          });
      } else {
        logger.info('User not exist');
        res.status(404).json({ error: 'User not exist' });
      }
    })
    .catch((err) => {
      logger.error('Error finding user:', err);
      res.status(500).json({ error: 'Error finding user' });
    });
});

app.get('/fetchAnimalImage', (req, res) => {
  const { userEmail } = req.query;

  UsersModel.findOne({ userEmail })
    .then((userModel) => {
      if (!userModel) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!userModel.allAnimals || userModel.allAnimals.length === 0) {
        return res.status(404).json({ error: 'No animals found for the user' });
      }

      const firstAnimal = userModel.allAnimals[0].icon;
      if (!firstAnimal) {
        return res.status(404).json({ error: 'No icon found for the first animal of the user' });
      }

      res.json({ userImage: firstAnimal });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.post('/setBorderPosition', (req, res) => {
  const { email, shape, mainBorder, nearestBorder, centerPosition } = req.body;

  UsersModel.findOne({ userEmail: email }).then((user) => {
    if (user) {
      user.border.shape = shape;
      user.border.mainBorder = mainBorder;
      user.border.nearestBorder = nearestBorder;
      user.border.centerPosition = centerPosition;
      user.save()
        .then(() => res.send(user))
        .catch((err) => {
          logger.error('Error saving user:', err);
          res.status(500).json({ error: 'Error saving user' });
        });
    } else {
      res.status(404).json('User not exist');
    }
  });
});

app.post('/setOwner', (req, res) => {
  const { email, ownerLocation, ownerName } = req.body;

  UsersModel.findOne({ userEmail: email }).then((user) => {
    if (user) {
      user.userLocation = ownerLocation;
      user.userName = ownerName;
      user.save()
        .then(() => res.send(user))
        .catch((err) => {
          logger.error('Error saving user:', err);
          res.status(500).json({ error: 'Error saving user' });
        });
    } else {
      res.status(404).json('User not exist');
    }
  });
});

app.post('/register', [
  check('userEmail').isEmail().withMessage('Invalid email address'),
  check('userPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.userPassword, saltRounds);
    const user = new UsersModel({
      ...req.body,
      userPassword: hashedPassword
    });
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/login', [
  check('userEmail').isEmail().withMessage('Invalid email address'),
  check('userPassword').exists().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userEmail, userPassword } = req.body;
    const user = await UsersModel.findOne({ userEmail });
    if (user && await bcrypt.compare(userPassword, user.userPassword)) {
      res.send('Success');
    } else {
      res.status(401).json('Invalid email or password');
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3001, () => {
  console.log('Server is running');
});
