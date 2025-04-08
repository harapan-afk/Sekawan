import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../services/authService';

const ProtectedRoute: React.FC = () => {
  // Periksa apakah pengguna sudah terautentikasi
  const isAuthenticated = AuthService.isTokenValid();

  // Jika tidak terautentikasi, alihkan ke halaman login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Jika terautentikasi, render rute anak
  return <Outlet />;
};

export default ProtectedRoute;