import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Home() {
  return (
    <div className="container">
      <header className="header">
        <h1>Inventory Management System</h1>
      </header>

      <nav className="nav">
        <Link to="/login">Login</Link>
      </nav>

      <main>
        <p>
          Welcome to your inventory dashboard. Track, manage, and organize your
          items efficiently.
        </p>
      </main>
    </div>
  );
}

export default Home;
