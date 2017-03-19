import React from 'react';
import './Navigation.css';

// For map view, we do not give red/green colors
const Navigation = () =>
  (
    <nav className="sidebarnav navbar">
      <div className="navbar-header" id="world-top">
        <button
          type="button" className="navbar-toggle"
          data-toggle="collapse" data-target=".navbar-collapse"
        >
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
        <a className="navbar-brand">prepojenia.verejne.digital</a>
      </div>
      <div className="navbar-collapse collapse">
        <ul className="nav navbar-nav">
          <li><a href="../index.html">verejne.digital</a></li>
          <li><a href="http://www.facebook.com/verejne.digital" target="_blank" rel="noopener noreferrer">kontaktuj nás na Facebooku</a></li>
          <li><a href="../obstaravania/index.html">obstaravania.verejne.digital</a></li>
        </ul>
      </div>
    </nav>
  );


export default Navigation;
