import React, { useState } from 'react';
import api from '../services/api';

const AddUserForm = ({ onUserAdded }) => {
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('operator');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !employeeId || !password) {
      setError('All fields are required.');
      return;
    }

    try {
      const newUser = { name, employee_id: employeeId, password, role };
      await api.post('/users', newUser);
      setSuccess(`User '${name}' created successfully!`);
      // Clear the form
      setName('');
      setEmployeeId('');
      setPassword('');
      setRole('operator');
      // Refresh the user list in the parent component
      onUserAdded();
    } catch (err) {
      setError('Failed to create user. Employee ID may already exist.');
      console.error(err);
    }
  };

  return (
    <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
      <h3>Create New User</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="operator">Operator</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Create User</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default AddUserForm;