import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/public/PublicNavbar';
import PublicFooter from '../../components/public/PublicFooter';
import { 
  Calendar, Users, FileText, Bot, Clock, Shield, 
  ChevronRight, Star, CheckCircle, ArrowRight,
  Stethoscope, Building2, Heart, Activity
} from 'lucide-react';

const Home = () => {
  const features = [
    { icon: Calendar, title: 'Smart Scheduling', desc: 'Automated appointment booking with conflict prevention' },
    { icon: Users, title: 'Patient Management', desc: 'Complete patient records and history at your fingertips' },
    { icon: Bot, title: 'AI Receptionist', desc: 'Handle calls and bookings automatically 24/7' },
    { icon: FileText, title: 'Digital Records', desc: 'Paperless prescriptions and medical reports' },
    { icon: Clock, title: 'Queue Management', desc: 'Real-time wait times and smart scheduling' },
    { icon: Shield, title: 'Data Security', desc: 'HIPAA-compliant secure data storage' },
  ];

  const stats = [
    { value: '500+', label: 'Clinics Onboarded' },
    { value: '2M+', label: 'Appointments Managed' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '40%', label: 'Time Saved Daily' },
  ];

  const testimonials = [
    { name: 'Dr. Priya Sharma', role: 'Cardiologist, Mumbai', text: 'CliniKQ transformed how we manage our clinic. Patient wait times reduced by 60%.', avatar: 'PS' },
    { name: 'Dr. Rajesh Kumar', role: 'Pediatrician, Delhi', text: 'The AI receptionist handles 80% of our appointment calls. Game changer!', avatar: 'RK' },
    { name: 'Dr. Anita Desai', role: 'Dermatologist, Bangalore', text: 'Finally, a system built for Indian clinics. Intuitive and powerful.', avatar: 'AD' },
  ];

  return (
    <div className="public-page">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Star size={14} /> Trusted by 500+ Clinics Across India
          </div>
          <h1>Run Your Clinic —<br /><span className="gradient-text">Not the Chaos</span></h1>
          <p className="hero-subtitle">
            Appointments, Patients, Billing, Staff, Reports — All in One Platform.
            Powered by AI to handle the busywork while you focus on patient care.
          </p>
          <div className="hero-cta">
            <Link to="/contact" className="btn-primary-large">
              Book a Free Demo <ArrowRight size={18} />
            </Link>
            <Link to="/ai-demo" className="btn-secondary-large">
              Try AI Receptionist
            </Link>
          </div>
          <div className="hero-trust">
            <span>Trusted by leading healthcare providers</span>
            <div className="trust-logos">
              <div className="trust-logo"><Stethoscope size={20} /> Apollo</div>
              <div className="trust-logo"><Building2 size={20} /> Fortis</div>
              <div className="trust-logo"><Heart size={20} /> Max</div>
              <div className="trust-logo"><Activity size={20} /> Medanta</div>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="dashboard-preview">
            <div className="preview-header">
              <div className="preview-dots">
                <span></span><span></span><span></span>
              </div>
              <span>CliniKQ Dashboard</span>
            </div>
            <div className="preview-content">
              <div className="preview-sidebar">
                <div className="preview-nav-item active"></div>
                <div className="preview-nav-item"></div>
                <div className="preview-nav-item"></div>
                <div className="preview-nav-item"></div>
              </div>
              <div className="preview-main">
                <div className="preview-stats">
                  <div className="preview-stat-card"></div>
                  <div className="preview-stat-card"></div>
                  <div className="preview-stat-card"></div>
                </div>
                <div className="preview-chart"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, i) => (
            <div key={i} className="stat-item">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Features</span>
            <h2>Everything You Need to Run a Modern Clinic</h2>
            <p>From appointment scheduling to AI-powered patient management — we've got you covered.</p>
          </div>
          <div className="features-grid">
            {features.map((feature, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">
                  <feature.icon size={24} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
          <div className="features-cta">
            <Link to="/features" className="btn-outline">
              View All Features <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Demo Section */}
      <section className="ai-section">
        <div className="section-container">
          <div className="ai-content">
            <span className="section-badge purple">AI Powered</span>
            <h2>Meet Your AI Receptionist</h2>
            <p>Handle patient calls, book appointments, send reminders, and manage queries — all automatically. Available 24/7, never takes a break.</p>
            <ul className="ai-features">
              <li><CheckCircle size={18} /> Answers calls in local languages</li>
              <li><CheckCircle size={18} /> Books & reschedules appointments</li>
              <li><CheckCircle size={18} /> Sends automated reminders</li>
              <li><CheckCircle size={18} /> Handles common patient queries</li>
            </ul>
            <Link to="/ai-demo" className="btn-primary-large">
              Experience AI Demo <ArrowRight size={18} />
            </Link>
          </div>
          <div className="ai-visual">
            <div className="ai-chat-preview">
              <div className="chat-message incoming">
                <span className="chat-avatar">P</span>
                <div className="chat-bubble">"Hello, I'd like to book an appointment with Dr. Sharma for tomorrow."</div>
              </div>
              <div className="chat-message outgoing">
                <div className="chat-bubble">"Of course! Dr. Sharma has slots available at 10:30 AM and 2:00 PM tomorrow. Which would you prefer?"</div>
                <span className="chat-avatar ai">AI</span>
              </div>
              <div className="chat-message incoming">
                <span className="chat-avatar">P</span>
                <div className="chat-bubble">"2 PM works for me."</div>
              </div>
              <div className="chat-message outgoing">
                <div className="chat-bubble">"Your appointment is confirmed for tomorrow at 2:00 PM. You'll receive a confirmation SMS shortly."</div>
                <span className="chat-avatar ai">AI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Testimonials</span>
            <h2>Loved by Doctors Across India</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                </div>
                <p>"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.avatar}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Transform Your Clinic?</h2>
          <p>Join 500+ clinics already using CliniKQ to deliver better patient care.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn-white-large">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/pricing" className="btn-outline-white">View Pricing</Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default Home;
