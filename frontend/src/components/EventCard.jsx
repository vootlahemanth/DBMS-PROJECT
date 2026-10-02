import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=85';

export default function EventCard({ event }) {
  if (!event) return null;

  const isLimited = event.availableTickets > 0 && event.availableTickets <= 4;
  const isSoldOut = event.availableTickets === 0;
  const imageUrl = event.image || FALLBACK_IMAGE;

  return (
    <Link className="event-card" to={`/events/${event.id}`}>
      <div className={`event-image ${event.accent || event.category || 'concert'}`}>
        <img
          src={imageUrl}
          alt={event.title || 'Event'}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_IMAGE;
          }}
        />
        <span className="event-type">{event.type || 'Event'}</span>
        
        {isSoldOut ? (
          <span className="card-badge sold-out">SOLD OUT</span>
        ) : isLimited ? (
          <span className="card-badge limited">ONLY {event.availableTickets} LEFT</span>
        ) : null}

        <div className="card-overlay-bottom">
          <span className="verified-pill">
            <CheckCircle2 size={11} /> Verified
          </span>
        </div>
      </div>

      <div className="event-card-body">
        <div className="event-card-title">
          <h3>{event.title || 'Untitled Event'}</h3>
          <ArrowRight size={16} className="card-arrow" />
        </div>
        <p className="event-venue">
          <MapPin size={12} /> {event.venue || 'Venue TBA'} · {event.city || 'India'}
        </p>
        <div className="event-card-meta">
          <span>
            <CalendarDays size={13} /> {event.date || 'Upcoming'}
          </span>
          <div className="price-tag">
            <small>From</small>
            <strong>₹{(event.price || 0).toLocaleString('en-IN')}</strong>
          </div>
        </div>
      </div>
    </Link>
  );
}
