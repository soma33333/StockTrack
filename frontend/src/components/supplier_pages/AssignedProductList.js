import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AssignedProductList.css';

const AssignedProductList = ({ userId }) => {
  const [products, setProducts] = useState([]);
  const API_BASE = `${process.env.REACT_APP_API_URL}/suppliers`;

  useEffect(() => {
    if (userId) {
      axios
        .get(`${API_BASE}/assigned_products.php?userId=${userId}`)
        .then((res) => {
          const pendingProducts = res.data.filter((p) => p.status === 'pending');
          setProducts(pendingProducts);
        })
        .catch((err) => console.error('Error fetching products:', err));
    }
  }, [userId]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${API_BASE}/assigned_products.php?id=${id}`, { status: newStatus });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="assigned-products-panel">
      <h3>Pending Product Requests</h3>
      {products.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <table className="assigned-products-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Current Stock</th>
              <th>Requested Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.stock_quantity}</td>
                <td>{product.requested_quantity}</td>
                <td>{product.status}</td>
                <td>
                  <button onClick={() => handleStatusChange(product.id, 'approved')}>Approve</button>
                  <button onClick={() => handleStatusChange(product.id, 'rejected')}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AssignedProductList;
