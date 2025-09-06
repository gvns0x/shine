import React from 'react';
import './display.css';

function Display({ values }) {
  const { carat = '', price = '', color = 'D', clarity = 'IF' } = values || {};

  // Constants
  const RAP_PRICE = 190000;

  // Calculate price per carat
  const calculatePricePerCarat = () => {
    if (!price || !carat || carat <= 0) return 0;
    return parseFloat(price) / (88.5 * parseFloat(carat));
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

  const pricePerCarat = calculatePricePerCarat();
  const percentageDiff = calculatePercentageDifference();
  const isDiscount = percentageDiff < 0;
  const sign = isDiscount ? '-' : '+';
  const absPercentage = Math.abs(percentageDiff);

  return (
    <div className="display">
      <div className="display-content">
        <p className="main-statement">
          Seller price per carat is <span className="highlight">${pricePerCarat.toFixed(2)}</span>. 
          That's <span className={`difference ${isDiscount ? 'discount' : 'premium'}`}>
            {sign}{absPercentage.toFixed(2)}%
          </span> {isDiscount ? 'below' : 'above'} the rap.
        </p>
        
        <div className="price-breakdown">
          <div className="price-item">
            <span className="label">Seller price:</span>
            <span className="value">{formatPriceInRupees(price)}</span>
          </div>
          <div className="price-item">
            <span className="label">Rap price:</span>
            <span className="value">{formatPriceInRupees(RAP_PRICE)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Display;
