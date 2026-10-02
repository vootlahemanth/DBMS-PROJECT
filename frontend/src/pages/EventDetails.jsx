import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  MapPin,
  Check,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Ticket,
  AlertCircle,
  Compass,
  Loader2
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/api';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=85';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, showToast } = useData();
  const { isAuthenticated } = useAuth();

  const [event, setEvent] = useState(() => {
    return (events || []).find((e) => e.id === id || e.eventId === id);
  });
  const [loading, setLoading] = useState(!event);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const existing = (events || []).find((e) => e.id === id || e.eventId === id);
    if (existing) {
      setEvent(existing);
      setLoading(false);
      return;
    }

    // Fetch directly from API
    eventService.getById(id)
      .then((res) => {
        if (res.data) {
          const raw = res.data;
          const basePrice = 350;
          const defaultTiers = [
            { name: 'General', price: basePrice, available: 150, desc: 'General admission entry' },
            { name: 'Regular', price: Math.floor(basePrice * 1.5), available: 100, desc: 'Reserved standard seating' },
            { name: 'Premium', price: Math.floor(basePrice * 2.5), available: 40, desc: 'Prime viewing sightlines' },
            { name: 'VIP', price: Math.floor(basePrice * 4.0), available: 10, desc: 'VIP hospitality & lounge access' }
          ];
          setEvent({
            id: raw.eventId || id,
            eventId: raw.eventId || id,
            title: raw.eventName || 'Untitled Event',
            eventName: raw.eventName || 'Untitled Event',
            type: raw.eventType || 'Event',
            eventType: raw.eventType || 'Event',
            category: (raw.eventType || 'activities').toLowerCase(),
            description: raw.description || 'Join us for this premier live event.',
            date: raw.eventDate || 'Upcoming',
            time: raw.startTime || '18:00',
            language: raw.language || 'English',
            venue: raw.venueId ? `Venue (${raw.venueId})` : 'Universal Arena',
            city: 'Hyderabad',
            price: basePrice,
            availableTickets: 300,
            tiers: defaultTiers,
            image: FALLBACK_IMAGE
          });
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id, events]);

  if (loading) {
    return (
      <main className="details-page">
        <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
          <Loader2 size={40} className="spin" style={{ margin: '0 auto 1.5rem', color: '#c5a059' }} />
          <h2>Loading Event Details...</h2>
        </div>
      </main>
    );
  }

  // If event does not exist, render clean 404 Event Not Found UI
  if (notFound || !event) {
    return (
      <main className="details-page">
        <div className="container">
          <div className="empty-state not-found-state">
            <AlertCircle size={48} className="empty-state-icon" />
            <h2>Event Not Found</h2>
            <p>
              The event you are looking for does not exist or may have expired. Explore our live catalog for current concerts, movies, and shows.
            </p>
            <Link to="/events" className="button button-primary">
              <Compass size={16} /> Back to All Events
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const defaultTiers = [
    { name: 'General', price: event.price || 350, available: 40, desc: 'Standard entry with full event access' },
    { name: 'Regular', price: Math.floor((event.price || 350) * 1.5), available: 30, desc: 'Elevated seating sightlines' },
    { name: 'Premium', price: Math.floor((event.price || 350) * 2.5), available: 12, desc: 'Best available prime zone' },
    { name: 'VIP', price: Math.floor((event.price || 350) * 4.0), available: 4, desc: 'Front-row VIP lounge & express lane' }
  ];

  const tiers = event.tiers && event.tiers.length > 0 ? event.tiers : defaultTiers;

  const [selectedTierName, setSelectedTierName] = useState(() => {
    const avail = tiers.find((t) => t.available > 0);
    return avail ? avail.name : tiers[0].name;
  });

  const [quantity, setQuantity] = useState(2);

  const selectedTier = tiers.find((t) => t.name === selectedTierName) || tiers[0];
  const isTierSoldOut = (selectedTier.available || 0) === 0;
  const isEventSoldOut = (event.availableTickets || 0) === 0;

  const unitPrice = selectedTier.price || event.price || 0;
  const totalAmount = unitPrice * quantity;

  // Handle Book Now Click with Auth Check
  const handleProceedToBooking = () => {
    if (isTierSoldOut || isEventSoldOut) {
      showToast('This ticket category is currently sold out.', 'error');
      return;
    }

    const bookingUrl = `/booking/${event.id}?tier=${encodeURIComponent(selectedTier.name)}&qty=${quantity}`;

    if (!isAuthenticated) {
      // Save pending booking intent to sessionStorage
      try {
        sessionStorage.setItem(
          'ut_pending_booking',
          JSON.stringify({ eventId: event.id, tier: selectedTier.name, qty: quantity })
        );
      } catch (err) {}

      showToast('Please log in to continue booking your tickets.', 'info');
      navigate(`/login?redirect=${encodeURIComponent(bookingUrl)}`, {
        state: { message: 'Please log in to continue booking your tickets.' }
      });
      return;
    }

    // Authenticated user continues into booking checkout
    navigate(bookingUrl);
  };

  const handleQtyChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty < 1) return;
    if (newQty > selectedTier.available) {
      showToast(`Only ${selectedTier.available} ${selectedTier.name} tickets are available.`, 'warning');
      return;
    }
    if (newQty > 10) {
      showToast('Maximum 10 tickets per transaction allowed.', 'warning');
      return;
    }
    setQuantity(newQty);
  };

  return (
    <main className="details-page">
      <div className="container">
        {/* Back Link */}
        <Link className="back-link" to="/events">
          <ChevronLeft size={16} /> All experiences
        </Link>

        <div className="detail-layout">
          {/* Left Column: Visual Poster */}
          <div className="detail-visual">
            <img
              src={event.image || FALLBACK_IMAGE}
              alt={event.title || 'Event poster'}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_IMAGE;
              }}
            />
            <div className="detail-caption">
              <span className="caption-tag">{event.type || 'Experience'}</span>
              <span className="caption-id">{event.id}</span>
            </div>
          </div>

          {/* Right Column: Event Info & Ticket Selector */}
          <div className="detail-info">
            <div className="detail-eyebrow">
              <span className="type-badge">{(event.type || 'Live').toUpperCase()}</span>
              <span className="verified">
                <Check size={12} /> VERIFIED ORGANIZER
              </span>
            </div>

            <h1>{event.title || 'Untitled Event'}</h1>
            <p className="detail-description">
              {event.description || 'Join us for this premier live event featuring top performances, world-class sound, and memorable entertainment.'}
            </p>

            {/* Event Facts Strip */}
            <div className="detail-facts">
              <div className="fact-item">
                <CalendarDays size={18} />
                <span>
                  <b>{event.date || 'Date TBA'}</b>
                  <small>Doors open 1 hr prior</small>
                </span>
              </div>

              <div className="fact-item">
                <Clock size={18} />
                <span>
                  <b>{event.time || '7:00 PM'}</b>
                  <small>Duration: ~2.5 hrs</small>
                </span>
              </div>

              <div className="fact-item">
                <MapPin size={18} />
                <span>
                  <b>{event.venue || 'Venue TBA'}</b>
                  <small>{event.city || 'India'}</small>
                </span>
              </div>
            </div>

            {/* Ticket Tier Selection Panel */}
            <div className="ticket-panel">
              <div className="ticket-panel-head">
                <span>Select Ticket Category</span>
                <small>Prices in INR, taxes calculated at checkout</small>
              </div>

              <div className="tier-options-list">
                {tiers.map((t) => {
                  const isSold = (t.available || 0) === 0;
                  const isSelected = selectedTierName === t.name;
                  return (
                    <button
                      key={t.name}
                      type="button"
                      disabled={isSold}
                      className={`ticket-option ${isSelected ? 'selected' : ''} ${
                        isSold ? 'sold-out-tier' : ''
                      }`}
                      onClick={() => {
                        setSelectedTierName(t.name);
                        if (quantity > t.available && t.available > 0) {
                          setQuantity(t.available);
                        }
                      }}
                    >
                      <div className="tier-info">
                        <div className="tier-name-row">
                          <b>{t.name}</b>
                          {isSold && <span className="sold-tag">Sold Out</span>}
                          {t.available > 0 && t.available <= 4 && (
                            <span className="limited-tag">Only {t.available} left</span>
                          )}
                        </div>
                        <small>{t.desc || 'Standard admission tier'}</small>
                      </div>
                      <strong className="tier-price">₹{(t.price || 0).toLocaleString('en-IN')}</strong>
                    </button>
                  );
                })}
              </div>

              {/* Quantity & Total Calculation */}
              <div className="ticket-bottom">
                <div className="qty-picker">
                  <small>Quantity</small>
                  <div className="quantity">
                    <button
                      type="button"
                      onClick={() => handleQtyChange(-1)}
                      disabled={quantity <= 1 || isTierSoldOut}
                    >
                      −
                    </button>
                    <strong>{quantity}</strong>
                    <button
                      type="button"
                      onClick={() => handleQtyChange(1)}
                      disabled={quantity >= selectedTier.available || isTierSoldOut}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="total-calculation">
                  <small>Subtotal ({quantity} tickets)</small>
                  <strong>₹{totalAmount.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Booking Trigger Button */}
              <button
                className={`button button-primary full book-action-btn ${
                  isTierSoldOut || isEventSoldOut ? 'disabled' : ''
                }`}
                onClick={handleProceedToBooking}
                disabled={isTierSoldOut || isEventSoldOut}
              >
                {isTierSoldOut || isEventSoldOut ? (
                  'Sold Out'
                ) : (
                  <>
                    Proceed to Booking <ArrowRight size={17} />
                  </>
                )}
              </button>

              <p className="booking-secure-note">
                <ShieldCheck size={14} /> 100% Instant confirmation · Secure 256-bit encrypted checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
