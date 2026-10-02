import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, PlusCircle, MapPin, Ticket, ArrowRight, Eye } from 'lucide-react';
import { useData } from '../../context/DataContext';
import StatusBadge from '../../components/StatusBadge';

export default function OrganizerEvents() {
  const { events } = useData();

  return (
    <main className="dashboard-page">
      <div className="container">
        <div className="dashboard-head">
          <div>
            <div className="eyebrow ink">CATALOG MANAGEMENT</div>
            <h1>Published Events</h1>
            <p>Control event schedules, ticket allocations, and real-time sales progress.</p>
          </div>
          <Link className="button button-primary" to="/organizer/events/add">
            <PlusCircle size={16} /> Publish New Event
          </Link>
        </div>

        <div className="org-events-grid">
          {events.map((e) => (
            <div className="org-event-card" key={e.id}>
              <img src={e.image} alt={e.title} className="org-event-poster" />
              <div className="org-event-body">
                <div className="org-event-top">
                  <span className="event-cat-tag">{e.type}</span>
                  <StatusBadge status={e.availabilityStatus} />
                </div>

                <h3>{e.title}</h3>
                <p className="org-event-loc">
                  <MapPin size={13} /> {e.venue}, {e.city}
                </p>
                <p className="org-event-time">
                  <Calendar size={13} /> {e.date} · {e.time}
                </p>

                <div className="org-event-footer">
                  <div className="price-tag-sm">
                    <small>Starting from</small>
                    <strong>₹{e.price?.toLocaleString('en-IN')}</strong>
                  </div>
                  <Link className="button button-secondary btn-sm" to={`/events/${e.id}`}>
                    <Eye size={14} /> View Public Page
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
