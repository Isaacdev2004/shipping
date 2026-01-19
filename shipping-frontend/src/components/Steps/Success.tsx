import React from 'react';
import { Shipment } from '../../types';
import './Success.css';

interface SuccessProps {
  shipments: Shipment[];
  onNewUpload: () => void;
}

const Success: React.FC<SuccessProps> = ({ shipments, onNewUpload }) => {
  const totalPrice = shipments.reduce((sum, s) => {
    return sum + (s.shipping_price ? parseFloat(s.shipping_price) : 0);
  }, 0);

  return (
    <div className="success-page">
      <div className="success-content">
        <div className="success-icon">✓</div>
        <h1>Purchase Successful!</h1>
        <p className="success-message">
          Your shipping labels have been created successfully.
        </p>
        <div className="success-summary">
          <div className="summary-item">
            <span className="summary-label">Labels Created:</span>
            <span className="summary-value">{shipments.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Amount:</span>
            <span className="summary-value">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
        <div className="success-actions">
          <button className="btn-download">Download Labels</button>
          <button className="btn-primary" onClick={onNewUpload}>
            Create New Labels
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;
