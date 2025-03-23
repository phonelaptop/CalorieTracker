const express = require('express');
const {fetchUsers} = require('./db/db');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/calorieData', (req, res) => {
    fetchUsers()
    res.send('This is the calorie page')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});