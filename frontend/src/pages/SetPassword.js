import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Activity, Check } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid activation link');
      setVerifying(false);
      return;
    }
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${API}/public/verify-token/${token}`);
      setTokenValid(true);
      setUserInfo(response.data);
    } catch (err) {
      setError('Invalid or expired activation link');
      setTokenValid(false);
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API}/public/set-password`, { token, password });
      setSuccess(true);
      
      // Redirect to clinic login after 3 seconds
      setTimeout(() => {
        if (userInfo?.clinic_slug) {
          navigate(`/clinicpartner/clinicloginpage?clinic=${userInfo.clinic_slug}`);
        } else {
          navigate('/login');
        }
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to set password');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'hsl(210, 40%, 98%)' }}>
        <div>Verifying activation link...</div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'hsl(210, 40%, 98%)' }}>
        <div style={{ background: 'white', padding: '3rem', borderRadius: '0.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ color: 'hsl(0, 84%, 60%)', marginBottom: '1rem' }}>
            <Activity size={48} style={{ margin: '0 auto' }} />
          </div>
          <h2>Invalid Activation Link</h2>
          <p style={{ color: 'hsl(215, 16%, 47%)' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'hsl(210, 40%, 98%)' }}>
        <div data-testid="success-message" style={{ background: 'white', padding: '3rem', borderRadius: '0.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ color: 'hsl(158, 64%, 38%)', marginBottom: '1rem' }}>
            <Check size={64} style={{ margin: '0 auto' }} />
          </div>
          <h2 style={{ color: 'hsl(158, 64%, 38%)' }}>Account Activated!</h2>
          <p style={{ color: 'hsl(215, 16%, 47%)' }}>Your password has been set successfully. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="set-password-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'hsl(210, 40%, 98%)' }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '0.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Activity size={48} color="hsl(199, 89%, 37%)" />
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: 'hsl(215, 20%, 15%)' }}>Set Your Password</h1>
          <p style={{ color: 'hsl(215, 16%, 47%)', margin: 0, fontSize: '0.9375rem' }}>
            Welcome, {userInfo?.name}
          </p>
          <p style={{ color: 'hsl(215, 16%, 67%)', margin: '0.25rem 0 0 0', fontSize: '0.8125rem' }}>
            {userInfo?.clinic_name}
          </p>
        </div>

        <form data-testid="set-password-form" onSubmit={handleSubmit}>
          {error && (
            <div data-testid="set-password-error" style={{ background: 'hsl(0, 84%, 95%)', color: 'hsl(0, 70%, 40%)', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">New Password *</label>
            <input
              data-testid="password-input"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Minimum 8 characters"
              minLength="8"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              data-testid="confirm-password-input"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter password"
              minLength="8"
            />
          </div>

          <button
            data-testid="set-password-submit"
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? 'Setting Password...' : 'Activate Account'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: 'hsl(215, 16%, 67%)' }}>
          Powered by CliniKQ
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
