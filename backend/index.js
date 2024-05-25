const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const app = express()

app.get('/', (req, res) => {
  res.send('Hello, World!')
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
