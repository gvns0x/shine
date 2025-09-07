import React from 'react';
import './display.css';

function Display({ values, calculateRapPrice, getPricePerCarat }) {
  const { carat = '', price = '', color = 'D', clarity = 'IF' } = values || {};

  // Calculate dynamic rap price
  const RAP_PRICE = calculateRapPrice ? calculateRapPrice(carat, color, clarity) : 0;

  // Calculate price per carat from seller price
  const calculateSellerPricePerCarat = () => {
    if (!price || !carat || carat <= 0) return 0;
    return parseFloat(price) / (88.5 * parseFloat(carat));
  };

  // Get rap price per carat from diamond data
  const getRapPricePerCarat = () => {
    return getPricePerCarat ? getPricePerCarat(carat, color, clarity) * 100 : 0;
  };

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
    if (!price || parseFloat(price) === 0) return 0;
    
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

  return (
    <div className="display">
      <div className="display-content">
        <input className='seller-name' placeholder='Seller name'></input>
        <p className="main-statement">
          Seller price per carat is <span className="highlight">
            {caratInRange ? `$${sellerPricePerCarat.toFixed(2)}` : '—'}
          </span>. 
          That's <span className={`difference ${getDifferenceClass()}`}>
            {caratInRange ? `${sign}${absPercentage.toFixed(2)}%` : '—'}
          </span> {caratInRange ? (isDiscount ? 'below' : 'above') : ''} the rap ({caratInRange ? `$${rapPricePerCarat.toFixed(2)}` : '—'}).
        </p>
        
        <div className="price-breakdown">
          <div className="price-item">
            <span className="label">Seller price:</span>
            <span className="value">{formatPriceInRupees(price)}</span>
          </div>
          <div className="price-item">
            <span className="label">Rap price:</span>
            <span className="value">{caratInRange ? formatPriceInRupees(RAP_PRICE) : '—'}</span>
          </div>
          <div className="price-item">
            <span className="label">Rap price with -10%:</span>
            <span className="value">{caratInRange ? formatPriceInRupees(RAP_PRICE * 0.9) : '—'}</span>
          </div>
          <div className="price-item">
            <span className="label">Rap price with -20%:</span>
            <span className="value">{caratInRange ? formatPriceInRupees(RAP_PRICE * 0.8) : '—'}</span>
          </div>
          <div className="price-item">
            <span className="label">Rap price with -30%:</span>
            <span className="value">{caratInRange ? formatPriceInRupees(RAP_PRICE * 0.7) : '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Display;
