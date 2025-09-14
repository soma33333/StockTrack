import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthProvider'
import ProductList from './admin_pages/ProductList'
import SupplierList from './admin_pages/SupplierList'
import AssignmentPanel from './admin_pages/AssignmentPanel'

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user ,loading } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('products')


  const navigate = useNavigate();

  if (loading) {
    return <p>Loading user info...</p>;
  }

  //To restrict access to the admin dashboard for suppliers
  if(user.role=="supplier"){
    return <p>You are restricted to view this page</p>
  }

  const renderSection = () => {
    switch (activeTab) {
      case 'products':
        return <ProductList />
      case 'suppliers':
        return <SupplierList />
      case 'assignments':
        return <AssignmentPanel />
      default:
        return <ProductList />
    }
  }

  const Logout = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/logout.php`, {
        withCredentials: true
      });
      if (res.data.status === 'logged out') {
        alert("Logging Out!...")
        navigate('/login'); 
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
  

  return (
    <div className="admin-dashboard">
    <header className="admin-header">
      <div>
        <h2>Welcome,</h2>
        {user ? <h3>{user.username}!</h3> : <p>Loading user info...</p>}
      </div>
      <nav className="admin-nav">
        <button onClick={() => setActiveTab('products')}>Products</button>
        <button onClick={() => setActiveTab('suppliers')}>Suppliers</button>
        <button onClick={() => setActiveTab('assignments')}>Request Stock</button>
        <button onClick={Logout}>Logout</button>
      </nav>
    </header>
  
    <main className="admin-main">
      {renderSection()}
    </main>
  </div>
  
  )
}


export default AdminDashboard
