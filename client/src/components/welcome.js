// WelcomePage.js

import React, { useState } from 'react';
import RegistrationForm from './RegistrationForm.js';
import LoginForm from './login.js';
import '../stylesheets/index.css'
import Home from './home.js';

const WelcomePage = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [isGuest, setIsGuest] = useState(false);


  const handleLogout = () => {
    setShowHome(false);
    setIsGuest(false);
  };
  
  const handleRegisterClick = () => {
    setShowRegistration(true);
    setShowLogin(false);
    // console.log('Registration data:', formData);
  };

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegistration(false);
  };

  const handleBackClick = () => {
    setShowRegistration(false);
    setShowLogin(false);
  };

  const handleGuestClick = () => {
    console.log('Continue as a Guest clicked');
    setIsGuest(true);
    setShowHome(true);
  };

  const handleSuccessLogin = () => {
    setShowHome(true);
    setShowLogin(false);
  }


  return (
    <>
      {!showHome && (
        <div>
          <div className='header'>
            <h1 id='title'>Fake Stack Overflow</h1>
          </div>
          {!showRegistration && !showLogin && (
            <div className='home'>
              <p>Welcome,Please choose an option:</p>
      
              <div className='register-user-home'>
                <button id='register-button' className='button-util' onClick={handleRegisterClick}>Register as a new user</button>
              </div>
      
              <div className='login-user-home'>
                <button id='login-button' className='button-util' onClick={handleLoginClick}>Login as an existing user</button>
              </div>
      
              <div className='guest-user-home'>
                <button id='guest-button' className='button-util' onClick={handleGuestClick}>Continue as a guest</button>
              </div>
            </div>
          )}
        </div>
      )}
  
      {showRegistration && <RegistrationForm onRegister={handleLoginClick} />}
      {showLogin && <LoginForm onLogin={handleSuccessLogin} />}

      {(showRegistration || showLogin) && (
        <div>
          <button id='back' className='button-util' onClick={handleBackClick}>Back</button>
        </div>
      )}
  
      {showHome && <Home onLogout={handleLogout} isGuest={isGuest}/>}
    </>
  );  
};

export default WelcomePage;
