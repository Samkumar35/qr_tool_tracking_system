import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ToolHistoryPage from './pages/ToolHistoryPage';
import OperatorReportPage from './pages/OperatorReportPage';
import UserManagementPage from './pages/UserManagementPage';
import MaintenanceReportPage from './pages/MaintenanceReportPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Set the Dashboard as the main page */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tool/:id" element={<ToolHistoryPage />} />
          <Route path="/operators" element={<OperatorReportPage />} />
          <Route path="/users" element={<UserManagementPage />} />
          <Route path="/maintenance" element={<MaintenanceReportPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;