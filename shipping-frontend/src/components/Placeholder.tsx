import React from 'react';
import './Placeholder.css';

interface PlaceholderProps {
  title: string;
  icon?: string;
  description?: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ title, icon, description }) => {
  return (
    <div className="placeholder-page">
      <div className="placeholder-content">
        {icon && <div className="placeholder-icon">{icon}</div>}
        <h1>{title}</h1>
        <p className="placeholder-description">
          {description || 'This feature is not yet implemented.'}
        </p>
        <p className="placeholder-note">
          Currently, only the <strong>Upload Spreadsheet</strong> feature is available.
        </p>
        <button 
          className="btn-primary"
          onClick={() => window.location.href = '/upload'}
        >
          Go to Upload Spreadsheet
        </button>
      </div>
    </div>
  );
};

export default Placeholder;
