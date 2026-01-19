import React, { useState } from 'react';
import { Shipment } from '../../types';
import { shipmentsAPI } from '../../services/api';
import './Purchase.css';

interface PurchaseProps {
  shipments: Shipment[];
  onBack: () => void;
  onSuccess: () => void;
}

const Purchase: React.FC<PurchaseProps> = ({ shipments, onBack, onSuccess }) => {
  const [labelSize, setLabelSize] = useState<'letter' | '4x6'>('letter');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = shipments.reduce((sum, s) => {
    return sum + (s.shipping_price ? parseFloat(s.shipping_price) : 0);
  }, 0);

  const handlePurchase = async () => {
    if (!acceptedTerms) {
      alert('Please accept the terms and conditions');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate purchase - in real app, this would call purchase API
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Update shipment statuses to purchased
      await Promise.all(
        shipments.map((s) =>
          shipmentsAPI.update(s.id, { status: 'purchased' })
        )
      );
      
      onSuccess();
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="purchase">
      <div className="step-header">
        <h2>Purchase Shipping Labels</h2>
        <button className="btn-secondary" onClick={onBack}>
          ← Back
        </button>
      </div>

      <div className="purchase-content">
        <div className="purchase-section">
          <h3>Label Size Selection</h3>
          <div className="label-size-options">
            <label className={`label-size-option ${labelSize === 'letter' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="letter"
                checked={labelSize === 'letter'}
                onChange={(e) => setLabelSize(e.target.value as 'letter' | '4x6')}
              />
              <div>
                <strong>Letter/A4</strong>
                <p>Standard paper size (8.5x11 or A4)</p>
              </div>
            </label>
            <label className={`label-size-option ${labelSize === '4x6' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="4x6"
                checked={labelSize === '4x6'}
                onChange={(e) => setLabelSize(e.target.value as 'letter' | '4x6')}
              />
              <div>
                <strong>4x6 inch</strong>
                <p>Thermal label format</p>
              </div>
            </label>
          </div>
        </div>

        <div className="purchase-section">
          <h3>Order Summary</h3>
          <div className="summary-box">
            <div className="summary-row">
              <span>Number of Labels:</span>
              <span>{shipments.length}</span>
            </div>
            <div className="summary-row total">
              <span>Grand Total:</span>
              <span className="total-amount">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="purchase-section">
          <label className="terms-checkbox">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <span>I accept the terms and conditions</span>
          </label>
        </div>

        <div className="purchase-actions">
          <button
            className="btn-purchase"
            onClick={handlePurchase}
            disabled={!acceptedTerms || isProcessing}
          >
            {isProcessing ? 'Processing...' : `Purchase Labels ($${totalPrice.toFixed(2)})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Purchase;
