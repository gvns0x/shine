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
            <span className="value">${price || '0'}</span>
          </div>
          <div className="price-item">
            <span className="label">Rap price:</span>
            <span className="value">${RAP_PRICE.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Display;
