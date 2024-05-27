import React, { useState } from 'react';
import NavbarComponent from './Components/navbar';
import Timeline from './Components/timeline';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'} style={{ minHeight: '100vh' }}>
      <NavbarComponent theme={theme} toggleTheme={toggleTheme} />
      <div className="pt-5">
      <Timeline theme={theme} />
      </div>
    </div>
  );
};

export default App;
