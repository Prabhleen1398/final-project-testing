// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import React from 'react';
import WelcomePage from './components/welcome.js';

function App() {

  return (
    <section className="fakeso">
      <WelcomePage/>
    </section>
  );
}

export default App;
