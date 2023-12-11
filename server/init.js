// Setup database with initial test data.
// server/init.js

const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your_database', { useNewUrlParser: true, useUnifiedTopology: true });

// Insert initial data
const initialUsers = [
  { username: 'user1', password: 'password1'},
  { username: 'user2', password: 'password2'},
  // Add more initial users as needed
];

User.insertMany(initialUsers)
  .then(() => {
    console.log('Initial data inserted successfully');
  })
  .catch((error) => {
    console.error('Error inserting initial data:', error);
  })
  .finally(() => {
    // Close the connection
    mongoose.connection.close();
  });
