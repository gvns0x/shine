import React, { useState } from 'react';
import './controls.css'

const Controls = () => {
    const [selectedColor, setSelectedColor] = useState('D');
    const [selectedClarity, setSelectedClarity] = useState('IF');

    const colorOptions = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
    const clarityOptions = ['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'SI3', 'I1', 'I2', 'I3'];

    return (
        <div className='controls'>
            <input className='ct' placeholder='ct'></input>
            
            <div className='slider-container'>
                {colorOptions.map(color => (
                    <div
                        key={color}
                        className={`slider-option ${selectedColor === color ? 'selected' : ''}`}
                        onClick={() => setSelectedColor(color)}
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
                        onClick={() => setSelectedClarity(clarity)}
                    >
                        {clarity}
                    </div>
                ))}
            </div>

            <input className='price' placeholder='price'></input>
        </div>
    );
};

export default Controls;
