import React from 'react';
import './App.css';
import Input from './components/Input'; // Ensure you import the Input component
import GetCurrentAddress from './components/GetCurrentAddress';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Disaster Information Verification</h1>
        <p>Empowering the public with reliable, verified information during crisis.</p>
        <button className="get-help-button">Get Help</button>
      </header>
      {/* <div className="Chatbot-container">
        <Chatbot />
      </div> */}
      <button className='sos-button'>SOS</button>
      <div className="input-container">
        <label className="text-sm"></label>
        <Input />
        
      </div>
      <button className="submit-button">Submit</button>
      <div>
      <GetCurrentAddress />
        
      </div>
    </div>
  );
}

export default App;
