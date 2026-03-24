import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/public/PublicNavbar';
import PublicFooter from '../../components/public/PublicFooter';
import { ArrowRight, CheckCircle, X, Phone } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: '2,999',
      period: '/month',
      description: 'Perfect for solo practitioners',
      features: [
        { text: 'Up to 500 appointments/month', included: true },
        { text: '1 Doctor profile', included: true },
        { text: 'Patient management', included: true },
        { text: 'SMS reminders (100/month)', included: true },
        { text: 'Basic analytics', included: true },
        { text: 'Email support', included: true },
        { text: 'AI Receptionist', included: false },
        { text: 'WhatsApp integration', included: false },
        { text: 'Multi-branch support', included: false },
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      price: '7,999',
      period: '/month',
      description: 'For growing clinics',
      features: [
        { text: 'Unlimited appointments', included: true },
        { text: 'Up to 5 Doctors', included: true },
        { text: 'Patient management', included: true },
        { text: 'SMS + WhatsApp reminders', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Priority support', included: true },
        { text: 'AI Receptionist (Basic)', included: true },
        { text: 'WhatsApp integration', included: true },
        { text: 'Multi-branch support', included: false },
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For healthcare networks',
      features: [
        { text: 'Unlimited everything', included: true },
        { text: 'Unlimited Doctors', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'Custom analytics & reports', included: true },
        { text: '24/7 phone support', included: true },
        { text: 'AI Receptionist (Advanced)', included: true },
        { text: 'Full API access', included: true },
        { text: 'Multi-branch support', included: true },
      ],
      cta: 'Contact Sales',
      popular: false
    },
  ];

  const faqs = [
    { q: 'Is there a free trial?', a: 'Yes! All plans come with a 14-day free trial. No credit card required.' },
    { q: 'Can I change plans later?', a: 'Absolutely. You can upgrade or downgrade anytime. Changes reflect immediately.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, UPI, net banking, and bank transfers.' },
    { q: 'Is there a setup fee?', a: 'No setup fees for Starter and Professional. Enterprise may have one-time implementation costs.' },
    { q: 'Do you offer discounts for annual billing?', a: 'Yes! Get 2 months free when you pay annually (17% savings).' },
  ];

  return (
    <div className="public-page">
      <PublicNavbar />
      
      <section className="page-hero">
        <div className="page-hero-content">
          <span className="section-badge">Pricing</span>
          <h1>Simple, Transparent Pricing</h1>
          <p>No hidden fees. No surprises. Start free, scale as you grow.</p>
        </div>
      </section>

      <section className="pricing-section">
        <div className="section-container">
          <div className="pricing-grid">
            {plans.map((plan, i) => (
              <div key={i} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <span className="popular-badge">Most Popular</span>}
                <div className="pricing-header">
                  <h3>{plan.name}</h3>
                  <p className="pricing-desc">{plan.description}</p>
                  <div className="pricing-price">
                    {plan.price !== 'Custom' && <span className="currency">₹</span>}
                    <span className="amount">{plan.price}</span>
                    <span className="period">{plan.period}</span>
                  </div>
                </div>
                <ul className="pricing-features">
                  {plan.features.map((f, j) => (
                    <li key={j} className={f.included ? '' : 'not-included'}>
                      {f.included ? <CheckCircle size={18} /> : <X size={18} />}
                      {f.text}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className={`pricing-cta ${plan.popular ? 'popular' : ''}`}>
                  {plan.cta} <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq-grid">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-card">
                <h4>{faq.q}</h4>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container">
          <h2>Need a Custom Plan?</h2>
          <p>Let's discuss your specific requirements and create a tailored solution.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn-white-large">
              <Phone size={18} /> Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default Pricing;
