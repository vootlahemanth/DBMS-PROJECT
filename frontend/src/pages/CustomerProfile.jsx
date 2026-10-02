import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, ShieldCheck, Ticket, LogOut, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function CustomerProfile() {
  const { currentUser, updateProfile, logout } = useAuth();
  const { bookings, selectedCity, setSelectedCity, cities, showToast } = useData();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [isSaved, setIsSaved] = useState(false);

  const myBookings = bookings.filter(
    (b) => b.userId === currentUser?.userId || b.customerEmail === currentUser?.email
  );

  const totalSpent = myBookings
    .filter((b) => b.bookingStatus === 'CONFIRMED')
    .reduce((sum, b) => sum + (b.total || 0), 0);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ name, phone, city: selectedCity });
    setIsSaved(true);
    showToast('Profile updated successfully!', 'success');
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <main className="listing-page">
      <div className="container narrow">
        <div className="listing-head">
          <div>
            <div className="eyebrow ink">SETTINGS & PREFERENCES</div>
            <h1>Customer Profile</h1>
            <p>Manage your account credentials and personal preferences.</p>
          </div>
        </div>

        {/* Profile Metric Cards */}
        <div className="profile-stats-grid">
          <div className="profile-stat-box">
            <span>Total Bookings</span>
            <strong>{myBookings.length}</strong>
            <small>All time orders</small>
          </div>
          <div className="profile-stat-box">
            <span>Active Tickets</span>
            <strong>{myBookings.filter((b) => b.bookingStatus === 'CONFIRMED').length}</strong>
            <small>Upcoming events</small>
          </div>
          <div className="profile-stat-box">
            <span>Total Spent</span>
            <strong>₹{totalSpent.toLocaleString('en-IN')}</strong>
            <small>Verified transactions</small>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="profile-form-card">
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Account ID</label>
              <input value={currentUser?.userId || 'CUS-2026-000001'} disabled className="disabled-input" />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input value={currentUser?.email || ''} disabled className="disabled-input" />
              <small className="field-hint">Email address cannot be changed directly.</small>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Preferred City</label>
              <select
                className="form-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="profile-actions-bar">
              <button type="submit" className="button button-primary">
                {isSaved ? (
                  <>
                    <Check size={16} /> Changes Saved
                  </>
                ) : (
                  'Save Profile'
                )}
              </button>
              <button type="button" className="button button-secondary" onClick={logout}>
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
