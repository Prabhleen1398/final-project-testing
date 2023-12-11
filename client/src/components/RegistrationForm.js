import React, { useState } from 'react';
import '../stylesheets/registration.css';
import {makeUrl} from './utils/makeUrl.js';
import axios from 'axios';

const RegistrationForm = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.username) {
      setErrorMessage('Username cannot be empty');
      return;
    }
    if(!formData.email) {
      setErrorMessage('Email cannot be empty');
      return;
    }
    if(!formData.password) {
      setErrorMessage('Password cannot be empty');
      return;
    }
    if(!formData.repeatPassword) {
      setErrorMessage('Please re-enter your password');
      return;
    }
    if (formData.password !== formData.repeatPassword) {
      setErrorMessage('Passwords do not match');
      // console.error('Passwords do not match');
      return;
    }

    // Check if the password contains the username or email
    if (formData.password.includes(formData.username) || formData.password.includes(formData.email)) {
      setErrorMessage('Password should not contain username or email');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Invalid email format');
      return;
    }

    try {
      const userDetails = {username: formData.username, email: formData.email};
      const response = await axios.post(makeUrl('session/check_unique/'), userDetails, {withCredentials: true});

      if (!response.data.isUnique) {
        setErrorMessage('Please use unique username/password');
        // console.error('Username or email already exists');
        return;
      }

      const createUser = {username: formData.username, email: formData.email, password: formData.password};
      // If everything is valid, send a POST request to create the user
      console.log(createUser);
      await axios.post(makeUrl('session/register/'), createUser);

      // Assuming the server responds with a success message
      // console.log(registerResponse.data);

      // Redirect to the login page after successful registration
      // history.push('/login');
    } catch (error) {
      console.error('Error during registration:', error.message);
    }

    onRegister();
  };

  return (
    <div className='register-form-div'>
      <h2>Register as a New User</h2>
      <div  className='register-form'>
        <label htmlFor="username" className='formTextInput'>
          Username*:
          <input
           className='registerInput'
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>

        <label htmlFor="formRegisterEmail" className='formTextInput'>
          Email*:
          <input
          className='registerInput'
            type="email"
            name="email"
            id="formRegisterEmail"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label htmlFor="formRegisterPassword" className='formTextInput'>
          Password*:
          <input
          className='registerInput'
            type="password"
            name="password"
            id="formRegisterPassword"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <label htmlFor="formRegisterPasswordRepeat" className='formTextInput'>
          Repeat Password*:
          <input
          className='registerInput'
            type="password"
            name="repeatPassword"
            id="formRegisterPasswordRepeat"
            value={formData.repeatPassword}
            onChange={handleChange}
            required
          />
        </label>

        <button className='button-util' id='formRegisterSubmit' type="submit" onClick={handleSubmit}>Sign Up</button>
        {errorMessage && <span className="error-message">{errorMessage}</span>}
      <div className="mandatory-field">* indicates mandatory fields</div>
      
      </div>
    </div>
  );
};

export default RegistrationForm;
