import React from 'react';
import './Footer.css';
function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-column">
          <h3>LearnHub</h3>
          <div className="language-selector">
            English <span style={{ marginLeft: '5px' }}>▼</span>
          </div>
          <p className="copyright">&copy; 2023 LearnHub, Inc.</p>
        </div>
        
        <div className="footer-column">
          <h3>Learn</h3>
          <ul className="footer-links">
            <li><a href="#">Popular Courses</a></li>
            <li><a href="#">Skills Assessment</a></li>
            <li><a href="#">Categories</a></li>
            <li><a href="#">Certificates</a></li>
            <li><a href="#">Free Courses</a></li>
            <li><a href="#">For Enterprise</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>Company</h3>
          <ul className="footer-links">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Investors</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>Resources</h3>
          <ul className="footer-links">
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Help & Support</a></li>
            <li><a href="#">Affiliate Program</a></li>
            <li><a href="#">Become an Instructor</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Sitemap</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-logo">LearnHub</div>
        <div className="copyright">All rights reserved. &copy; 2023 LearnHub, Inc.</div>
      </div>
    </footer>
  );
}

export default Footer;