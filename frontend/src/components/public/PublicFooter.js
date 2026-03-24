import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react';

const PublicFooter = () => {
  return (
    <footer className="public-footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <Activity size={28} />
              <span>CliniKQ</span>
            </div>
            <p>Empowering clinics with smart operational tools. From appointments to automation — we handle the chaos so you can focus on care.</p>
            <div className="footer-social">
              <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Product</h4>
            <Link to="/features">Features</Link>
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/specialties">Specialties</Link>
          </div>

          <div className="footer-links">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/specialties">Specialties</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/login">Login</Link>
          </div>

          <div className="footer-contact">
            <h4>Get in Touch</h4>
            <div className="contact-item">
              <Mail size={16} />
              <span>hello@clinikq.com</span>
            </div>
            <div className="contact-item">
              <Phone size={16} />
              <span>+91 98765 43210</span>
            </div>
            <div className="contact-item">
              <MapPin size={16} />
              <span>Mumbai, India</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 CliniKQ. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
