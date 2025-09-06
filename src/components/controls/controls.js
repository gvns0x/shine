import React, { useState } from 'react';
import './controls.css'

const Controls = ({ onValuesChange }) => {
    const [selectedColor, setSelectedColor] = useState('D');
    const [selectedClarity, setSelectedClarity] = useState('IF');
    const [carat, setCarat] = useState('');
    const [price, setPrice] = useState('');

    const colorOptions = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
    const clarityOptions = ['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'SI3', 'I1', 'I2', 'I3'];

    const handleCaratChange = (e) => {
        const newCarat = e.target.value;
        setCarat(newCarat);
        if (onValuesChange) {
            onValuesChange({ carat: newCarat, price, color: selectedColor, clarity: selectedClarity });
        }
    };

    const handlePriceChange = (e) => {
        const newPrice = e.target.value;
        setPrice(newPrice);
        if (onValuesChange) {
            onValuesChange({ carat, price: newPrice, color: selectedColor, clarity: selectedClarity });
        }
    };

    const handleColorChange = (color) => {
        setSelectedColor(color);
        if (onValuesChange) {
            onValuesChange({ carat, price, color, clarity: selectedClarity });
        }
    };

    const handleClarityChange = (clarity) => {
        setSelectedClarity(clarity);
        if (onValuesChange) {
            onValuesChange({ carat, price, color: selectedColor, clarity });
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

            <input 
                className='price' 
                placeholder='price' 
                value={price}
                onChange={handlePriceChange}
                type="number"
            ></input>
        </div>
    );
};

export default Controls;
