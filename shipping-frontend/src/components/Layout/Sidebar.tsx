import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/create-label', label: 'Create a Label', icon: '✏️' },
    { path: '/upload', label: 'Upload Spreadsheet', icon: '📤' },
    { path: '/history', label: 'Order History', icon: '📋' },
    { path: '/pricing', label: 'Pricing', icon: '💰' },
    { path: '/billing', label: 'Billing', icon: '💳' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
    { path: '/support', label: 'Support & Help', icon: '❓' },
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Shipping Platform</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
