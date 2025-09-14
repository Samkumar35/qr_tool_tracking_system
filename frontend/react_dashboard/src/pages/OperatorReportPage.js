import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const OperatorReportPage = () => {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        // Fetch data from the backend
        const response = await api.get('/users');
        setOperators(response.data);
      } catch (err) {
        setError('Failed to fetch operator data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOperators();
  }, []);

  if (loading) {
    return <p>Loading operator data...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Operator Performance Report</h1>
      <Link to="/">Back to Dashboard</Link>

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Employee ID</th>
            <th>Role</th>
            <th>Tools Currently Checked Out</th>
          </tr>
        </thead>
        <tbody>
          {operators.map((op) => (
            <tr key={op.id}>
              <td>{op.name}</td>
              <td>{op.employee_id}</td>
              <td>{op.role}</td>
              <td>{op.tools_checked_out}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OperatorReportPage;