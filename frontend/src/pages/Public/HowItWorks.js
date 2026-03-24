import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/public/PublicNavbar';
import PublicFooter from '../../components/public/PublicFooter';
import { ArrowRight, CheckCircle, Calendar, Users, Bot, BarChart3 } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Quick Setup',
      description: 'Sign up and configure your clinic in under 15 minutes. Add doctors, set schedules, and customize your branding.',
      icon: Calendar,
      details: ['Create your account', 'Add clinic details & branding', 'Configure doctor schedules', 'Set up appointment slots']
    },
    {
      number: '02',
      title: 'Import & Organize',
      description: 'Migrate existing patient data seamlessly. Our team assists with data import from spreadsheets or other systems.',
      icon: Users,
      details: ['Import patient records', 'Organize by demographics', 'Link family profiles', 'Set up patient portal access']
    },
    {
      number: '03',
      title: 'Go Live',
      description: 'Start accepting appointments online. Patients can book via website, WhatsApp, or through your AI receptionist.',
      icon: Bot,
      details: ['Enable online booking', 'Activate AI receptionist', 'Set up notifications', 'Train staff (1-hour session)']
    },
    {
      number: '04',
      title: 'Grow & Optimize',
      description: 'Use analytics to understand patient flow, revenue trends, and operational efficiency. Make data-driven decisions.',
      icon: BarChart3,
      details: ['Track key metrics', 'Reduce no-shows by 60%', 'Increase patient satisfaction', 'Scale to multiple branches']
    },
  ];

  return (
    <div className="public-page">
      <PublicNavbar />
      
      <section className="page-hero">
        <div className="page-hero-content">
          <span className="section-badge">How It Works</span>
          <h1>Up and Running in Hours, Not Weeks</h1>
          <p>Our streamlined onboarding gets your clinic digital-ready faster than you'd expect.</p>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="section-container">
          <div className="steps-timeline">
            {steps.map((step, i) => (
              <div key={i} className="step-card">
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <div className="step-icon">
                    <step.icon size={28} />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <ul className="step-details">
                    {step.details.map((detail, j) => (
                      <li key={j}><CheckCircle size={16} /> {detail}</li>
                    ))}
                  </ul>
                </div>
                {i < steps.length - 1 && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="implementation-section">
        <div className="section-container">
          <div className="implementation-grid">
            <div className="implementation-content">
              <h2>What's Included in Setup</h2>
              <ul className="implementation-list">
                <li><CheckCircle size={20} /> Dedicated onboarding specialist</li>
                <li><CheckCircle size={20} /> Data migration assistance</li>
                <li><CheckCircle size={20} /> Staff training (virtual or on-site)</li>
                <li><CheckCircle size={20} /> Custom branding setup</li>
                <li><CheckCircle size={20} /> 24/7 technical support</li>
                <li><CheckCircle size={20} /> 30-day satisfaction guarantee</li>
              </ul>
            </div>
            <div className="implementation-stats">
              <div className="impl-stat">
                <span className="impl-stat-value">15 min</span>
                <span className="impl-stat-label">Average setup time</span>
              </div>
              <div className="impl-stat">
                <span className="impl-stat-value">1 hour</span>
                <span className="impl-stat-label">Staff training</span>
              </div>
              <div className="impl-stat">
                <span className="impl-stat-value">24/7</span>
                <span className="impl-stat-label">Support available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Get Started?</h2>
          <p>Join hundreds of clinics already transforming their operations with CliniKQ.</p>
          <Link to="/contact" className="btn-white-large">
            Book Free Demo <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default HowItWorks;
