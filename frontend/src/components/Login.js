import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './styles/login.css'; 
import { AuthContext } from '../context/AuthProvider';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/login.php`,
        { username, password },
        { withCredentials: true }
      );

      if (res.data.status === 'success') {
        setUser(res.data.user);
        const role = res.data.user.role;
        if (role === 'admin') {
          alert("Logging In!...")
          navigate('/admindashboard');
        } else if (role === 'supplier') {
          alert("Logging In!...")
          navigate('/supplierdashboard');
        } else {
          alert('Unknown role. Please contact support.');
        }
      } else {
        console.log(res)
        alert(res.data.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>
        Go Back to Home? <Link to='/'>Home</Link>
      </p>
    </div>
  );
}

export default Login;