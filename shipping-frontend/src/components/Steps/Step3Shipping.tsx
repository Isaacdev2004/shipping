import React, { useState, useEffect, useCallback } from 'react';
import { Shipment, ShippingService } from '../../types';
import { shipmentsAPI, shippingServicesAPI } from '../../services/api';
import './Step3Shipping.css';

interface Step3ShippingProps {
  shipments: Shipment[];
  onBack: () => void;
  onContinue: (shipments: Shipment[]) => void;
}

const Step3Shipping: React.FC<Step3ShippingProps> = ({ shipments: initialShipments, onBack, onContinue }) => {
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [services, setServices] = useState<ShippingService[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const loadShipments = async () => {
    try {
      const response = await shipmentsAPI.getAll();
      setShipments(response.data);
    } catch (error) {
      console.error('Failed to load shipments:', error);
    }
  };

  const loadServices = useCallback(async () => {
    try {
      const response = await shippingServicesAPI.getAll();
      setServices(response.data);
      // Assign default service to shipments without one
      if (response.data.length > 0 && shipments.some((s) => !s.shipping_service)) {
        const defaultService = response.data.find((s) => s.name === 'ground') || response.data[0];
        await Promise.all(
          shipments
            .filter((s) => !s.shipping_service)
            .map((s) => {
              const updates: Partial<Shipment> = { shipping_service_id: defaultService.id };
              return shipmentsAPI.update(s.id, updates);
            })
        );
        await loadShipments();
      }
    } catch (error) {
      console.error('Failed to load services:', error);
    }
  }, [shipments]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleServiceChange = async (shipmentId: number, serviceId: number) => {
    try {
      const updates: Partial<Shipment> = { shipping_service_id: serviceId };
      await shipmentsAPI.update(shipmentId, updates);
      await loadShipments();
    } catch (error) {
      console.error('Failed to update service:', error);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(shipments.map((s) => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkServiceChange = async (option: string) => {
    try {
      await shipmentsAPI.bulkUpdateShippingService(Array.from(selectedIds), undefined, option);
      await loadShipments();
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Failed to update services:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this shipment?')) return;

    try {
      await shipmentsAPI.delete(id);
      setShipments(shipments.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Failed to delete shipment:', error);
    }
  };

  const formatAddress = (address: any) => {
    if (!address) return 'N/A';
    return `${address.address_line1}, ${address.city}, ${address.state}`;
  };

  const formatPackage = (pkg: any) => {
    return `${pkg.length}" × ${pkg.width}" × ${pkg.height}", ${pkg.weight_lbs}lb ${pkg.weight_oz}oz`;
  };

  return (
    <div className="step3-shipping">
      <div className="step-header">
        <h2>Select Shipping Provider (Step 3 of 3)</h2>
        <div className="step-actions">
          <button className="btn-secondary" onClick={onBack}>
            ← Back
          </button>
          <button className="btn-primary" onClick={() => onContinue(shipments)}>
            Continue to Purchase →
          </button>
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className="bulk-service-actions">
          <span>Bulk actions for {selectedIds.size} selected:</span>
          <button onClick={() => handleBulkServiceChange('cheapest')}>
            Switch to Cheapest Rate
          </button>
          <button onClick={() => handleBulkServiceChange('priority')}>
            Change to Priority Mail
          </button>
          <button onClick={() => handleBulkServiceChange('ground')}>
            Change to Ground Shipping
          </button>
        </div>
      )}

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedIds.size === shipments.length && shipments.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>Ship From</th>
              <th>Ship To</th>
              <th>Package Details</th>
              <th>Order No</th>
              <th>Shipping Service</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipments.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-state">
                  No shipments found
                </td>
              </tr>
            ) : (
              shipments.map((shipment) => (
                <tr key={shipment.id} className={selectedIds.has(shipment.id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(shipment.id)}
                      onChange={(e) => handleSelectOne(shipment.id, e.target.checked)}
                    />
                  </td>
                  <td>{formatAddress(shipment.ship_from)}</td>
                  <td>{formatAddress(shipment.ship_to)}</td>
                  <td>{formatPackage(shipment.package)}</td>
                  <td>{shipment.order_number}</td>
                  <td>
                    <select
                      value={shipment.shipping_service?.id || ''}
                      onChange={(e) => handleServiceChange(shipment.id, parseInt(e.target.value))}
                    >
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name_display}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="price-cell">
                    ${shipment.shipping_price ? parseFloat(shipment.shipping_price).toFixed(2) : '0.00'}
                  </td>
                  <td>
                    <button className="btn-delete" onClick={() => handleDelete(shipment.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Step3Shipping;
