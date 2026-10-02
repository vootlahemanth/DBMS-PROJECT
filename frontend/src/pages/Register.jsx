import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Ticket, User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const defaultRole = searchParams.get('role') === 'ORGANIZER' ? 'ORGANIZER' : 'CUSTOMER';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    // CO3 — Topic: Real Authentication & Registration
    // Purpose: Send user registration details including password to backend for BCrypt hashing
    const res = await register({ name, email, phone, password, role });
    if (res.success) {
      if (role === 'ORGANIZER') {
        navigate('/organizer');
      } else {
        navigate('/');
      }
    } else {
      setError(res.message || 'Registration failed.');
    }
  };

  return (
    <main className="auth-page simple-auth">
      <div className="auth-panel centered-panel">
        <div className="auth-content">
          <Link className="brand auth-brand" to="/">
            <span className="brand-mark">
              <Ticket size={18} />
            </span>
            <span className="brand-text">
              UNIVERSAL<span className="brand-red">TICKETS</span>
            </span>
          </Link>

          <div className="eyebrow ink">GET STARTED</div>
          <h1>Create your account.</h1>
          <p>Join Universal Tickets to book tickets, manage events, and track reservations.</p>

          {error && (
            <div className="auth-notice-banner error">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label>Account Type</label>
              <div className="role-selector-pills">
                <button
                  type="button"
                  className={`role-pill ${role === 'CUSTOMER' ? 'active' : ''}`}
                  onClick={() => setRole('CUSTOMER')}
                >
                  Book Tickets (Customer)
                </button>
                <button
                  type="button"
                  className={`role-pill ${role === 'ORGANIZER' ? 'active' : ''}`}
                  onClick={() => setRole('ORGANIZER')}
                >
                  Host Events (Organizer)
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <div className="input-wrap">
                <User size={16} className="input-icon" />
                <input
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrap">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <div className="input-wrap">
                <Phone size={16} className="input-icon" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="button button-primary full auth-submit-btn"
              disabled={authLoading}
            >
              {authLoading ? (
                <>
                  <Loader2 size={16} className="spinner" /> Creating account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
