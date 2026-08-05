const express = require('express');
const dontenv = require('dotenv');
dontenv.config();
const app = express();
const port = process.env.PORT;


app.use(express.json());

app.get('/hello', (req, res) => {
  simpleObject = {
    name: 'John Doe',
    age: 30,
    email: 'john.doe@example.com'
  };
  res.json(simpleObject);
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});