import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/public/PublicNavbar';
import PublicFooter from '../../components/public/PublicFooter';
import { 
  Calendar, Users, FileText, Clock, 
  BarChart3, Bell, CreditCard, Smartphone, Globe, 
  Link2, MessageSquare, Clipboard, RefreshCw, Settings,
  CheckCircle, ArrowRight
} from 'lucide-react';

const Features = () => {
  const featureCategories = [
    {
      title: 'Appointment Management',
      icon: Calendar,
      features: [
        { name: 'Smart Scheduling', desc: 'Intelligent slot suggestions with conflict prevention', icon: Calendar },
        { name: 'Online Booking Links', desc: 'Patients book via shared link or QR code', icon: Link2 },
        { name: 'Automated Reminders', desc: 'SMS & WhatsApp reminders reduce no-shows', icon: Bell },
        { name: 'Queue Management', desc: 'Real-time wait times and digital token system', icon: Clock },
      ]
    },
    {
      title: 'Patient Management',
      icon: Users,
      features: [
        { name: 'Digital Records', desc: 'Complete patient history, prescriptions & reports', icon: FileText },
        { name: 'Patient Portal', desc: 'Patients access records, book appointments, pay bills', icon: Smartphone },
        { name: 'Visit History', desc: 'Track every visit, diagnosis, and treatment', icon: Clipboard },
        { name: 'Family Profiles', desc: 'Link family members under one account', icon: Users },
      ]
    },
    {
      title: 'Productivity & Automation',
      icon: RefreshCw,
      features: [
        { name: 'Automated Reminders', desc: 'SMS/WhatsApp reminders to reduce missed appointments', icon: Bell },
        { name: 'Smart Templates', desc: 'Reusable prescription and note templates to save time', icon: FileText },
        { name: 'Follow-up Management', desc: 'Track and schedule patient follow-ups easily', icon: RefreshCw },
        { name: 'Quick Notifications', desc: 'Automated follow-ups and health reminders', icon: MessageSquare },
      ]
    },
    {
      title: 'Business Operations',
      icon: BarChart3,
      features: [
        { name: 'Billing & Invoicing', desc: 'Generate GST-compliant invoices instantly', icon: CreditCard },
        { name: 'Revenue Analytics', desc: 'Track earnings, collections & outstanding', icon: BarChart3 },
        { name: 'Staff Management', desc: 'Schedules, attendance & performance tracking', icon: Settings },
        { name: 'Multi-branch Support', desc: 'Manage multiple locations from one dashboard', icon: Globe },
      ]
    },
  ];

  return (
    <div className="public-page">
      <PublicNavbar />
      
      <section className="page-hero">
        <div className="page-hero-content">
          <span className="section-badge">Features</span>
          <h1>Powerful Features for Modern Clinics</h1>
          <p>Everything you need to digitize, automate, and grow your healthcare practice.</p>
        </div>
      </section>

      <section className="features-detail-section">
        <div className="section-container">
          {featureCategories.map((category, i) => (
            <div key={i} className="feature-category">
              <div className="category-header">
                <div className="category-icon">
                  <category.icon size={28} />
                </div>
                <h2>{category.title}</h2>
              </div>
              <div className="category-features">
                {category.features.map((feature, j) => (
                  <div key={j} className="feature-detail-card">
                    <div className="feature-detail-icon">
                      <feature.icon size={22} />
                    </div>
                    <div className="feature-detail-content">
                      <h3>{feature.name}</h3>
                      <p>{feature.desc}</p>
                    </div>
                    <CheckCircle size={20} className="feature-check" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="features-cta-section">
        <div className="cta-container">
          <h2>See All Features in Action</h2>
          <p>Book a personalized demo and discover how CliniKQ can transform your clinic.</p>
          <Link to="/contact" className="btn-white-large">
            Book Free Demo <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default Features;
