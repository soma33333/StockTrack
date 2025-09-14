import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/History.css'

const History = ({ userId }) => {
  const [history, setHistory] = useState([]);
  const API_BASE = `${process.env.REACT_APP_API_URL}/suppliers`;

  useEffect(() => {
    if (userId) {
      axios
        .get(`${API_BASE}/assigned_products.php?userId=${userId}&type=history`)
        .then((res) => {
          const filtered = res.data.filter(
            (p) => p.status === 'approved' || p.status === 'rejected'
          );
          setHistory(filtered);
        })
        .catch((err) => console.error('Error fetching history:', err));
    }
  }, [userId]);

  return (
    <div className="history-panel">
  <h3>Product Request History</h3>
  {history.length === 0 ? (
    <p>No history available.</p>
  ) : (
    <table className="history-table">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Requested Quantity</th>
          <th>Status</th>
          <th>Assigned At</th>
        </tr>
      </thead>
      <tbody>
        {history.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.requested_quantity}</td>
            <td className={item.status === 'approved' ? 'status-approved' : 'status-rejected'}>
              {item.status}
            </td>
            <td>{new Date(item.assigned_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>

  );
};

export default History;
