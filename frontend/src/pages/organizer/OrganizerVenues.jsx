import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, PlusCircle, MapPin, Users, Phone, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function OrganizerVenues() {
  const { venues } = useData();

  return (
    <main className="dashboard-page">
      <div className="container">
        <div className="dashboard-head">
          <div>
            <div className="eyebrow ink">VENUE MANAGEMENT</div>
            <h1>Venues & Arenas</h1>
            <p>Manage physical properties, stadiums, concert halls, and auditorium seating.</p>
          </div>
          <Link className="button button-primary" to="/organizer/venues/add">
            <PlusCircle size={16} /> Register New Venue
          </Link>
        </div>

        <div className="venues-grid">
          {(venues || []).map((v) => {
            const vId = v.venueId || v.id;
            const vName = v.venueName || v.name || 'Universal Venue';
            const vType = v.venueType || v.type || 'Auditorium';
            return (
              <div className="venue-card" key={vId}>
                <div className="venue-card-top">
                  <span className="venue-type-tag">{vType}</span>
                  <span className="venue-id-tag">{vId}</span>
                </div>

                <h3>{vName}</h3>
                <p className="venue-address">
                  <MapPin size={14} /> {v.address || 'Central Road'}, {v.city || 'Hyderabad'}
                </p>

                <div className="venue-meta-row">
                  <span>
                    <Users size={14} /> Capacity: <b>{(v.capacity || 500).toLocaleString('en-IN')} seats</b>
                  </span>
                  <span>
                    <Phone size={14} /> +91 92000 00000
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
