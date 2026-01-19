import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Step1Upload from './components/Steps/Step1Upload';
import Step2Review from './components/Steps/Step2Review';
import Step3Shipping from './components/Steps/Step3Shipping';
import Purchase from './components/Steps/Purchase';
import Success from './components/Steps/Success';
import Placeholder from './components/Placeholder';
import { Shipment } from './types';
import { shipmentsAPI } from './services/api';
import './App.css';

function UploadPage() {
  const navigate = useNavigate();

  const handleUploadSuccess = () => {
    navigate('/step2');
  };

  return <Step1Upload onUploadSuccess={handleUploadSuccess} />;
}

function Step2Page() {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState<Shipment[]>([]);

  useEffect(() => {
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

  const handleContinue = (updatedShipments: Shipment[]) => {
    setShipments(updatedShipments);
    navigate('/step3');
  };

  return (
    <Step2Review
      shipments={shipments}
      onBack={() => {
        if (window.confirm('Going back will lose your current data. Continue?')) {
          navigate('/upload');
        }
      }}
      onContinue={handleContinue}
    />
  );
}

function Step3Page() {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState<Shipment[]>([]);

  const calculateTotalFromShipments = useCallback((shipmentsToCalculate: Shipment[]) => {
    // This function is used internally but doesn't need to update state
    // The total price is managed by AppContent component
    return shipmentsToCalculate.reduce((sum, s) => {
      return sum + (s.shipping_price ? parseFloat(s.shipping_price) : 0);
    }, 0);
  }, []);

  const loadShipments = useCallback(async () => {
    try {
      const response = await shipmentsAPI.getAll();
      setShipments(response.data);
    } catch (error) {
      console.error('Failed to load shipments:', error);
    }
  }, []);

  useEffect(() => {
    loadShipments();
  }, [loadShipments]);

  const handleContinue = (updatedShipments: Shipment[]) => {
    setShipments(updatedShipments);
    navigate('/purchase');
  };

  return (
    <Step3Shipping
      shipments={shipments}
      onBack={() => navigate('/step2')}
      onContinue={handleContinue}
    />
  );
}

function PurchasePage() {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState<Shipment[]>([]);

  useEffect(() => {
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

  const handleSuccess = () => {
    navigate('/success');
  };

  return (
    <Purchase
      shipments={shipments}
      onBack={() => navigate('/step3')}
      onSuccess={handleSuccess}
    />
  );
}

function SuccessPage() {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState<Shipment[]>([]);

  useEffect(() => {
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

  const handleNewUpload = () => {
    navigate('/upload');
  };

  return <Success shipments={shipments} onNewUpload={handleNewUpload} />;
}

function AppContent() {
  const location = useLocation();
  const [totalPrice, setTotalPrice] = useState(0);

  const updateTotalPrice = async () => {
    try {
      const response = await shipmentsAPI.getTotalPrice();
      setTotalPrice(response.data.total);
    } catch (error) {
      const response = await shipmentsAPI.getAll();
      const total = response.data.reduce((sum: number, s: Shipment) => {
        return sum + (s.shipping_price ? parseFloat(s.shipping_price) : 0);
      }, 0);
      setTotalPrice(total);
    }
  };

  useEffect(() => {
    if (location.pathname === '/step3' || location.pathname === '/purchase') {
      updateTotalPrice();
      // Update total price periodically
      const interval = setInterval(updateTotalPrice, 2000);
      return () => clearInterval(interval);
    }
  }, [location.pathname]);

  return (
    <Layout totalPrice={location.pathname === '/step3' || location.pathname === '/purchase' ? totalPrice : undefined}>
      <Routes>
        <Route path="/" element={<Navigate to="/upload" replace />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/step2" element={<Step2Page />} />
        <Route path="/step3" element={<Step3Page />} />
        <Route path="/purchase" element={<PurchasePage />} />
        <Route path="/success" element={<SuccessPage />} />
          <Route path="/dashboard" element={<Placeholder title="Dashboard" icon="📊" description="View your shipping statistics and overview" />} />
          <Route path="/create-label" element={<Placeholder title="Create a Label" icon="✏️" description="Create a single shipping label" />} />
          <Route path="/history" element={<Placeholder title="Order History" icon="📋" description="View your past shipping orders" />} />
          <Route path="/pricing" element={<Placeholder title="Pricing" icon="💰" description="View shipping rates and pricing information" />} />
          <Route path="/billing" element={<Placeholder title="Billing" icon="💳" description="Manage your account billing and payment methods" />} />
          <Route path="/settings" element={<Placeholder title="Settings" icon="⚙️" description="Configure your account settings and preferences" />} />
          <Route path="/support" element={<Placeholder title="Support & Help" icon="❓" description="Get help and contact support" />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
