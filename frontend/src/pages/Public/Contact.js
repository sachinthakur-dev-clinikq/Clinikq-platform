import React, { useState } from 'react';
import PublicNavbar from '../../components/public/PublicNavbar';
import PublicFooter from '../../components/public/PublicFooter';
import { Mail, Phone, MapPin, Clock, CheckCircle, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', clinic_name: '', specialty: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => setSubmitted(true), 500);
  };

  return (
    <div className="public-page">
      <PublicNavbar />
      
      <section className="page-hero">
        <div className="page-hero-content">
          <span className="section-badge">Contact</span>
          <h1>Let's Talk About Your Clinic</h1>
          <p>Book a free demo, ask questions, or just say hello. We're here to help.</p>
        </div>
      </section>

      <section className="contact-section">
        <div className="section-container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <p>Our team typically responds within 2 hours during business hours.</p>
              
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="contact-icon"><Mail size={22} /></div>
                  <div>
                    <h4>Email Us</h4>
                    <p>hello@clinikq.com</p>
                    <span>For general inquiries</span>
                  </div>
                </div>
                <div className="contact-method">
                  <div className="contact-icon"><Phone size={22} /></div>
                  <div>
                    <h4>Call Us</h4>
                    <p>+91 98765 43210</p>
                    <span>Mon-Sat, 9AM-7PM IST</span>
                  </div>
                </div>
                <div className="contact-method">
                  <div className="contact-icon"><MapPin size={22} /></div>
                  <div>
                    <h4>Visit Us</h4>
                    <p>WeWork, BKC</p>
                    <span>Mumbai, Maharashtra</span>
                  </div>
                </div>
                <div className="contact-method">
                  <div className="contact-icon"><Clock size={22} /></div>
                  <div>
                    <h4>Response Time</h4>
                    <p>Within 2 hours</p>
                    <span>During business hours</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper">
              {submitted ? (
                <div className="form-success">
                  <CheckCircle size={64} />
                  <h3>Thank You!</h3>
                  <p>We've received your request. Our team will contact you within 24 hours to schedule your demo.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <h3>Book a Free Demo</h3>
                  <p>Fill out the form and we'll reach out to schedule a personalized walkthrough.</p>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Your Name *</label>
                      <input name="name" value={formData.name} onChange={handleChange} required placeholder="Dr. John Smith" />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@clinic.com" />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone *</label>
                      <input name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 98765 43210" />
                    </div>
                    <div className="form-group">
                      <label>Clinic Name</label>
                      <input name="clinic_name" value={formData.clinic_name} onChange={handleChange} placeholder="City Health Clinic" />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Specialty</label>
                    <select name="specialty" value={formData.specialty} onChange={handleChange}>
                      <option value="">Select your specialty</option>
                      <option value="general">General Practice</option>
                      <option value="cardiology">Cardiology</option>
                      <option value="pediatrics">Pediatrics</option>
                      <option value="orthopedics">Orthopedics</option>
                      <option value="dermatology">Dermatology</option>
                      <option value="gynecology">Gynecology</option>
                      <option value="dentistry">Dentistry</option>
                      <option value="diagnostics">Diagnostics</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Message (Optional)</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} rows="3" placeholder="Tell us about your clinic or any specific requirements..."></textarea>
                  </div>
                  
                  <button type="submit" className="btn-primary-large" style={{ width: '100%' }}>
                    <Send size={18} /> Request Demo
                  </button>
                  
                  <p className="form-note">By submitting, you agree to our Privacy Policy. We'll never spam you.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default Contact;
