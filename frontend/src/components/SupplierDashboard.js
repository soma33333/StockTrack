import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthProvider';
import AssignedProductList from './supplier_pages/AssignedProductList';
import History from './supplier_pages/History';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/SupplierDashboard.css';

const SupplierDashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('assigned');
  const navigate = useNavigate();

  const renderSection = () => {
    switch (activeTab) {
      case 'assigned':
        return <AssignedProductList userId={user.id} />;
      case 'history':
        return <History userId={user.id} />;
      default:
        return <AssignedProductList userId={user.id} />;
    }
  };

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

  if (loading) {
    return <p>Loading user info...</p>;
  }
  if(user.role=="admin"){
    return <p>You are restricted to view this page</p>
  }


  if (!user) {
    return <p>User not authenticated. Please log in.</p>;
  }

  return (
    <div className="supplier-dashboard">
  <header className="supplier-header">
    <div>
      <h2>Welcome,</h2>
      <h3>{user.username}!</h3>
    </div>
    <nav className="supplier-nav">
      <button onClick={() => setActiveTab('assigned')}>Assigned Products</button>
      <button onClick={() => setActiveTab('history')}>History</button>
      <button onClick={Logout}>Logout</button>
    </nav>
  </header>

  <main className="supplier-main">
    {renderSection()}
  </main>
</div>

  );
};

export default SupplierDashboard;
