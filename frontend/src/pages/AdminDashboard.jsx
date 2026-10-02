import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Building,
  Calendar,
  Ticket,
  TrendingUp,
  Award,
  RefreshCw,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  Layers,
  BarChart3,
  UserCheck
} from 'lucide-react';
import { adminService, eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [verifiers, setVerifiers] = useState([]);
  const [events, setEvents] = useState([]);
  const [revenueReport, setRevenueReport] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ovRes, uRes, orgRes, verRes, evRes, revRes] = await Promise.allSettled([
        adminService.getOverview(),
        adminService.getUsers(),
        adminService.getOrganizers(),
        adminService.getVerifiers(),
        eventService.list(),
        adminService.getEventRevenueReport()
      ]);

      if (ovRes.status === 'fulfilled' && ovRes.value?.data?.data) {
        setOverview(ovRes.value.data.data);
      }
      if (uRes.status === 'fulfilled' && uRes.value?.data?.data) {
        setUsers(uRes.value.data.data);
      }
      if (orgRes.status === 'fulfilled' && orgRes.value?.data?.data) {
        setOrganizers(orgRes.value.data.data);
      }
      if (verRes.status === 'fulfilled' && verRes.value?.data?.data) {
        setVerifiers(verRes.value.data.data);
      }
      if (evRes.status === 'fulfilled' && Array.isArray(evRes.value?.data)) {
        setEvents(evRes.value.data);
      } else if (evRes.status === 'fulfilled' && evRes.value?.data?.data) {
        setEvents(evRes.value.data.data);
      }
      if (revRes.status === 'fulfilled' && revRes.value?.data?.data) {
        setRevenueReport(revRes.value.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setError('Unable to load admin platform data. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
    setSearchTerm('');
  };

  const filteredUsers = users.filter((u) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      u.fullName?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.userId?.toLowerCase().includes(term)
    );
  });

  const filteredOrganizers = organizers.filter((o) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      o.organizationName?.toLowerCase().includes(term) ||
      o.contactPerson?.toLowerCase().includes(term) ||
      o.email?.toLowerCase().includes(term) ||
      o.city?.toLowerCase().includes(term)
    );
  });

  const filteredEvents = events.filter((e) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      e.title?.toLowerCase().includes(term) ||
      e.category?.toLowerCase().includes(term) ||
      e.city?.toLowerCase().includes(term) ||
      e.venueName?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="admin-dashboard-page">
      {/* Header Banner */}
      <div className="admin-header-panel">
        <div className="container">
          <div className="admin-header-flex">
            <div>
              <div className="admin-eyebrow">
                <ShieldAlert size={14} /> PLATFORM ADMINISTRATION
              </div>
              <h1 className="admin-title">System Administration & Intelligence</h1>
              <p className="admin-subtitle">
                System-wide overview for Universal Tickets. Manage platform users, verified organizers, event inventory, and operational metrics.
              </p>
            </div>
            <div className="admin-header-actions">
              <button
                className="button button-secondary"
                onClick={fetchDashboardData}
                disabled={loading}
              >
                <RefreshCw size={15} className={loading ? 'spin' : ''} /> Refresh Data
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="admin-metrics-grid">
            <div className="admin-metric-card">
              <div className="metric-icon blue">
                <Users size={20} />
              </div>
              <div className="metric-data">
                <span className="metric-value">{overview?.customerCount ?? users.length ?? '—'}</span>
                <span className="metric-label">Registered Customers</span>
              </div>
            </div>

            <div className="admin-metric-card">
              <div className="metric-icon purple">
                <Building size={20} />
              </div>
              <div className="metric-data">
                <span className="metric-value">{overview?.organizerCount ?? organizers.length ?? '—'}</span>
                <span className="metric-label">Registered Organizers</span>
              </div>
            </div>

            <div className="admin-metric-card">
              <div className="metric-icon amber">
                <Calendar size={20} />
              </div>
              <div className="metric-data">
                <span className="metric-value">{overview?.eventCount ?? events.length ?? '—'}</span>
                <span className="metric-label">Live Events</span>
              </div>
            </div>

            <div className="admin-metric-card">
              <div className="metric-icon green">
                <Ticket size={20} />
              </div>
              <div className="metric-data">
                <span className="metric-value">{overview?.bookingCount ?? '—'}</span>
                <span className="metric-label">Confirmed Bookings</span>
              </div>
            </div>

            <div className="admin-metric-card">
              <div className="metric-icon red">
                <UserCheck size={20} />
              </div>
              <div className="metric-data">
                <span className="metric-value">{overview?.verifierCount ?? verifiers.length ?? '—'}</span>
                <span className="metric-label">Active Verifiers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container py-6">
        {error && (
          <div className="auth-notice-banner error mb-6">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="admin-tab-nav">
          <button
            className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            <BarChart3 size={16} /> Overview & Analytics
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleTabChange('users')}
          >
            <Users size={16} /> Users ({users.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'organizers' ? 'active' : ''}`}
            onClick={() => handleTabChange('organizers')}
          >
            <Building size={16} /> Organizers ({organizers.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'verifiers' ? 'active' : ''}`}
            onClick={() => handleTabChange('verifiers')}
          >
            <UserCheck size={16} /> Verifiers ({verifiers.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => handleTabChange('events')}
          >
            <Layers size={16} /> Event Catalog ({events.length})
          </button>
        </div>

        {/* Tab 1: Overview & Analytics */}
        {activeTab === 'overview' && (
          <div className="admin-tab-content">
            <div className="admin-section-grid">
              {/* Event Revenue Aggregate Report */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>
                    <TrendingUp size={18} className="text-red" /> Event Revenue & Attendance
                  </h3>
                  <span className="badge-pill">SQL Aggregation</span>
                </div>
                <p className="text-muted text-sm mb-4">
                  Aggregated revenue and ticket booking volume by event.
                </p>

                {revenueReport.length > 0 ? (
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Event Name</th>
                          <th>Category</th>
                          <th>City</th>
                          <th>Total Bookings</th>
                          <th>Total Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {revenueReport.slice(0, 8).map((row, idx) => (
                          <tr key={idx}>
                            <td><strong>{row.event_title || row.title || `Event #${idx + 1}`}</strong></td>
                            <td><span className="tag">{row.category || 'General'}</span></td>
                            <td>{row.city || 'Hyderabad'}</td>
                            <td>{row.total_bookings || row.booking_count || 0}</td>
                            <td><strong className="text-emerald">₹{Number(row.total_revenue || 0).toLocaleString('en-IN')}</strong></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="admin-empty-state">
                    <p className="text-muted">Live event analytics calculated dynamically.</p>
                  </div>
                )}
              </div>

              {/* System Security & Verification Summary */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>
                    <CheckCircle size={18} className="text-emerald" /> Security & Role Governance
                  </h3>
                  <span className="badge-pill active">RBAC Active</span>
                </div>
                <p className="text-muted text-sm mb-4">
                  Current security policy and session state.
                </p>

                <div className="admin-status-list">
                  <div className="admin-status-item">
                    <div className="status-label">
                      <strong>Administrator Session</strong>
                      <small>{currentUser?.email} ({currentUser?.userId})</small>
                    </div>
                    <span className="role-badge badge-admin">ROLE_ADMIN</span>
                  </div>

                  <div className="admin-status-item">
                    <div className="status-label">
                      <strong>Password Hashing Algorithm</strong>
                      <small>Salting + Cryptographic Strength</small>
                    </div>
                    <span className="tag">BCrypt</span>
                  </div>

                  <div className="admin-status-item">
                    <div className="status-label">
                      <strong>Access Token Signing</strong>
                      <small>HMAC-SHA512 with 24h Expiration</small>
                    </div>
                    <span className="tag">JWT 512-bit</span>
                  </div>

                  <div className="admin-status-item">
                    <div className="status-label">
                      <strong>Relational Persistence</strong>
                      <small>MySQL 3NF Normalized Schema</small>
                    </div>
                    <span className="tag">ACID Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Users Management */}
        {activeTab === 'users' && (
          <div className="admin-tab-content">
            <div className="admin-card">
              <div className="admin-table-toolbar">
                <div className="search-box-wrap">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search by customer name, email, or user ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <span className="table-count-tag">
                  Showing {filteredUsers.length} of {users.length} users
                </span>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Full Name</th>
                      <th>Email Address</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((u) => (
                        <tr key={u.userId || u.id}>
                          <td><code>{u.userId || u.id}</code></td>
                          <td><strong>{u.fullName || u.name || 'Anonymous User'}</strong></td>
                          <td>{u.email}</td>
                          <td>{u.phone || '—'}</td>
                          <td>
                            <span className={`status-pill ${u.accountStatus === 'ACTIVE' || !u.accountStatus ? 'active' : 'inactive'}`}>
                              {u.accountStatus || 'ACTIVE'}
                            </span>
                          </td>
                          <td className="text-muted text-sm">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '2026-09-08'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-6 text-muted">
                          No customer accounts found matching "{searchTerm}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Organizers */}
        {activeTab === 'organizers' && (
          <div className="admin-tab-content">
            <div className="admin-card">
              <div className="admin-table-toolbar">
                <div className="search-box-wrap">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search by organization name, contact, city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <span className="table-count-tag">
                  Showing {filteredOrganizers.length} of {organizers.length} organizers
                </span>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Org ID</th>
                      <th>Organization Name</th>
                      <th>Contact Person</th>
                      <th>Email</th>
                      <th>City</th>
                      <th>Registration #</th>
                      <th>Verification Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrganizers.length > 0 ? (
                      filteredOrganizers.map((o) => (
                        <tr key={o.organizerId || o.id}>
                          <td><code>{o.organizerId || o.id}</code></td>
                          <td><strong>{o.organizationName}</strong></td>
                          <td>{o.contactPerson || '—'}</td>
                          <td>{o.email}</td>
                          <td>{o.city || 'Hyderabad'}</td>
                          <td><code>{o.registrationNumber || '—'}</code></td>
                          <td>
                            <span
                              className={`status-pill ${
                                o.verificationStatus === 'APPROVED'
                                  ? 'active'
                                  : o.verificationStatus === 'PENDING'
                                  ? 'pending'
                                  : 'inactive'
                              }`}
                            >
                              {o.verificationStatus || 'APPROVED'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-6 text-muted">
                          No organizers found matching "{searchTerm}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Verifiers */}
        {activeTab === 'verifiers' && (
          <div className="admin-tab-content">
            <div className="admin-card">
              <div className="admin-card-header">
                <h3>
                  <UserCheck size={18} className="text-blue" /> Authorized Compliance Staff
                </h3>
                <span className="badge-pill">Role: VERIFIER</span>
              </div>
              <p className="text-muted text-sm mb-4">
                Platform verification officers authorized to review and approve organizer business registrations.
              </p>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Verifier ID</th>
                      <th>Full Name</th>
                      <th>Official Email</th>
                      <th>Contact Phone</th>
                      <th>Account Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verifiers.map((v) => (
                      <tr key={v.verifierId || v.id}>
                        <td><code>{v.verifierId || v.id}</code></td>
                        <td><strong>{v.fullName}</strong></td>
                        <td>{v.email}</td>
                        <td>{v.phone || '—'}</td>
                        <td>
                          <span className="status-pill active">{v.accountStatus || 'ACTIVE'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Events Catalog */}
        {activeTab === 'events' && (
          <div className="admin-tab-content">
            <div className="admin-card">
              <div className="admin-table-toolbar">
                <div className="search-box-wrap">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search by event title, category, city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <span className="table-count-tag">
                  Showing {filteredEvents.length} of {events.length} events
                </span>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Event Title</th>
                      <th>Category</th>
                      <th>Venue & City</th>
                      <th>Date</th>
                      <th>Starting Price</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.length > 0 ? (
                      filteredEvents.map((ev) => (
                        <tr key={ev.eventId || ev.id}>
                          <td><code>{ev.eventId || ev.id}</code></td>
                          <td><strong>{ev.title}</strong></td>
                          <td><span className="tag">{ev.category}</span></td>
                          <td>{ev.venueName || 'Universal Arena'}, {ev.city || 'Hyderabad'}</td>
                          <td>{ev.eventDate || 'Upcoming'}</td>
                          <td><strong>₹{ev.startingPrice || ev.price || 499}</strong></td>
                          <td>
                            <Link
                              to={`/events/${ev.eventId || ev.id}`}
                              className="button button-ghost-sm"
                            >
                              View Public Page
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-6 text-muted">
                          No events found matching "{searchTerm}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
