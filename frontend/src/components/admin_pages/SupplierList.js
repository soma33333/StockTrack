import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/SupplierList.css";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    contact_email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const API_BASE = `${process.env.REACT_APP_API_URL}/admin/suppliers.php`;

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(API_BASE);
      setSuppliers(res.data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await axios.put(`${API_BASE}?id=${form.id}`, form);
        alert("Supplier updated successfully");
      } else {
        await axios.post(API_BASE, form);
        alert("Supplier added successfully");
      }
      setForm({
        id: null,
        name: "",
        contact_email: "",
        phone: "",
        address: "",
        password: "",
      });
      fetchSuppliers();
    } catch (err) {
      alert("Error saving supplier. Please try again.");
      console.error("Error saving supplier:", err);
    }
  };

  const handleEdit = (supplier) => {
    setForm({ ...supplier, password: "" });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}?id=${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      fetchSuppliers();
      alert("Supplier deleted successfully");
    } catch (err) {
      alert("Error deleting supplier. Please try again.");
      console.error("Error deleting supplier:", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contact_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="supplier-panel">
      <h2>Supplier Management</h2>

      <form onSubmit={handleSubmit} className="supplier-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="contact_email"
          placeholder="Email"
          value={form.contact_email}
          onChange={handleChange}
          pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          maxLength={10}
          pattern="\d{10}"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
        />
        {!form.id && (
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        )}
        <button type="submit">{form.id ? "Update" : "Add"} Supplier</button>
        {form.id && (
          <button
            type="button"
            onClick={() =>
              setForm({
                id: null,
                name: "",
                contact_email: "",
                phone: "",
                address: "",
                password: "",
              })
            }
          >
            Cancel
          </button>
        )}
      </form>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search suppliers..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <table className="supplier-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSuppliers.length > 0 ? (
            filteredSuppliers.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.contact_email}</td>
                <td>{s.phone}</td>
                <td>{s.address}</td>
                <td>
                  <button onClick={() => handleEdit(s)}>Edit</button>
                  <button onClick={() => handleDelete(s.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No suppliers found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierList;
