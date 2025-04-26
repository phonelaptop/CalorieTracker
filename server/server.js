const express = require('express');
const {connectToDatabase} = require('./db/db');
const { userRoutes } = require('./routes/userRoutes');
const { nutritionRoutes } = require('./routes/nutritionRoutes');
const { exerciseRoutes } = require('./routes/exerciseRoutes')

const app = express();
app.use(express.json());
const port = 3000;

const server = async () => {
  await connectToDatabase()
  
  app.use('/api/users', userRoutes);
  app.use('/api/nutrition', nutritionRoutes);
  app.use('/api/exercise', exerciseRoutes)

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

server()