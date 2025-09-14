import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Make sure this line is here

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* This AuthProvider wrapper is required */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);