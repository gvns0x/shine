import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import Display from './components/display/display';
import Controls from './components/controls/controls';

function App() {
  const [values, setValues] = useState({
    carat: '',
    price: '',
    color: 'D',
    clarity: 'IF'
  });

  const handleValuesChange = (newValues) => {
    setValues(newValues);
  };

  return (
    <div className="App">
      <Display values={values}/>
      <Controls onValuesChange={handleValuesChange}/>
    </div>
  );
}

export default App;
