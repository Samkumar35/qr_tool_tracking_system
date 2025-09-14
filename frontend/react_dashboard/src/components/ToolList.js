import React from 'react';
// 1. Import the Link component from react-router-dom
import { Link } from 'react-router-dom';

const ToolList = ({ tools, handleDelete }) => {
  return (
    <div>
      <h2>Tool Inventory</h2>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Serial Number</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tools.length === 0 ? (
            <tr>
              <td colSpan="5">No tools found.</td>
            </tr>
          ) : (
            tools.map(tool => (
              <tr key={tool.id}>
                <td>{tool.name}</td>
                <td>{tool.category}</td>
                <td>{tool.serial_number}</td>
                <td>{tool.status}</td>
                <td>
                  {/* 2. Add a link that navigates to the tool's specific history page */}
                  <Link to={`/tool/${tool.id}`}>History</Link>
                  {' | '}
                  <button onClick={() => handleDelete(tool.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ToolList;