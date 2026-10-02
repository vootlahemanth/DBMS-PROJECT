import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Calendar,
  Ticket,
  TrendingUp,
  PlusCircle,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import StatusBadge from '../../components/StatusBadge';

export default function OrganizerDashboard() {
  const { currentUser } = useAuth();
  const { events, venues, bookings, organizers } = useData();

  // Find organizer profile
  const orgProfile =
    organizers.find((o) => o.userId === currentUser?.userId || o.email === currentUser?.email) ||
    organizers[0];

  const verificationStatus = orgProfile?.verificationStatus || 'APPROVED';

  // Filter events created by this organizer
  const orgEvents = events.filter(
    (e) => e.organizerId === orgProfile?.id || e.organizerId === 'ORG-2026-000001'
  );

  const orgVenues = venues.filter(
    (v) => v.organizerId === orgProfile?.id || v.organizerId === 'ORG-2026-000001'
  );

  const orgEventIds = orgEvents.map((e) => e.id);
  const orgBookings = bookings.filter((b) => orgEventIds.includes(b.eventId));

  const totalRevenue = orgBookings
    .filter((b) => b.bookingStatus === 'CONFIRMED')
    .reduce((sum, b) => sum + (b.total || 0), 0);

  const totalTicketsSold = orgBookings
    .filter((b) => b.bookingStatus === 'CONFIRMED')
    .reduce((sum, b) => sum + (b.quantity || 0), 0);

  return (
    <main className="dashboard-page">
      <div className="container">
        <div className="dashboard-head">
          <div>
            <div className="eyebrow ink">ORGANIZER WORKSPACE</div>
            <h1>Good day, {orgProfile?.organizationName || 'Skyline Events'}</h1>
            <p>Manage your venues, publish live events, and track ticket revenue in real time.</p>
          </div>
          <div className="dashboard-date">
            <Clock size={15} /> <span>Live Dashboard · {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        <div className={`verification-banner banner-${verificationStatus.toLowerCase()}`}>
          <div className="banner-icon-col">
            {verificationStatus === 'APPROVED' && <ShieldCheck size={28} className="text-green" />}
            {verificationStatus === 'PENDING' && <AlertCircle size={28} className="text-amber" />}
            {verificationStatus === 'REJECTED' && <AlertCircle size={28} className="text-red" />}
          </div>
          <div className="banner-text-col">
            <div className="banner-heading-row">
              <strong>Organization Verification Status: {verificationStatus}</strong>
              <span className={`status-pill pill-${verificationStatus.toLowerCase()}`}>
                {verificationStatus}
              </span>
            </div>
            <p>
              {verificationStatus === 'APPROVED' &&
                'Your company documents (CIN, GST & Address) are verified. You are fully authorized to publish ticketed events.'}
              {verificationStatus === 'PENDING' &&
                'Your verification documents are currently under review by our compliance team. Event publishing will be unlocked upon approval.'}
              {verificationStatus === 'REJECTED' &&
                'Your application was not approved. Please verify your business registration details in your profile settings.'}
            </p>
          </div>
          {verificationStatus === 'APPROVED' && (
            <Link className="button button-primary banner-action-btn" to="/organizer/events/add">
              <PlusCircle size={16} /> Publish New Event
            </Link>
          )}
        </div>

        <div className="stats-grid premium-metrics">
          <div className="stat-card premium-stat-card">
            <div className="stat-topline">
              <span>Published Events</span>
              <span className="metric-trend positive">+12.4%</span>
            </div>
            <strong>{orgEvents.length}</strong>
            <small>Across active cities</small>
          </div>
          <div className="stat-card premium-stat-card">
            <div className="stat-topline">
              <span>Tickets Sold</span>
              <span className="metric-trend positive">+9.1%</span>
            </div>
            <strong>{totalTicketsSold}</strong>
            <small>Confirmed attendee passes</small>
          </div>
          <div className="stat-card premium-stat-card">
            <div className="stat-topline">
              <span>Gross Revenue</span>
              <span className="metric-trend positive">+18.6%</span>
            </div>
            <strong>₹{totalRevenue.toLocaleString('en-IN')}</strong>
            <small>Net of convenience fee</small>
          </div>
          <div className="stat-card premium-stat-card">
            <div className="stat-topline">
              <span>Managed Venues</span>
              <span className="metric-trend neutral">Live</span>
            </div>
            <strong>{orgVenues.length}</strong>
            <small>Auditoriums & stadiums</small>
          </div>
        </div>

        <div className="dashboard-operations-grid">
          <Link to="/organizer/events" className="quick-link-box premium-quick-box">
            <div className="quick-icon gold">
              <Calendar size={22} />
            </div>
            <div>
              <h3>Event Management</h3>
              <p>View, edit, and update your published event listings and seating tiers.</p>
            </div>
            <ArrowRight size={16} className="quick-arrow" />
          </Link>

          <Link to="/organizer/venues" className="quick-link-box premium-quick-box">
            <div className="quick-icon teal">
              <Building2 size={22} />
            </div>
            <div>
              <h3>Venues & Arenas</h3>
              <p>Configure stadium halls, multiplex screens, and seating capacities.</p>
            </div>
            <ArrowRight size={16} className="quick-arrow" />
          </Link>

          <Link to="/organizer/bookings" className="quick-link-box premium-quick-box">
            <div className="quick-icon blue">
              <Ticket size={22} />
            </div>
            <div>
              <h3>Ticket Sales Log</h3>
              <p>Real-time stream of customer bookings, payment modes, and entry codes.</p>
            </div>
            <ArrowRight size={16} className="quick-arrow" />
          </Link>
        </div>

        <div className="dashboard-content premium-layout">
          <div className="dashboard-table-card enterprise-table-card">
            <div className="table-card-head">
              <div>
                <span className="section-kicker">Performance</span>
                <h2>Recent Live Events</h2>
              </div>
              <Link className="text-link" to="/organizer/events">
                View All Events <ArrowRight size={15} />
              </Link>
            </div>

            <div className="events-data-table">
              {orgEvents.slice(0, 4).map((evt) => (
                <div className="table-data-row" key={evt.id}>
                  <img src={evt.image} alt={evt.title} className="table-event-thumb" />
                  <div className="table-event-info">
                    <strong>{evt.title}</strong>
                    <span>
                      {evt.date} · {evt.venue}
                    </span>
                  </div>
                  <div className="table-event-stats">
                    <span>
                      {evt.totalTickets - evt.availableTickets} / {evt.totalTickets} booked
                    </span>
                    <div className="sales-progress-bar">
                      <div
                        className="sales-fill"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(
                              ((evt.totalTickets - evt.availableTickets) / evt.totalTickets) * 100
                            )
                          )}%`
                        }}
                      />
                    </div>
                  </div>
                  <StatusBadge status={evt.availabilityStatus} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
