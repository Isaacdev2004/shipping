import React, { useState, useEffect } from 'react';
import { Shipment, Address, Package, SavedAddress, SavedPackage } from '../../types';
import { shipmentsAPI, addressesAPI, packagesAPI, savedAddressesAPI, savedPackagesAPI } from '../../services/api';
import EditAddressModal from '../Modals/EditAddressModal';
import EditPackageModal from '../Modals/EditPackageModal';
import './Step2Review.css';

interface Step2ReviewProps {
  shipments: Shipment[];
  onBack: () => void;
  onContinue: (shipments: Shipment[]) => void;
}

const Step2Review: React.FC<Step2ReviewProps> = ({ shipments: initialShipments, onBack, onContinue }) => {
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAddress, setEditingAddress] = useState<{ shipmentId: number; type: 'from' | 'to' } | null>(null);
  const [editingPackage, setEditingPackage] = useState<number | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [savedPackages, setSavedPackages] = useState<SavedPackage[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    loadSavedData();
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      const response = await shipmentsAPI.getAll();
      setShipments(response.data);
    } catch (error) {
      console.error('Failed to load shipments:', error);
    }
  };

  const loadSavedData = async () => {
    try {
      const [addresses, packages] = await Promise.all([
        savedAddressesAPI.getAll(),
        savedPackagesAPI.getAll(),
      ]);
      setSavedAddresses(addresses.data);
      setSavedPackages(packages.data);
    } catch (error) {
      console.error('Failed to load saved data:', error);
    }
  };

  const filteredShipments = shipments.filter((shipment) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      shipment.order_number.toLowerCase().includes(searchLower) ||
      shipment.ship_to.address_line1.toLowerCase().includes(searchLower) ||
      shipment.ship_to.city.toLowerCase().includes(searchLower) ||
      `${shipment.ship_to.first_name} ${shipment.ship_to.last_name}`.toLowerCase().includes(searchLower)
    );
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredShipments.map((s) => s.id)));
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
    setShowBulkActions(newSelected.size > 0);
  };

  const handleEditAddress = async (addressData: Partial<Address>) => {
    if (!editingAddress) return;

    try {
      const shipment = shipments.find((s) => s.id === editingAddress.shipmentId);
      if (!shipment) return;

      const address = editingAddress.type === 'from' ? shipment.ship_from : shipment.ship_to;
      if (!address || !address.id) return;

      await addressesAPI.update(address.id, addressData);
      const updatedShipment = await shipmentsAPI.getById(editingAddress.shipmentId);
      setShipments(shipments.map((s) => (s.id === editingAddress.shipmentId ? updatedShipment.data : s)));
      setEditingAddress(null);
    } catch (error) {
      console.error('Failed to update address:', error);
    }
  };

  const handleEditPackage = async (packageData: Partial<Package>) => {
    if (!editingPackage) return;

    try {
      const shipment = shipments.find((s) => s.id === editingPackage);
      if (!shipment || !shipment.package.id) return;

      await packagesAPI.update(shipment.package.id, packageData);
      const updatedShipment = await shipmentsAPI.getById(editingPackage);
      setShipments(shipments.map((s) => (s.id === editingPackage ? updatedShipment.data : s)));
      setEditingPackage(null);
    } catch (error) {
      console.error('Failed to update package:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this shipment?')) return;

    try {
      await shipmentsAPI.delete(id);
      setShipments(shipments.filter((s) => s.id !== id));
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (error) {
      console.error('Failed to delete shipment:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} shipments?`)) return;

    try {
      await shipmentsAPI.bulkDelete(Array.from(selectedIds));
      setShipments(shipments.filter((s) => !selectedIds.has(s.id)));
      setSelectedIds(new Set());
      setShowBulkActions(false);
    } catch (error) {
      console.error('Failed to delete shipments:', error);
    }
  };

  const handleBulkUpdateAddress = async (addressId: number) => {
    try {
      const updates: Partial<Shipment> = { ship_from_id: addressId };
      await shipmentsAPI.bulkUpdate(Array.from(selectedIds), updates);
      await loadShipments();
      setSelectedIds(new Set());
      setShowBulkActions(false);
    } catch (error) {
      console.error('Failed to update addresses:', error);
    }
  };

  const handleBulkUpdatePackage = async (packageId: number) => {
    try {
      const selectedShipments = shipments.filter((s) => selectedIds.has(s.id));
      const savedPkg = savedPackages.find((p) => p.id === packageId);
      if (!savedPkg) return;

      await Promise.all(
        selectedShipments.map(async (shipment) => {
          if (!shipment.package.id) return;
          await packagesAPI.update(shipment.package.id, savedPkg.package);
        })
      );
      await loadShipments();
      setSelectedIds(new Set());
      setShowBulkActions(false);
    } catch (error) {
      console.error('Failed to update packages:', error);
    }
  };

  const formatAddress = (address: Address | null) => {
    if (!address) return 'N/A';
    return `${address.address_line1}, ${address.city}, ${address.state} ${address.zip_code}`;
  };

  const formatPackage = (pkg: Package) => {
    return `${pkg.length}" × ${pkg.width}" × ${pkg.height}", ${pkg.weight_lbs}lb ${pkg.weight_oz}oz`;
  };

  const getStatusBadge = (status: string) => {
    const statusClasses: Record<string, string> = {
      pending: 'status-pending',
      validated: 'status-validated',
      ready: 'status-ready',
      purchased: 'status-purchased',
    };
    return statusClasses[status] || 'status-pending';
  };

  return (
    <div className="step2-review">
      <div className="step-header">
        <h2>Review and Edit File (Step 2 of 3)</h2>
        <div className="step-actions">
          <button className="btn-secondary" onClick={onBack}>
            ← Back
          </button>
          <button className="btn-primary" onClick={() => onContinue(shipments)}>
            Continue →
          </button>
        </div>
      </div>

      <div className="review-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by address, order number, or recipient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {showBulkActions && (
          <div className="bulk-actions">
            <button className="btn-danger" onClick={handleBulkDelete}>
              Delete Selected ({selectedIds.size})
            </button>
            <select
              onChange={(e) => {
                if (e.target.value) handleBulkUpdateAddress(parseInt(e.target.value));
              }}
              defaultValue=""
            >
              <option value="">Change Ship From Address...</option>
              {savedAddresses.map((addr) => (
                <option key={addr.id} value={addr.address.id}>
                  {addr.name}
                </option>
              ))}
            </select>
            <select
              onChange={(e) => {
                if (e.target.value) handleBulkUpdatePackage(parseInt(e.target.value));
              }}
              defaultValue=""
            >
              <option value="">Change Package Details...</option>
              {savedPackages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedIds.size === filteredShipments.length && filteredShipments.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>Ship From Address</th>
              <th>Ship To Address</th>
              <th>Package Details</th>
              <th>Order No</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredShipments.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-state">
                  No shipments found
                </td>
              </tr>
            ) : (
              filteredShipments.map((shipment) => (
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
                    <span className={`status-badge ${getStatusBadge(shipment.status)}`}>
                      {shipment.status_display}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {shipment.ship_to && (
                        <button
                          className="btn-edit"
                          onClick={() => setEditingAddress({ shipmentId: shipment.id, type: 'to' })}
                        >
                          Edit To
                        </button>
                      )}
                      {shipment.ship_from && (
                        <button
                          className="btn-edit"
                          onClick={() => setEditingAddress({ shipmentId: shipment.id, type: 'from' })}
                        >
                          Edit From
                        </button>
                      )}
                      <button
                        className="btn-edit"
                        onClick={() => setEditingPackage(shipment.id)}
                      >
                        Edit Package
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(shipment.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingAddress && (
        <EditAddressModal
          address={
            editingAddress.type === 'from'
              ? shipments.find((s) => s.id === editingAddress.shipmentId)?.ship_from || null
              : shipments.find((s) => s.id === editingAddress.shipmentId)?.ship_to || null
          }
          isOpen={true}
          onClose={() => setEditingAddress(null)}
          onSave={handleEditAddress}
        />
      )}

      {editingPackage !== null && (
        <EditPackageModal
          package={shipments.find((s) => s.id === editingPackage)?.package || null}
          isOpen={true}
          onClose={() => setEditingPackage(null)}
          onSave={handleEditPackage}
        />
      )}
    </div>
  );
};

export default Step2Review;
