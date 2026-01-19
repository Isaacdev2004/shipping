import React, { useState, useRef } from 'react';
import { shipmentsAPI } from '../../services/api';
import './Step1Upload.css';

interface Step1UploadProps {
  onUploadSuccess: (shipments: any[]) => void;
}

const Step1Upload: React.FC<Step1UploadProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await shipmentsAPI.uploadCSV(file);
      if (response.data.shipments && response.data.shipments.length > 0) {
        onUploadSuccess(response.data.shipments);
      } else {
        const errorMsg = response.data.errors?.length 
          ? `No valid shipments found. Errors: ${response.data.errors.join(', ')}`
          : 'No valid shipments found in the CSV file';
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      const errorMessage = err.response?.data?.error 
        || err.response?.data?.message
        || err.message
        || 'Failed to upload CSV file';
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDownloadTemplate = () => {
    // In a real app, this would download the template file
    window.open('/template.csv', '_blank');
  };

  return (
    <div className="step1-upload">
      <div className="step-header">
        <h2>Upload Spreadsheet (Step 1 of 3)</h2>
      </div>

      <div className="upload-container">
        <div
          className={`upload-area ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="upload-status">
              <div className="spinner"></div>
              <p>Uploading and processing CSV file...</p>
            </div>
          ) : (
            <>
              <div className="upload-icon">📤</div>
              <h3>Drag and drop your CSV file here</h3>
              <p>or</p>
              <button className="browse-button">Browse Files</button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
            </>
          )}
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="help-section">
          <h4>Need help?</h4>
          <button onClick={handleDownloadTemplate} className="template-button">
            📥 Download Template CSV
          </button>
          <p className="help-text">
            Make sure your CSV file follows the template format. Required fields include
            recipient address, city, state, and ZIP code.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step1Upload;
