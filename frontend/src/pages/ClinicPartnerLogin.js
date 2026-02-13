import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Activity } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ClinicPartnerLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clinicSlug = searchParams.get('clinic');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [branding, setBranding] = useState(null);
  const [loadingBranding, setLoadingBranding] = useState(true);

  useEffect(() => {
    if (!clinicSlug) {
      setError('Clinic not specified');
      setLoadingBranding(false);
      return;
    }
    loadClinicBranding();
  }, [clinicSlug]);

  const loadClinicBranding = async () => {
    try {
      const response = await axios.get(`${API}/public/clinic-branding/${clinicSlug}`);
      setBranding(response.data);
    } catch (err) {
      console.error('Failed to load clinic branding:', err);
      setError('Clinic not found');
    } finally {
      setLoadingBranding(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, { email, password });
      const { token, role, clinic_id } = response.data;

      if (role !== 'clinic_admin') {
        setError('This login is for clinic partners only');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('clinic_id', clinic_id);

      navigate('/clinic/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (loadingBranding) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'hsl(210, 40%, 98%)' }}>
        <div>Loading...</div>
      </div>
    );
  }

  const displayLogo = branding?.logo_path || null;
  const displayName = branding?.display_name || 'Clinic Portal';

  return (
    <div data-testid="clinic-partner-login-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'hsl(210, 40%, 98%)' }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '0.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            {displayLogo ? (
              <img 
                src={displayLogo} 
                alt={displayName}
                style={{ maxWidth: '140px', maxHeight: '90px', objectFit: 'contain' }}
                data-testid="clinic-partner-logo"
              />
            ) : (
              <Activity size={48} color="hsl(199, 89%, 37%)" data-testid="default-clinic-logo" />
            )}
          </div>
          <h1 data-testid="clinic-partner-title" style={{ fontSize: '1.875rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: 'hsl(215, 20%, 15%)' }}>
            {displayName}
          </h1>
          <p style={{ color: 'hsl(215, 16%, 47%)', margin: 0, fontSize: '0.9375rem' }}>Partner Login</p>
        </div>

        <form data-testid="clinic-partner-login-form" onSubmit={handleSubmit}>
          {error && (
            <div data-testid="clinic-partner-error" style={{ background: 'hsl(0, 84%, 95%)', color: 'hsl(0, 70%, 40%)', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              data-testid="clinic-partner-email-input"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              data-testid="clinic-partner-password-input"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button
            data-testid="clinic-partner-submit-button"
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div data-testid="powered-by-clinikq" style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: 'hsl(215, 16%, 67%)' }}>
          Powered by CliniKQ
        </div>
      </div>
    </div>
  );
};

export default ClinicPartnerLogin;
