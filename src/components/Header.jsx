import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo_MiVoto2.png";

const Header = () => {
  return (
    <header className="header-elegante">
      <div className="header-container">
        <Link to="/" className="logo-section">
          <img src={logo} alt="MiVoto" className="logo-header" />
          <div className="logo-text">
            <h2>MiVoto</h2>
            <p>Sistema Electoral</p>
          </div>
        </Link>
        
        <nav className="nav-header">
          <Link to="/login-voluntario" className="nav-link">
            <span className="nav-icon">👤</span>
            Soy Voluntario
          </Link>
          <Link to="/login-admin" className="nav-link">
            <span className="nav-icon">⚙️</span>
            Soy Administrador
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
