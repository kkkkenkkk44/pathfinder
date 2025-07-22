import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn.jsx';
import Callback from './pages/Callback.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { AppProvider } from './context/AppContext.jsx'; // 新增這行

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider> {/* 包住整個應用 */}
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
