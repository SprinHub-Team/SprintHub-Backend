const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = process.env.PORT;

// Middleware to parse JSON requests
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/data', (req, res) => {
  const sampleData = {
    message: 'This is some sample data from the server.',
  }
  res.json(sampleData);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});