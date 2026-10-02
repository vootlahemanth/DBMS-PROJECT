import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Ticket,
  CalendarDays,
  MapPin,
  Clock,
  Printer,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Compass,
  Loader2
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=85';

export default function MyBookings() {
  const location = useLocation();
  const { cancelBooking, showToast, events } = useData();
  const { currentUser } = useAuth();

  const isCancellationsRoute = location.pathname.includes('cancellations');
  const [activeTab, setActiveTab] = useState(isCancellationsRoute ? 'cancelled' : 'upcoming');
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('Change of plans');
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserBookings = useCallback(async () => {
    if (!currentUser?.userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await bookingService.getByUser(currentUser.userId);
      const rawList = Array.isArray(res.data) ? res.data : [];
      
      // Match event info
      const enriched = rawList.map((b) => {
        const evt = (events || []).find((e) => e.id === b.eventId || e.eventId === b.eventId) || {};
        return {
          ...b,
          eventTitle: evt.title || `Event ${b.eventId}`,
          eventType: evt.type || 'Event',
          eventImage: evt.image || FALLBACK_IMAGE,
          date: evt.date || (b.bookingDate ? b.bookingDate.split('T')[0] : 'Upcoming'),
          time: evt.time || '18:00',
          venue: evt.venue || 'Universal Arena',
          city: evt.city || 'Hyderabad',
          total: b.totalAmount || b.total || 0,
          ticketTier: b.ticketCategory || b.ticketTier || 'Standard',
          paymentMethod: b.paymentMethod || 'UPI'
        };
      });

      setUserBookings(enriched);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load user bookings:', err);
      setLoading(false);
    }
  }, [currentUser?.userId, events]);

  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  const upcomingList = userBookings.filter((b) => b.bookingStatus !== 'CANCELLED');
  const cancelledList = userBookings.filter((b) => b.bookingStatus === 'CANCELLED');
  const displayedList = activeTab === 'upcoming' ? upcomingList : cancelledList;

  const handleConfirmCancel = async () => {
    if (!cancellingBookingId) return;
    const ok = await cancelBooking(cancellingBookingId, cancellationReason);
    if (ok) {
      setCancellingBookingId(null);
      fetchUserBookings();
    }
  };

  return (
    <main className="dashboard-page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-head">
          <div>
            <div className="eyebrow ink">CUSTOMER PORTAL</div>
            <h1>My Bookings & Tickets</h1>
            <p>
              Manage admissions, download tickets, or request refunds for your reservations.
            </p>
          </div>
          <Link to="/events" className="button button-primary">
            <Compass size={15} /> Book More Tickets
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="dashboard-tabs">
          <button
            className={`dash-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <Ticket size={16} /> Upcoming Bookings ({upcomingList.length})
          </button>
          <button
            className={`dash-tab ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            <XCircle size={16} /> Cancelled & Past ({cancelledList.length})
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <Loader2 size={36} className="spin" style={{ margin: '0 auto 1rem', color: '#c5a059' }} />
            <p>Loading your bookings...</p>
          </div>
        ) : displayedList.length > 0 ? (
          <div className="bookings-cards-stack">
            {displayedList.map((b) => {
              const isCancelled = b.bookingStatus === 'CANCELLED';
              return (
                <div key={b.bookingId} className={`booking-ticket-card ${isCancelled ? 'cancelled-card' : ''}`}>
                  <div className="ticket-card-visual">
                    <img
                      src={b.eventImage || FALLBACK_IMAGE}
                      alt={b.eventTitle}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                      }}
                    />
                    <span className="ticket-type-pill">{b.eventType}</span>
                  </div>

                  <div className="ticket-card-content">
                    <div className="ticket-head-row">
                      <div>
                        <span className="booking-id-tag">{b.bookingId}</span>
                        <h3>{b.eventTitle}</h3>
                      </div>
                      <StatusBadge status={b.bookingStatus} />
                    </div>

                    <div className="ticket-meta-grid">
                      <div className="meta-item">
                        <CalendarDays size={14} />
                        <span>{b.date} · {b.time}</span>
                      </div>
                      <div className="meta-item">
                        <MapPin size={14} />
                        <span>{b.venue}, {b.city}</span>
                      </div>
                      <div className="meta-item">
                        <Ticket size={14} />
                        <span>{b.quantity} × {b.ticketTier} Tier</span>
                      </div>
                      <div className="meta-item">
                        <Clock size={14} />
                        <span>Paid via {b.paymentMethod}</span>
                      </div>
                    </div>

                    <div className="ticket-footer-row">
                      <div className="ticket-price-total">
                        <small>Total Paid</small>
                        <strong>₹{(b.total || b.totalAmount || 0).toLocaleString('en-IN')}</strong>
                      </div>

                      <div className="ticket-actions">
                        {!isCancelled ? (
                          <>
                            <button
                              className="button button-ghost-sm"
                              onClick={() => window.print()}
                            >
                              <Printer size={14} /> Print Pass
                            </button>
                            <button
                              className="button button-danger-sm"
                              onClick={() => setCancellingBookingId(b.bookingId)}
                            >
                              Cancel Booking
                            </button>
                          </>
                        ) : (
                          <div className="refund-badge">
                            <CheckCircle2 size={13} /> {b.refundStatus || 'REFUNDED'} (₹{b.total || b.totalAmount})
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <Ticket size={44} className="empty-state-icon" />
            <h3>No {activeTab} bookings found</h3>
            <p>
              {activeTab === 'upcoming'
                ? "You don't have any upcoming reservations. Browse the latest movies and concerts to book your next night out."
                : 'You have no cancelled or refunded tickets on record.'}
            </p>
            <Link to="/events" className="button button-primary">
              Discover Live Shows
            </Link>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {cancellingBookingId && (
          <div className="modal-backdrop">
            <div className="modal-dialog">
              <div className="modal-icon-wrap danger">
                <AlertTriangle size={24} />
              </div>
              <h3>Cancel Ticket Reservation?</h3>
              <p>
                Are you sure you want to cancel booking <strong>{cancellingBookingId}</strong>? 100% refund will be credited back to your original payment method.
              </p>

              <div className="form-group" style={{ textAlign: 'left', marginTop: '16px' }}>
                <label>Reason for Cancellation</label>
                <select
                  className="form-select"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                >
                  <option value="Change of plans">Change of plans / Schedule conflict</option>
                  <option value="Booked by mistake">Booked by mistake</option>
                  <option value="Health emergency">Health emergency</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  className="button button-ghost"
                  onClick={() => setCancellingBookingId(null)}
                >
                  Keep Booking
                </button>
                <button
                  className="button button-danger"
                  onClick={handleConfirmCancel}
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
