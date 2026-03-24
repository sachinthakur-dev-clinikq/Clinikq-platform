import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/public/PublicNavbar';
import PublicFooter from '../../components/public/PublicFooter';
import { ArrowRight, Target, Heart, Lightbulb, Users, Award, Globe } from 'lucide-react';

const About = () => {
  const team = [
    { name: 'Dr. Arun Mehta', role: 'Founder & CEO', initials: 'AM', bio: 'Former healthcare consultant with 15+ years in hospital operations' },
    { name: 'Priya Iyer', role: 'CTO', initials: 'PI', bio: 'Ex-Google engineer passionate about healthcare technology' },
    { name: 'Rahul Kapoor', role: 'Head of Product', initials: 'RK', bio: 'Built products at multiple health-tech startups' },
    { name: 'Dr. Sneha Patel', role: 'Medical Advisor', initials: 'SP', bio: 'Practicing cardiologist and digital health advocate' },
  ];

  const values = [
    { icon: Target, title: 'Mission-Driven', desc: 'Every feature we build serves one goal: better patient outcomes through efficient clinic operations.' },
    { icon: Heart, title: 'Doctor-First Design', desc: 'We obsess over making technology that doctors actually want to use, not just what looks good on paper.' },
    { icon: Lightbulb, title: 'Innovation', desc: 'From AI receptionists to predictive analytics, we\'re constantly pushing boundaries in health-tech.' },
    { icon: Users, title: 'Partnership', desc: 'We don\'t just sell software. We partner with clinics to transform their operations.' },
  ];

  const milestones = [
    { year: '2022', event: 'CliniKQ founded with a vision to digitize Indian healthcare' },
    { year: '2023', event: 'Launched AI Receptionist, first of its kind in India' },
    { year: '2024', event: 'Crossed 300 clinics; expanded to 15 cities' },
    { year: '2025', event: 'Series A funding; launched multi-specialty platform' },
    { year: '2026', event: '500+ clinics; 2M appointments managed' },
  ];

  return (
    <div className="public-page">
      <PublicNavbar />
      
      <section className="page-hero">
        <div className="page-hero-content">
          <span className="section-badge">About Us</span>
          <h1>Making Healthcare Accessible, Efficient, and Human</h1>
          <p>We're on a mission to eliminate operational chaos from healthcare so doctors can focus on what matters most — their patients.</p>
        </div>
      </section>

      <section className="about-story-section">
        <div className="section-container">
          <div className="story-content">
            <h2>Our Story</h2>
            <p>
              CliniKQ was born from frustration. Our founder, Dr. Arun Mehta, spent years watching talented doctors 
              struggle with appointment chaos, no-show patients, and administrative overload. He saw clinics lose 
              patients not because of care quality, but because of poor operational systems.
            </p>
            <p>
              In 2022, he assembled a team of doctors, engineers, and designers to build what he wished existed: 
              a clinic management platform that actually works for Indian healthcare. Not a bloated EHR, not a 
              glorified calendar — but an intelligent operational partner.
            </p>
            <p>
              Today, CliniKQ powers 500+ clinics across India, managing over 2 million appointments annually. 
              But we're just getting started.
            </p>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="section-container">
          <div className="section-header">
            <h2>What Drives Us</h2>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="value-card">
                <div className="value-icon">
                  <v.icon size={28} />
                </div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="timeline-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Our Journey</h2>
          </div>
          <div className="timeline">
            {milestones.map((m, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-year">{m.year}</div>
                <div className="timeline-event">{m.event}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Leadership Team</h2>
            <p>Experienced operators, doctors, and technologists united by a common mission.</p>
          </div>
          <div className="team-grid">
            {team.map((t, i) => (
              <div key={i} className="team-card">
                <div className="team-avatar">{t.initials}</div>
                <h3>{t.name}</h3>
                <span className="team-role">{t.role}</span>
                <p>{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container">
          <h2>Join the CliniKQ Family</h2>
          <p>Be part of the healthcare revolution. Start your free trial today.</p>
          <Link to="/contact" className="btn-white-large">
            Get Started <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default About;
