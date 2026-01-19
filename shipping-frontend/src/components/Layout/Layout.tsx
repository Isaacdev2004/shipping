import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  totalPrice?: number;
}

const Layout: React.FC<LayoutProps> = ({ children, totalPrice }) => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-main">
        <Header totalPrice={totalPrice} />
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
