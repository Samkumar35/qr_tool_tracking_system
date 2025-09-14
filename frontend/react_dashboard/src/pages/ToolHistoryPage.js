import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const ToolHistoryPage = () => {
  const { id } = useParams(); // Gets the tool 'id' from the URL
  const [history, setHistory] = useState([]);
  const [toolName, setToolName] = useState(''); // To display the tool's name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // We can make two parallel requests to get history and tool details
        const historyRes = await api.get(`/tools/${id}/history`);
        // Note: We don't have a route for a single tool yet, so we'll find it from the main list.
        // In a bigger app, you'd create a GET /api/tools/:id endpoint.
        const toolsRes = await api.get('/tools');
        const currentTool = toolsRes.data.find(tool => tool.id === id);

        setHistory(historyRes.data);
        if (currentTool) {
          setToolName(currentTool.name);
        }

      } catch (err) {
        setError('Failed to fetch tool history.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [id]); // This effect runs whenever the tool ID in the URL changes

  if (loading) {
    return <p>Loading history...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h1>History for: {toolName || 'Tool'}</h1>
      <Link to="/">Back to Dashboard</Link>
      
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Transaction Type</th>
            <th>Operator</th>
            <th>Condition on Return</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {history.length > 0 ? (
            history.map((entry) => (
              <tr key={entry.transaction_id}>
                <td>{new Date(entry.timestamp).toLocaleString()}</td>
                <td>{entry.transaction_type}</td>
                <td>{entry.operator_name}</td>
                <td>{entry.condition_on_return || 'N/A'}</td>
                <td>{entry.notes || '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No history found for this tool.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ToolHistoryPage;