import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import './display.css';
import Logo from '../../images/rupee-logo.png';
import ScreenshotIcon from '../../images/screenshot.svg'; 

function Display({ values, calculateRapPrice, getPricePerCarat }) {
  const { carat = '', price = '', color = 'D', clarity = 'IF' } = values || {};
  const [isCapturing, setIsCapturing] = useState(false);
  const [customRapPricePerCarat, setCustomRapPricePerCarat] = useState(null);
  const [isEditingRapPrice, setIsEditingRapPrice] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  // Reset custom RAP price when carat, color, or clarity changes
  useEffect(() => {
    setCustomRapPricePerCarat(null);
    setIsEditingRapPrice(false);
    setShowBottomSheet(false);
  }, [carat, color, clarity]);

  // Get rap price per carat from diamond data
  const getRapPricePerCarat = () => {
    // Use custom override if available and valid (> 0), otherwise use data from diamond-prices.json
    if (customRapPricePerCarat !== null && customRapPricePerCarat > 0) {
      return customRapPricePerCarat;
    }
    return getPricePerCarat ? getPricePerCarat(carat, color, clarity) * 100 : 0;
  };

  // Calculate price per carat from seller price
  const calculateSellerPricePerCarat = () => {
    if (!price || !carat || carat <= 0) return 0;
    return parseFloat(price) / (88.5 * parseFloat(carat));
  };

  // Calculate dynamic rap price
  const RAP_PRICE = (() => {
    if (!carat) return 0;
    const caratNum = parseFloat(carat);
    const pricePerCarat = getRapPricePerCarat();
    if (!pricePerCarat || !caratNum) return 0;
    return pricePerCarat * 88.5 * caratNum;
  })();

  // Check if carat is within available ranges
  const isCaratInRange = () => {
    const caratNum = parseFloat(carat);
    if (!caratNum || caratNum <= 0) return false;
    
    return (caratNum >= 0.01 && caratNum <= 0.03) ||
           (caratNum >= 0.04 && caratNum <= 0.07) ||
           (caratNum >= 0.08 && caratNum <= 0.14) ||
           (caratNum >= 0.15 && caratNum <= 0.17) ||
           (caratNum >= 0.18 && caratNum <= 0.22) ||
           (caratNum >= 0.23 && caratNum <= 0.29) ||
           (caratNum >= 0.30 && caratNum <= 0.39) ||
           (caratNum >= 0.40 && caratNum <= 0.49) ||
           (caratNum >= 0.50 && caratNum <= 0.69) ||
           (caratNum >= 0.70 && caratNum <= 0.89) ||
           (caratNum >= 0.90 && caratNum <= 0.99) ||
           (caratNum >= 1.00 && caratNum <= 1.49) ||
           (caratNum >= 1.50 && caratNum <= 1.99) ||
           (caratNum >= 2.00 && caratNum <= 2.99) ||
           (caratNum >= 3.00 && caratNum <= 3.99) ||
           (caratNum >= 4.00 && caratNum <= 4.99) ||
           (caratNum >= 5.00 && caratNum <= 5.99) ||
           (caratNum >= 10.00 && caratNum <= 10.99);
  };

  // Calculate percentage difference
  const calculatePercentageDifference = () => {
    if (!price || parseFloat(price) === 0 || RAP_PRICE === 0) return 0;
    
    const sellerPrice = parseFloat(price);
    const difference = ((sellerPrice - RAP_PRICE) / RAP_PRICE) * 100;
    return difference;
  };

  // Format price in rupees with K/L units
  const formatPriceInRupees = (priceValue) => {
    if (!priceValue || priceValue === 0) return '₹0';
    
    const num = parseFloat(priceValue);
    if (num >= 100000) {
      // For lakhs (L)
      return `₹${(num / 100000).toFixed(2)}L`;
    } else if (num >= 1000) {
      // For thousands (K)
      return `₹${(num / 1000).toFixed(1)}K`;
    } else {
      return `₹${num}`;
    }
  };

  const sellerPricePerCarat = calculateSellerPricePerCarat();
  const rapPricePerCarat = getRapPricePerCarat();
  const percentageDiff = calculatePercentageDifference();
  const isDiscount = percentageDiff < 0;
  const sign = isDiscount ? '-' : '+';
  const absPercentage = Math.abs(percentageDiff);
  const caratInRange = isCaratInRange();

  // Determine color class based on percentage difference
  const getDifferenceClass = () => {
    if (percentageDiff > 0) {
      return 'premium'; // Red for above RAP
    } else if (percentageDiff <= -20) {
      return 'discount'; // Green for -20% or more below RAP
    } else {
      return 'amber'; // Amber for between 0% and -20% below RAP
    }
  };

  // Screenshot functionality - mobile-friendly using html2canvas
  const captureScreenshot = async () => {
    setIsCapturing(true);
    try {
      // Get the display component element
      const displayElement = document.querySelector('.display');
      
      if (!displayElement) {
        throw new Error('Display element not found');
      }
      
      // Configure html2canvas options for better mobile compatibility
      const canvas = await html2canvas(displayElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        width: displayElement.offsetWidth,
        height: displayElement.offsetHeight
      });
      
      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Failed to create image blob');
        }
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Create filename with seller name and diamond details
        const sellerName = document.querySelector('.seller-name')?.value || 'Diamond';
        const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
        const filename = `${sellerName}_${carat}-${color}-${clarity}_${date}.png`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png', 0.95);
      
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      alert('Failed to capture screenshot. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  // Handle RAP price editing
  const handleRapPriceClick = () => {
    if (customRapPricePerCarat !== null) {
      // Show bottom sheet for edited values
      setShowBottomSheet(true);
    } else {
      // Start inline editing
      setIsEditingRapPrice(true);
    }
  };

  const handleRapPriceChange = (e) => {
    const inputValue = e.target.value;
    // Allow empty string or valid numbers (including 0)
    if (inputValue === '' || !isNaN(parseFloat(inputValue))) {
      const value = inputValue === '' ? null : parseFloat(inputValue);
      setCustomRapPricePerCarat(value);
    }
  };

  const handleRapPriceBlur = () => {
    setIsEditingRapPrice(false);
  };

  const handleRapPriceKeyPress = (e) => {
    if (e.key === 'Enter') {
      setIsEditingRapPrice(false);
    }
  };

  const resetToRap = () => {
    setCustomRapPricePerCarat(null);
    setShowBottomSheet(false);
  };

  const editValue = () => {
    setShowBottomSheet(false);
    setIsEditingRapPrice(true);
  };

  return (
    <div className="display">
      <div className="display-content">
        <div className="top-controls">
            <div className='logo-container'>
                <img alt="Logo image of a diamond" className='logo-img' src={Logo}/>
            </div>
          <input className='seller-name' placeholder='Seller name' spellCheck="false"></input>
          <button 
            className="screenshot-btn" 
            onClick={captureScreenshot}
            disabled={isCapturing}
            title="Take screenshot"
          >
            <img src={ScreenshotIcon} alt="Screenshot" className="screenshot-icon" />
          </button>
        </div>
        <div className={`diamond-specs ${carat ? 'visible' : 'hidden'}`}>
          {carat || '—'} <span className="bullet-color">•</span> {color} <span className="bullet-color">•</span> {clarity}
        </div>
        <p className="main-statement">
          Seller price per carat is <span className="highlight">
            {caratInRange ? `$${sellerPricePerCarat.toFixed(2)}` : '—'}
          </span>. 
          That's <span className={`difference ${getDifferenceClass()}`}>
            {caratInRange && RAP_PRICE > 0 ? `${sign}${absPercentage.toFixed(2)}%` : '—'}
          </span> {caratInRange && RAP_PRICE > 0 ? (isDiscount ? 'below' : 'above') : ''} the rap (
          {caratInRange ? (
            isEditingRapPrice ? (
              <input
                type="number"
                value={customRapPricePerCarat !== null ? customRapPricePerCarat : ''}
                onChange={handleRapPriceChange}
                onBlur={handleRapPriceBlur}
                onKeyPress={handleRapPriceKeyPress}
                className="rap-price-input"
                autoFocus
                step="0.01"
                min="0"
                placeholder={rapPricePerCarat.toFixed(2)}
              />
            ) : (
              <span 
                className={`rap-price-display ${customRapPricePerCarat !== null && customRapPricePerCarat > 0 ? 'edited' : ''}`}
                onClick={handleRapPriceClick}
                style={{ cursor: 'pointer' }}
              >
                {rapPricePerCarat > 0 ? `$${rapPricePerCarat.toFixed(2)}` : '—'} ✎
              </span>
            )
          ) : '—'}
          ).
        </p>
        
        <div className="price-breakdown">
          <div className="price-item">
            <span className="label">Seller price</span>
            <span className="value">{formatPriceInRupees(price)}</span>
          </div>
          <div className="price-item">
            <span className="label">Rap price</span>
            <span className="value">{caratInRange && RAP_PRICE > 0 ? formatPriceInRupees(RAP_PRICE) : '—'}</span>
          </div>
          <div className="price-item">
            <span className="label">Rap price -10%</span>
            <span className="value">{caratInRange && RAP_PRICE > 0 ? formatPriceInRupees(RAP_PRICE * 0.9) : '—'}</span>
          </div>
          <div className="price-item">
            <span className="label">Rap price -20%</span>
            <span className="value">{caratInRange && RAP_PRICE > 0 ? formatPriceInRupees(RAP_PRICE * 0.8) : '—'}</span>
          </div>
          <div className="price-item">
            <span className="label">Rap price -30%</span>
            <span className="value">{caratInRange && RAP_PRICE > 0 ? formatPriceInRupees(RAP_PRICE * 0.7) : '—'}</span>
          </div>
        </div>
      </div>
      
      {/* Bottom Sheet Modal */}
      {showBottomSheet && (
        <div className="bottom-sheet-overlay" onClick={() => setShowBottomSheet(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-content">
            <button className="bottom-sheet-button " onClick={resetToRap}>
                Reset rap
              </button>
              <button className="bottom-sheet-button secondary" onClick={editValue}>
                Edit Value
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Display;
