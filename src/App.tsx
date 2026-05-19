import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MarketingHome from './pages/MarketingHome';
import Login from './pages/Login';
import RequireAuth from './routes/RequireAuth';
import CrmLayout from './crm/CrmLayout';
import Dashboard from './crm/pages/Dashboard';
import ShipmentsPage from './crm/pages/Shipments';
import LeadsPage from './crm/pages/Leads';
import VendorsPage from './crm/pages/Vendors';
import CustomersPage from './crm/pages/Customers';
import QuotesPage from './crm/pages/Quotes';
import DocumentsPage from './crm/pages/Documents';
import AdminUsersPage from './crm/pages/AdminUsers';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MarketingHome />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/crm"
        element={
          <RequireAuth>
            <CrmLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="vendors" element={<VendorsPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="quotes" element={<QuotesPage />} />
        <Route path="shipments" element={<ShipmentsPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="admin/users" element={<AdminUsersPage />} />
      </Route>
    </Routes>
  );
}

export default App;
