import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function getToken() {
  return localStorage.getItem('ajiva_token');
}

export default function RequireAuth({ children }: { children: React.ReactElement }) {
  const location = useLocation();
  const token = getToken();

  if (!token) {
    const from = encodeURIComponent(`${location.pathname}${location.search || ''}`);
    return <Navigate to={`/login?from=${from}`} replace />;
  }

  return children;
}
