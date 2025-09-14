import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddProductForm from './AddProductForm';
import '../styles/ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    stock_quantity: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  const API_BASE = `${process.env.REACT_APP_API_URL}/admin/products.php`;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_BASE);
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
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
        alert("Product updated successfully");
      } else {
        await axios.post(API_BASE, form);
        alert("Product added successfully");
      }
      setForm({ id: null, name: '', description: '', price: '', stock_quantity: '' });
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleEdit = (product) => {
    setForm(product);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}?id=${id}`);
      fetchProducts();
      alert("Product deleted successfully");
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleCancel = () => {
    setForm({ id: null, name: '', description: '', price: '', stock_quantity: '' });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Product Management</h2>

      <div className="product-form-wrapper">
        <AddProductForm
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="product-cards">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div>
                <h4>{product.name}</h4>
                <p><strong>Description:</strong> {product.description}</p>
                <p><strong>Price:</strong> ₹{product.price}</p>
                <p><strong>Stock:</strong> {product.stock_quantity}</p>
              </div>
              <div className="product-card-buttons">
                <button onClick={() => handleEdit(product)}>Edit</button>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
