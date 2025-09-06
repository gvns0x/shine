import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import Display from './components/display/display';
import Controls from './components/controls/controls';
import diamondPrices from './diamond-prices.json';

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

  // Function to determine carat range from carat value
  const getCaratRange = (carat) => {
    const caratNum = parseFloat(carat);
    if (!caratNum || caratNum <= 0) return null;
    
    if (caratNum >= 0.90 && caratNum <= 0.99) return '0.90-0.99';
    if (caratNum >= 1.00 && caratNum <= 1.49) return '1.00-1.49';
    if (caratNum >= 1.50 && caratNum <= 1.99) return '1.50-1.99';
    if (caratNum >= 2.00 && caratNum <= 2.99) return '2.00-2.99';
    if (caratNum >= 3.00 && caratNum <= 3.99) return '3.00-3.99';
    if (caratNum >= 4.00 && caratNum <= 4.99) return '4.00-4.99';
    if (caratNum >= 5.00 && caratNum <= 5.99) return '5.00-5.99';
    if (caratNum >= 10.00 && caratNum <= 10.99) return '10.00-10.99';
    
    return null;
  };

  // Function to get price per carat from diamond data
  const getPricePerCarat = (carat, color, clarity) => {
    const caratRange = getCaratRange(carat);
    if (!caratRange) return 0;
    
    const rangeData = diamondPrices.caratRanges[caratRange];
    if (!rangeData || !rangeData.individualColors[color] || !rangeData.individualColors[color][clarity]) {
      return 0;
    }
    
    return rangeData.individualColors[color][clarity];
  };

  // Calculate dynamic rap price
  const calculateRapPrice = (carat, color, clarity) => {
    const pricePerCarat = getPricePerCarat(carat, color, clarity);
    const caratNum = parseFloat(carat);
    if (!pricePerCarat || !caratNum) return 0;
    
    return pricePerCarat * 88.5 * caratNum;
  };

  return (
    <div className="App">
      <div className='AppContainer'>
      <Display values={values} calculateRapPrice={calculateRapPrice} getPricePerCarat={getPricePerCarat}/>
      <Controls onValuesChange={handleValuesChange}/>
      </div>
    </div>
  );
}

export default App;
