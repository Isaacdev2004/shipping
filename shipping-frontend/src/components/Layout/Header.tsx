import React from 'react';
import './Header.css';

interface HeaderProps {
  totalPrice?: number;
}

const Header: React.FC<HeaderProps> = ({ totalPrice }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-logo">Shipping Platform</h1>
        </div>
        <div className="header-right">
          {totalPrice !== undefined && (
            <div className="total-price">
              Total: <span className="price-amount">${totalPrice.toFixed(2)}</span>
            </div>
          )}
          <div className="user-info">
            <div className="user-name">John Doe</div>
            <div className="account-balance">Balance: $1,234.56</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
