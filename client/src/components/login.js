
import React, { useState } from 'react';
import '../stylesheets/registration.css';
import axios from 'axios';
import { makeUrl } from './utils/makeUrl';

const LoginForm = ( { onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errorMessage, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate and handle login logic here
    if(!formData.username) {
      setError('Username cannot be empty');
      return;
    }
    if(!formData.password) {
      setError('Password cannot be empty');
      return;
    }

    // console.log('Login data:', formData);
    // const loginUser = {username: formData.username, }
    try {
      const loginResponse = await axios.post(makeUrl('session/login/'), formData, {withCredentials: true});

      if(loginResponse.statusText === 'OK') {
        // console.log()
        onLogin();
      }
    }
    // After successful login, you can redirect or update state
    catch (error) {
      setError('Error during Login');
      // console.error('Error during Login:', error.message);
    }
    
  };

  return (
    <div className='login-form'>
      <h2>Login as an Existing User</h2>
      <label htmlFor="formLoginName" className='formTextInput'>
          Username*:
          <input
           className='loginInput'
            type="text"
            name="username"
            id="formLoginName"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>

        <label htmlFor="formLoginPassword" className="formTitleInput">
          Password*:
          <input
          className='loginInput'
            type="password"
            name="password"
            id='formLoginPassword'
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <button className='button-util' id='formLoginSubmit' type="submit" onClick={handleSubmit}>Login</button>
        {errorMessage && <span className="error-message">{errorMessage}</span>}
        <div className="mandatory-field">* indicates mandatory fields</div>
    </div>
  );
};
export default LoginForm;
