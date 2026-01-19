import React, { useState, useEffect } from 'react';
import { Package } from '../../types';
import './Modal.css';

interface EditPackageModalProps {
  package: Package | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (pkg: Partial<Package>) => void;
}

const EditPackageModal: React.FC<EditPackageModalProps> = ({
  package: packageData,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Package>>({
    length: 0,
    width: 0,
    height: 0,
    weight_lbs: 0,
    weight_oz: 0,
    item_sku: '',
  });

  useEffect(() => {
    if (packageData) {
      setFormData({
        length: packageData.length || 0,
        width: packageData.width || 0,
        height: packageData.height || 0,
        weight_lbs: packageData.weight_lbs || 0,
        weight_oz: packageData.weight_oz || 0,
        item_sku: packageData.item_sku || '',
      });
    }
  }, [packageData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: keyof Package, value: number | string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Package Details</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Item ID / SKU</label>
            <input
              type="text"
              value={formData.item_sku}
              onChange={(e) => handleChange('item_sku', e.target.value)}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Length (inches) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.length}
                onChange={(e) => handleChange('length', parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            <div className="form-group">
              <label>Width (inches) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.width}
                onChange={(e) => handleChange('width', parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            <div className="form-group">
              <label>Height (inches) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.height}
                onChange={(e) => handleChange('height', parseFloat(e.target.value) || 0)}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Weight (lbs) *</label>
              <input
                type="number"
                min="0"
                value={formData.weight_lbs}
                onChange={(e) => handleChange('weight_lbs', parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div className="form-group">
              <label>Weight (oz) *</label>
              <input
                type="number"
                min="0"
                max="15"
                value={formData.weight_oz}
                onChange={(e) => handleChange('weight_oz', parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPackageModal;
