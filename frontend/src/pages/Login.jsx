import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Ticket, Lock, Mail, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, isAuthenticated, currentUser, authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Extract redirect url from query param or state
  const queryParams = new URLSearchParams(location.search);
  const redirectParam = queryParams.get('redirect');
  const sessionExpired = queryParams.get('session_expired');

  useEffect(() => {
    if (sessionExpired) {
      setError('Your session has expired. Please log in again.');
    } else if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location, sessionExpired]);

  // If already authenticated, redirect according to role
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (redirectParam) {
        navigate(decodeURIComponent(redirectParam), { replace: true });
      } else if (currentUser.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else if (currentUser.role === 'ORGANIZER') {
        navigate('/organizer', { replace: true });
      } else if (currentUser.role === 'VERIFIER') {
        navigate('/verifier', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, currentUser, navigate, redirectParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    const res = await login(email, password);
    if (!res.success) {
      setError(res.message || 'Invalid credentials. Please try again.');
    } else {
      // Role redirection
      const user = res.user;
      if (redirectParam) {
        navigate(decodeURIComponent(redirectParam), { replace: true });
      } else if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'ORGANIZER') {
        navigate('/organizer', { replace: true });
      } else if (user.role === 'VERIFIER') {
        navigate('/verifier', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  };

  return (
    <main className="auth-page">
      {/* Left Branding Art Panel */}
      <div className="auth-art">
        <div className="auth-art-copy">
          <span className="auth-tag">UNIVERSAL TICKETS</span>
          <h1>
            Good nights
            <br />
            start here.
          </h1>
          <p>
            One account for all your concerts, blockbuster movies, cricket matches, and theatre evenings across India.
          </p>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="auth-panel">
        <div className="auth-content">
          <Link className="brand auth-brand" to="/">
            <span className="brand-mark">
              <Ticket size={18} />
            </span>
            <span className="brand-text">
              UNIVERSAL<span className="brand-red">TICKETS</span>
            </span>
          </Link>

          <div className="eyebrow ink">ACCOUNT ACCESS</div>
          <h1>Log in to continue.</h1>
          <p>Enter your credentials to access your tickets and dashboard.</p>

          {successMessage && (
            <div className="auth-notice-banner info">
              <AlertCircle size={15} /> {successMessage}
            </div>
          )}

          {error && (
            <div className="auth-notice-banner error">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrap">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="auth-options">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked /> Remember my session
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); setError('Password reset instructions sent to registered email.'); }}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="button button-primary full auth-submit-btn"
              disabled={authLoading}
            >
              {authLoading ? (
                <>
                  <Loader2 size={16} className="spinner" /> Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">
            New to Universal Tickets? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
