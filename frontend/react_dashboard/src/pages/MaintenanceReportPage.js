import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MaintenanceReportPage = () => {
  const [flaggedTools, setFlaggedTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        // Fetch data from the backend
        const response = await api.get('/tools/maintenance/report');
        setFlaggedTools(response.data);
      } catch (err) {
        setError('Failed to fetch maintenance report.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) {
    return <p>Generating maintenance report...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Maintenance Flag Report</h1>
      <p>Tools that have been returned 'damaged' 3 or more times.</p>
      <Link to="/">Back to Dashboard</Link>

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Tool Name</th>
            <th>Serial Number</th>
            <th>Times Returned Damaged</th>
          </tr>
        </thead>
        <tbody>
          {flaggedTools.length > 0 ? (
            flaggedTools.map((tool) => (
              <tr key={tool.id}>
                <td>{tool.name}</td>
                <td>{tool.serial_number}</td>
                <td>{tool.damaged_return_count}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No tools currently meet the maintenance flag criteria.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceReportPage;