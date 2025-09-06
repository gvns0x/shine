import React, { useState } from 'react';
import './controls.css'

const Controls = ({ onValuesChange }) => {
    const [selectedColor, setSelectedColor] = useState('D');
    const [selectedClarity, setSelectedClarity] = useState('IF');
    const [carat, setCarat] = useState('');
    const [price, setPrice] = useState('');
    const [priceUnit, setPriceUnit] = useState('L'); // L for lakhs, K for thousands

    const colorOptions = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
    const clarityOptions = ['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'SI3', 'I1', 'I2', 'I3'];

    const handleCaratChange = (e) => {
        const newCarat = e.target.value;
        setCarat(newCarat);
        if (onValuesChange) {
            // Convert current price based on selected unit
            let actualPrice = price;
            if (price && !isNaN(price)) {
                if (priceUnit === 'L') {
                    actualPrice = parseFloat(price) * 100000;
                } else if (priceUnit === 'K') {
                    actualPrice = parseFloat(price) * 1000;
                }
            }
            onValuesChange({ carat: newCarat, price: actualPrice, color: selectedColor, clarity: selectedClarity });
        }
    };

    const handlePriceChange = (e) => {
        const newPrice = e.target.value;
        setPrice(newPrice);
        
        // Convert price based on selected unit
        let actualPrice = newPrice;
        if (newPrice && !isNaN(newPrice)) {
            if (priceUnit === 'L') {
                actualPrice = parseFloat(newPrice) * 100000; // Convert lakhs to actual amount
            } else if (priceUnit === 'K') {
                actualPrice = parseFloat(newPrice) * 1000; // Convert thousands to actual amount
            }
        }
        
        if (onValuesChange) {
            onValuesChange({ carat, price: actualPrice, color: selectedColor, clarity: selectedClarity });
        }
    };

    const handleColorChange = (color) => {
        setSelectedColor(color);
        if (onValuesChange) {
            // Convert current price based on selected unit
            let actualPrice = price;
            if (price && !isNaN(price)) {
                if (priceUnit === 'L') {
                    actualPrice = parseFloat(price) * 100000;
                } else if (priceUnit === 'K') {
                    actualPrice = parseFloat(price) * 1000;
                }
            }
            onValuesChange({ carat, price: actualPrice, color, clarity: selectedClarity });
        }
    };

    const handleClarityChange = (clarity) => {
        setSelectedClarity(clarity);
        if (onValuesChange) {
            // Convert current price based on selected unit
            let actualPrice = price;
            if (price && !isNaN(price)) {
                if (priceUnit === 'L') {
                    actualPrice = parseFloat(price) * 100000;
                } else if (priceUnit === 'K') {
                    actualPrice = parseFloat(price) * 1000;
                }
            }
            onValuesChange({ carat, price: actualPrice, color: selectedColor, clarity });
        }
    };

    const handlePriceUnitChange = (unit) => {
        setPriceUnit(unit);
        if (onValuesChange && price) {
            // Convert current price based on new unit
            let actualPrice = price;
            if (price && !isNaN(price)) {
                if (unit === 'L') {
                    actualPrice = parseFloat(price) * 100000;
                } else if (unit === 'K') {
                    actualPrice = parseFloat(price) * 1000;
                }
            }
            onValuesChange({ carat, price: actualPrice, color: selectedColor, clarity: selectedClarity });
        }
    };

    return (
        <div className='controls'>
            <input 
                className='ct' 
                placeholder='ct' 
                value={carat}
                onChange={handleCaratChange}
                type="number"
            ></input>
            
            <div className='slider-container'>
                {colorOptions.map(color => (
                    <div
                        key={color}
                        className={`slider-option ${selectedColor === color ? 'selected' : ''}`}
                        onClick={() => handleColorChange(color)}
                    >
                        {color}
                    </div>
                ))}
            </div>

            <div className='slider-container'>
                {clarityOptions.map(clarity => (
                    <div
                        key={clarity}
                        className={`slider-option ${selectedClarity === clarity ? 'selected' : ''}`}
                        onClick={() => handleClarityChange(clarity)}
                    >
                        {clarity}
                    </div>
                ))}
            </div>

            <div className='price-container'>
                <input 
                    className='price' 
                    placeholder='price' 
                    value={price}
                    onChange={handlePriceChange}
                    type="number"
                ></input>
                <div className='price-unit-toggle'>
                    <button 
                        className={`unit-btn ${priceUnit === 'L' ? 'selected' : ''}`}
                        onClick={() => handlePriceUnitChange('L')}
                    >
                        L
                    </button>
                    <button 
                        className={`unit-btn ${priceUnit === 'K' ? 'selected' : ''}`}
                        onClick={() => handlePriceUnitChange('K')}
                    >
                        K
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Controls;
