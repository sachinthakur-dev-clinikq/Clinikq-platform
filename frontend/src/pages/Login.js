import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Activity } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clinicSlug = searchParams.get('clinic'); // Mock subdomain routing
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [branding, setBranding] = useState(null);
  const [loadingBranding, setLoadingBranding] = useState(false);

  useEffect(() => {
    // Load clinic branding if clinic slug exists
    if (clinicSlug) {
      loadClinicBranding();
    }
  }, [clinicSlug]);

  const loadClinicBranding = async () => {
    setLoadingBranding(true);
    try {
      const response = await axios.get(`${API}/public/clinic-branding/${clinicSlug}`);
      setBranding(response.data);
    } catch (err) {
      console.error('Failed to load clinic branding:', err);
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

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      if (clinic_id) {
        localStorage.setItem('clinic_id', clinic_id);
      }

      if (role === 'super_admin') {
        navigate('/super-admin/dashboard');
      } else {
        navigate('/clinic/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Determine logo and title based on branding
  const displayLogo = branding?.logo_path || null;
  const displayName = branding?.display_name || 'CliniKQ';
  const isWhiteLabel = clinicSlug && branding;

  return (
    <div data-testid="login-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'hsl(210, 40%, 98%)' }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '0.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            {displayLogo ? (
              <img 
                src={displayLogo} 
                alt={displayName}
                style={{ maxWidth: '120px', maxHeight: '80px', objectFit: 'contain' }}
                data-testid="clinic-logo"
              />
            ) : (
              <Activity size={48} color="hsl(199, 89%, 37%)" data-testid="default-logo" />
            )}
          </div>
          <h1 data-testid="login-title" style={{ fontSize: '1.875rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: 'hsl(215, 20%, 15%)' }}>
            {displayName}
          </h1>
          <p style={{ color: 'hsl(215, 16%, 47%)', margin: 0, fontSize: '0.9375rem' }}>Sign in to your account</p>
        </div>

        <form data-testid="login-form" onSubmit={handleSubmit}>
          {error && (
            <div data-testid="login-error" style={{ background: 'hsl(0, 84%, 95%)', color: 'hsl(0, 70%, 40%)', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              data-testid="login-email-input"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@clinikq.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              data-testid="login-password-input"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button
            data-testid="login-submit-button"
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {!isWhiteLabel && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'hsl(210, 40%, 98%)', borderRadius: '0.375rem', fontSize: '0.8125rem', color: 'hsl(215, 16%, 47%)' }}>
            <strong>Demo Credentials:</strong><br />
            Super Admin: admin@clinikq.com / Admin@123
          </div>
        )}

        {isWhiteLabel && (
          <div data-testid="powered-by-footer" style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: 'hsl(215, 16%, 67%)' }}>
            Powered by CliniKQ
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
