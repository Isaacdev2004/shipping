import React, { useState, useEffect } from 'react';
import { Address } from '../../types';
import './Modal.css';

interface EditAddressModalProps {
  address: Address | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Partial<Address>) => void;
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC', 'PR'
];

const EditAddressModal: React.FC<EditAddressModalProps> = ({
  address,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Address>>({
    first_name: '',
    last_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    phone: '',
  });

  useEffect(() => {
    if (address) {
      setFormData({
        first_name: address.first_name || '',
        last_name: address.last_name || '',
        address_line1: address.address_line1 || '',
        address_line2: address.address_line2 || '',
        city: address.city || '',
        state: address.state || '',
        zip_code: address.zip_code || '',
        phone: address.phone || '',
      });
    }
  }, [address]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: keyof Address, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Address</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Address Line 1 *</label>
            <input
              type="text"
              value={formData.address_line1}
              onChange={(e) => handleChange('address_line1', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Address Line 2</label>
            <input
              type="text"
              value={formData.address_line2}
              onChange={(e) => handleChange('address_line2', e.target.value)}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>State *</label>
              <select
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                required
              >
                <option value="">Select State</option>
                {US_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>ZIP Code *</label>
              <input
                type="text"
                value={formData.zip_code}
                onChange={(e) => handleChange('zip_code', e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
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

export default EditAddressModal;
