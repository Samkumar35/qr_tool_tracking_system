import React, { useState } from 'react';

// Receive the 'onToolAdd' function as a prop
const AddToolForm = ({ onToolAdd }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [serial_number, setSerialNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the function from the parent (App.js) with the new tool data
    onToolAdd({ name, category, serial_number });
    
    // Clear the form
    setName('');
    setCategory('');
    setSerialNumber('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Tool Name" value={name} onChange={e => setName(e.target.value)} required />
      <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} required />
      <input type="text" placeholder="Serial Number" value={serial_number} onChange={e => setSerialNumber(e.target.value)} required />
      <button type="submit">Add Tool</button>
    </form>
  );
};

export default AddToolForm;