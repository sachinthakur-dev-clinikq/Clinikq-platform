import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/public/PublicNavbar';
import PublicFooter from '../../components/public/PublicFooter';
import { 
  ArrowRight, Heart, Brain, Baby, Eye, Bone, 
  Stethoscope, Pill, Scissors, Smile, Activity, Users
} from 'lucide-react';

const Specialties = () => {
  const specialties = [
    { icon: Heart, name: 'Cardiology', desc: 'Manage ECG appointments, stress tests, and follow-up schedules' },
    { icon: Brain, name: 'Neurology', desc: 'Track complex treatment plans and medication schedules' },
    { icon: Baby, name: 'Pediatrics', desc: 'Vaccination reminders, growth tracking, and family profiles' },
    { icon: Eye, name: 'Ophthalmology', desc: 'Vision test scheduling, surgery follow-ups, and optical inventory' },
    { icon: Bone, name: 'Orthopedics', desc: 'X-ray/MRI scheduling, physiotherapy tracking, surgery management' },
    { icon: Stethoscope, name: 'General Practice', desc: 'All-in-one solution for family clinics and primary care' },
    { icon: Pill, name: 'Dermatology', desc: 'Photo documentation, procedure scheduling, skincare tracking' },
    { icon: Scissors, name: 'Gynecology', desc: 'Prenatal care tracking, appointment scheduling, lab integration' },
    { icon: Smile, name: 'Dentistry', desc: 'Treatment plans, dental charting, and hygiene appointments' },
    { icon: Activity, name: 'Diagnostics', desc: 'Lab test scheduling, report delivery, and sample tracking' },
    { icon: Users, name: 'Multi-specialty', desc: 'Coordinate between departments seamlessly' },
    { icon: Heart, name: 'Wellness Centers', desc: 'Therapy sessions, packages, and membership management' },
  ];

  const clinicTypes = [
    { type: 'Solo Practitioners', count: '200+', desc: 'Single-doctor clinics using CliniKQ' },
    { type: 'Group Practices', count: '150+', desc: 'Multi-doctor setups with shared scheduling' },
    { type: 'Diagnostic Centers', count: '80+', desc: 'Labs and imaging centers' },
    { type: 'Healthcare Chains', count: '30+', desc: 'Multi-location healthcare networks' },
  ];

  return (
    <div className="public-page">
      <PublicNavbar />
      
      <section className="page-hero">
        <div className="page-hero-content">
          <span className="section-badge">Specialties</span>
          <h1>Built for Every Healthcare Specialty</h1>
          <p>Tailored workflows for 12+ medical specialties. One platform, infinite possibilities.</p>
        </div>
      </section>

      <section className="specialties-grid-section">
        <div className="section-container">
          <div className="specialties-grid">
            {specialties.map((s, i) => (
              <div key={i} className="specialty-card">
                <div className="specialty-icon">
                  <s.icon size={28} />
                </div>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="clinic-types-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Clinics of All Sizes Trust CliniKQ</h2>
            <p>From solo practitioners to large healthcare networks — we scale with you.</p>
          </div>
          <div className="clinic-types-grid">
            {clinicTypes.map((c, i) => (
              <div key={i} className="clinic-type-card">
                <span className="clinic-type-count">{c.count}</span>
                <h3>{c.type}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container">
          <h2>Don't See Your Specialty?</h2>
          <p>We customize CliniKQ for unique workflows. Let's discuss your needs.</p>
          <Link to="/contact" className="btn-white-large">
            Talk to Us <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default Specialties;
