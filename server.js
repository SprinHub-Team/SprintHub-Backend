const express = require('express');
const dontenv = require('dotenv');
dontenv.config();
const app = express();
const port = process.env.PORT;

// Middleware to parse JSON requests
app.use(express.json());

// Sample route
app.get('/hello', (req, res) => {
app.get('/hello', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
  console.log(`El servidor esta en el puerto ${port}`);
  console.log(`El servidor esta en el puerto ${process.env.PORT}`);
});