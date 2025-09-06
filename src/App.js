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
    
    // Available ranges in the diamond data (including new ranges from 0.01-0.89)
    if (caratNum >= 0.01 && caratNum <= 0.03) return '0.01-0.03';
    if (caratNum >= 0.04 && caratNum <= 0.07) return '0.04-0.07';
    if (caratNum >= 0.08 && caratNum <= 0.14) return '0.08-0.14';
    if (caratNum >= 0.15 && caratNum <= 0.17) return '0.15-0.17';
    if (caratNum >= 0.18 && caratNum <= 0.22) return '0.18-0.22';
    if (caratNum >= 0.23 && caratNum <= 0.29) return '0.23-0.29';
    if (caratNum >= 0.30 && caratNum <= 0.39) return '0.30-0.39';
    if (caratNum >= 0.40 && caratNum <= 0.49) return '0.40-0.49';
    if (caratNum >= 0.50 && caratNum <= 0.69) return '0.50-0.69';
    if (caratNum >= 0.70 && caratNum <= 0.89) return '0.70-0.89';
    if (caratNum >= 0.90 && caratNum <= 0.99) return '0.90-0.99';
    if (caratNum >= 1.00 && caratNum <= 1.49) return '1.00-1.49';
    if (caratNum >= 1.50 && caratNum <= 1.99) return '1.50-1.99';
    if (caratNum >= 2.00 && caratNum <= 2.99) return '2.00-2.99';
    if (caratNum >= 3.00 && caratNum <= 3.99) return '3.00-3.99';
    if (caratNum >= 4.00 && caratNum <= 4.99) return '4.00-4.99';
    if (caratNum >= 5.00 && caratNum <= 5.99) return '5.00-5.99';
    if (caratNum >= 10.00 && caratNum <= 10.99) return '10.00-10.99';
    
    // For carats outside available ranges, return null
    return null;
  };

  // Function to get price per carat from diamond data
  const getPricePerCarat = (carat, color, clarity) => {
    const caratRange = getCaratRange(carat);
    if (!caratRange) return 0;
    
    const rangeData = diamondPrices.caratRanges[caratRange];
    if (!rangeData) return 0;
    
    // Handle grouped colors (for ranges 0.01-0.29)
    if (rangeData.groupedColors) {
      const colorGroup = getColorGroup(color);
      const clarityGroup = getClarityGroup(clarity);
      
      if (!colorGroup || !clarityGroup || !rangeData.groupedColors[colorGroup] || !rangeData.groupedColors[colorGroup][clarityGroup]) {
        return 0;
      }
      
      return rangeData.groupedColors[colorGroup][clarityGroup];
    }
    
    // Handle individual colors (for ranges 0.30+)
    if (rangeData.individualColors) {
      if (!rangeData.individualColors[color] || !rangeData.individualColors[color][clarity]) {
        return 0;
      }
      
      return rangeData.individualColors[color][clarity];
    }
    
    return 0;
  };

  // Helper function to map individual colors to color groups
  const getColorGroup = (color) => {
    if (['D', 'E', 'F'].includes(color)) return 'D-F';
    if (['G', 'H'].includes(color)) return 'G-H';
    if (['I', 'J'].includes(color)) return 'I-J';
    if (['K', 'L'].includes(color)) return 'K-L';
    if (['M', 'N'].includes(color)) return 'M-N';
    return null;
  };

  // Helper function to map individual clarities to clarity groups
  const getClarityGroup = (clarity) => {
    if (['IF', 'VVS1', 'VVS2'].includes(clarity)) return 'IF-VVS';
    if (['VS1', 'VS2'].includes(clarity)) return 'VS';
    return clarity; // SI1, SI2, SI3, I1, I2, I3 remain the same
  };

  // Calculate dynamic rap price
  const calculateRapPrice = (carat, color, clarity) => {
    const pricePerCarat = getPricePerCarat(carat, color, clarity);
    const caratNum = parseFloat(carat);
    if (!pricePerCarat || !caratNum) return 0;
    
    return pricePerCarat * 100 * 88.5 * caratNum;
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
