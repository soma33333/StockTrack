import React from 'react';
import '../styles/AddProductForm.css';

const AddProductForm = ({ form, handleChange, handleSubmit, handleCancel }) => {
  return (
    <form onSubmit={handleSubmit} className="add-product-form">
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="stock_quantity"
        placeholder="Stock Quantity"
        value={form.stock_quantity}
        onChange={handleChange}
        required
      />
      <button type="submit">
        {form.id ? 'Update Product' : 'Add Product'}
      </button>
      {form.id && (
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default AddProductForm;
