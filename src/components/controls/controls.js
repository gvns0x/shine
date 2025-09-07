import React, { useState, useRef } from 'react';
import './controls.css'

const Controls = ({ onValuesChange }) => {
    const [selectedColor, setSelectedColor] = useState('D');
    const [selectedClarity, setSelectedClarity] = useState('IF');
    const [carat, setCarat] = useState('');
    const [price, setPrice] = useState('');
    const [priceUnit, setPriceUnit] = useState('L'); // L for lakhs, K for thousands
    
    // Refs for input fields
    const caratInputRef = useRef(null);
    const priceInputRef = useRef(null);

    const colorOptions = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
    const clarityOptions = ['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'SI3', 'I1', 'I2', 'I3'];

    // Function to handle input focus and ensure visibility on mobile
    const handleInputFocus = (inputRef) => {
        if (inputRef.current) {
            // Add class to body to prevent scrolling on mobile
            document.body.classList.add('input-focused');
            
            // Small delay to ensure the keyboard has appeared
            setTimeout(() => {
                inputRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });
            }, 300);
        }
    };

    // Function to handle input blur and restore normal scrolling
    const handleInputBlur = () => {
        // Remove class from body to restore normal scrolling
        document.body.classList.remove('input-focused');
    };

    const handleCaratChange = (e) => {
        let newCarat = e.target.value.replace(',', '.'); // Convert comma to dot
        
        // Allow empty string, single dot, or valid numbers
        if (newCarat === '' || newCarat === '.' || newCarat === '0.' || !isNaN(newCarat)) {
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
                
                // Only pass valid numeric carat values for calculations
                let caratForCalculation = newCarat;
                if (newCarat && newCarat !== '.' && !isNaN(newCarat)) {
                    caratForCalculation = parseFloat(newCarat).toString();
                }
                
                onValuesChange({ carat: caratForCalculation, price: actualPrice, color: selectedColor, clarity: selectedClarity });
            }
        }
    };

    const handlePriceChange = (e) => {
        let newPrice = e.target.value.replace(',', '.'); // Convert comma to dot
        
        // Allow empty string, single dot, or valid numbers
        if (newPrice === '' || newPrice === '.' || newPrice === '0.' || !isNaN(newPrice)) {
            setPrice(newPrice);
            
            // Convert price based on selected unit
            let actualPrice = newPrice;
            if (newPrice && newPrice !== '.' && !isNaN(newPrice)) {
                if (priceUnit === 'L') {
                    actualPrice = parseFloat(newPrice) * 100000; // Convert lakhs to actual amount
                } else if (priceUnit === 'K') {
                    actualPrice = parseFloat(newPrice) * 1000; // Convert thousands to actual amount
                }
            }
            
            if (onValuesChange) {
                onValuesChange({ carat, price: actualPrice, color: selectedColor, clarity: selectedClarity });
            }
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
                ref={caratInputRef}
                className='ct' 
                placeholder='Carats' 
                value={carat}
                onChange={handleCaratChange}
                onFocus={() => handleInputFocus(caratInputRef)}
                onBlur={handleInputBlur}
                type="text"
                inputMode="decimal"
                lang="en-US"
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
                    ref={priceInputRef}
                    className='price' 
                    placeholder='Seller price' 
                    value={price}
                    onChange={handlePriceChange}
                    onFocus={() => handleInputFocus(priceInputRef)}
                    onBlur={handleInputBlur}
                    type="text"
                    inputMode="decimal"
                    lang="en-US"
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
