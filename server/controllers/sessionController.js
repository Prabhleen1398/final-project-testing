const mongoose = require('mongoose');
const User = require('../models/users');

const bcrypt = require('bcrypt');

//POST check uniqueness before register
const checkUniqueUsername = async (req, res) => {
    const { username, email } = req.body;
  
    try {
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  
      if (existingUser) {
        return res.json({ isUnique: false });
      }
  
      res.json({ isUnique: true });
    } catch (error) {
      console.error('Error checking uniqueness:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  //POST Register new user
  const registerUser =  async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Hash the password before saving it to the database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Save the new user to the database
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        register_date: new Date(),
        reputation: 0
      });
  
      await newUser.save();
  
      res.json({ success: 'User registered successfully' });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // POST method for login
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
      // Find the user by username
      const user = await User.findOne({ username });
  
      // If the user is not found or the password is incorrect, return an error
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid username/password' });
      }
  
      //start session once login is successful
      req.session["currentuser"] = {
        id: user._id,
        username: user.username,
        reputation: user.reputation,
        register_date: user.register_date
      };
      // console.log(req.session.user);
      // res.cookie(req.session.user.id);
      res.json({success: 'Login successful'});
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const sessionDetails = (req, res) => {
    // Check if the user is logged in (session exists)
    // const fakesoCookie = req.cookies['fakeso'];
    console.log(req.session["currentuser"]);
    if (req.session["currentuser"]) {
      res.json({
      user: req.session["currentuser"].username, 
      id: req.session["currentuser"].id,
      reputation: req.session["currentuser"].reputation,
      register_date: req.session["currentuser"].register_date});
    }
    else {
        res.json({ user: 'guest' });
      }
  };
    
    
    // if (req.session["currentuser"]) {
    //   const { username } = req.session.user.username;
    //   res.json({ user: username });
    // } else {
    //   res.status(401).json({ error: 'Not logged in' });
    // }

  const logoutUser = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error logging out', err);
        res.status(500).json({ message: 'Logout failed' });
      } else {
        res.json({ message: 'Logout successful' });
      }
    });
  }

  const createGuestSession = (req, res) => {
      // Create a guest user profile with a default or placeholder username
      const guestUser = {
        id: uuid.v4(),
        username: 'Guest',  // Placeholder usertype for guests
      };
    
      // Generate a session identifier/token for the guest user
      req.session.user = guestUser;
    
      res.json({ success: true, user: guestUser });
  }
  module.exports = 
  {checkUniqueUsername, 
    registerUser,
    loginUser, 
    sessionDetails,
    logoutUser, 
    createGuestSession}