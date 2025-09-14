import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ToolList from '../components/ToolList';
import AddToolForm from '../components/AddToolForm';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const [tools, setTools] = useState([]);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  const fetchTools = async () => {
    try {
      const response = await api.get('/tools');
      setTools(response.data);
    } catch (err) {
      console.error('Failed to fetch tools:', err);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleAddTool = async (newToolData) => {
    try {
      await api.post('/tools', newToolData);
      fetchTools();
    } catch (err) {
      console.error('Error adding tool:', err);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await api.delete(`/tools/${id}`);
      fetchTools();
    } catch (err)
      {
      console.error('Error deleting tool:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Welcome, {auth.user ? auth.user.user.name : 'Admin'}!</h2>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <nav style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <Link to="/operators" style={{ marginRight: '15px' }}>Operator Report</Link>
        <Link to="/users" style={{ marginRight: '15px' }}>User Management</Link>
        <Link to="/maintenance">Maintenance Report</Link>
      </nav>
      
      <h1>Tool Inventory Dashboard</h1>
      <AddToolForm onToolAdd={handleAddTool} />
      <hr style={{ margin: '20px 0' }}/>
      <ToolList tools={tools} handleDelete={handleDelete} />
    </div>
  );
}

export default DashboardPage;