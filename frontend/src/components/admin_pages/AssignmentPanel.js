import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/assignmentpanel.css";

const AssignmentPanel = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({
    id: null,
    product_id: "",
    supplier_id: "",
    requested_quantity: "",
    status: "pending",
  });

  const API_BASE =`${process.env.REACT_APP_API_URL}/admin`;

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
    fetchAssignments();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(`${API_BASE}/products.php`);
    setProducts(res.data);
  };

  const fetchSuppliers = async () => {
    const res = await axios.get(`${API_BASE}/suppliers.php`);
    setSuppliers(res.data);
  };

  const fetchAssignments = async () => {
    const res = await axios.get(`${API_BASE}/assignments.php`);
    setAssignments(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await axios.put(`${API_BASE}/assignments.php?id=${form.id}`, form);
        alert("Assignment updated successfully");
      } else {
        await axios.post(`${API_BASE}/assignments.php`, form);
        alert("Product assigned successfully");
      }
      setForm({
        id: null,
        product_id: "",
        supplier_id: "",
        requested_quantity: "",
        status: "pending",
      });
      fetchAssignments();
    } catch (err) {
      alert(err.response?.data?.error || "Error saving assignment");
    }
  };

  const handleEdit = (assignment) => {
    setForm(assignment);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      await axios.delete(`${API_BASE}/assignments.php?id=${id}`);
      fetchAssignments();
      alert("Assignment deleted successfully");
    }
  };

  const handleCancel = () => {
    setForm({
      id: null,
      product_id: "",
      supplier_id: "",
      requested_quantity: "",
      status: "pending",
    });
  };

  return (
    <div className="assignment-panel">
      <form onSubmit={handleSubmit} className="assignment-form">
        <select
          name="product_id"
          value={form.product_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          name="supplier_id"
          value={form.supplier_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Supplier</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="requested_quantity"
          placeholder="Requested Quantity"
          value={form.requested_quantity}
          onChange={handleChange}
          required
        />

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <button type="submit">
          {form.id ? "Update Assignment" : "Assign Product"}
        </button>
        {form.id && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      <h3>Assignment List</h3>
      <table className="assignment-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Supplier</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...assignments]
            .sort((a, b) => {
              const statusOrder = { pending: 0, rejected: 1, approved: 2 };
              return statusOrder[a.status] - statusOrder[b.status];
            })
            .map((a) => (
              <tr key={a.id}>
                <td>{a.product_name}</td>
                <td>{a.supplier_name}</td>
                <td>{a.requested_quantity}</td>
                <td>{a.status}</td>
                <td>
                  <button onClick={() => handleEdit(a)}>Edit</button>
                  <button onClick={() => handleDelete(a.id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentPanel;
