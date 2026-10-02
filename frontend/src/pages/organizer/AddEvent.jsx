import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, ChevronLeft, ArrowRight, AlertCircle, ShieldAlert } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export default function AddEvent() {
  const navigate = useNavigate();
  const { addEvent, venues, organizers, selectedCity } = useData();
  const { currentUser } = useAuth();

  const orgProfile = (organizers || []).find(
    (o) => (o.organizerId === currentUser?.userId) || (o.email === currentUser?.email) || (o.userId === currentUser?.userId)
  );

  const isApproved = !orgProfile || orgProfile?.verificationStatus === 'APPROVED';

  const [title, setTitle] = useState('');
  const [type, setType] = useState('CONCERT');
  const [venueId, setVenueId] = useState(venues[0]?.venueId || venues[0]?.id || 'VEN-2026-000001');
  const [date, setDate] = useState('2026-10-15');
  const [time, setTime] = useState('19:00:00');
  const [price, setPrice] = useState('999');
  const [language, setLanguage] = useState('English');
  const [description, setDescription] = useState(
    'Join us for a sensational live performance featuring top artists, state-of-the-art stage lighting, and incredible sound.'
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addEvent({
        eventName: title,
        eventType: type,
        venueId: venueId,
        organizerId: currentUser?.userId || 'ORG-2026-000001',
        eventDate: date,
        startTime: time.length === 5 ? time + ':00' : time,
        endTime: '22:00:00',
        language: language,
        description: description,
        status: 'PUBLISHED'
      });

      navigate('/organizer/events');
    } catch (err) {}
  };

  return (
    <main className="dashboard-page">
      <div className="container narrow">
        <Link className="back-link" to="/organizer/events">
          <ChevronLeft size={16} /> Back to events
        </Link>

        <div className="dashboard-head">
          <div>
            <div className="eyebrow ink">EVENT CREATOR</div>
            <h1>Create & Publish Event</h1>
            <p>Configure event information, ticket allocation, and public listing details.</p>
          </div>
        </div>

        {!isApproved && (
          <div className="auth-notice-banner error" style={{ marginBottom: '24px' }}>
            <ShieldAlert size={20} />
            <div>
              <strong>Event publishing is pending verification</strong>
              <p>
                Your organizer verification status is <strong>{orgProfile?.verificationStatus || 'PENDING'}</strong>.
                Only verified partners can publish public ticketing events.
              </p>
            </div>
          </div>
        )}

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Event Title</label>
              <input
                placeholder="e.g. AR Rahman Live in Concert"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={!isApproved}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Category</label>
                <select
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  disabled={!isApproved}
                >
                  <option value="CONCERT">Concerts</option>
                  <option value="MOVIE">Movies</option>
                  <option value="SPORTS">Sports</option>
                  <option value="THEATRE">Theatre</option>
                  <option value="COMEDY">Comedy</option>
                  <option value="OTHER">Activities / Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Assigned Venue</label>
                <select
                  className="form-select"
                  value={venueId}
                  onChange={(e) => setVenueId(e.target.value)}
                  disabled={!isApproved}
                >
                  {(venues || []).map((v) => {
                    const vId = v.venueId || v.id;
                    const vName = v.venueName || v.name || vId;
                    return (
                      <option key={vId} value={vId}>
                        {vName} ({v.city || 'Hyderabad'})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Event Date (YYYY-MM-DD)</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  disabled={!isApproved}
                />
              </div>

              <div className="form-group">
                <label>Event Start Time (HH:MM)</label>
                <input
                  type="time"
                  value={time.substring(0, 5)}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  disabled={!isApproved}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Language</label>
                <input
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                  disabled={!isApproved}
                />
              </div>

              <div className="form-group">
                <label>Base Ticket Price (₹)</label>
                <input
                  type="number"
                  min="99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  disabled={!isApproved}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Event Description</label>
              <textarea
                className="form-textarea"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={!isApproved}
              />
            </div>

            <div className="form-actions-row">
              <button type="submit" className="button button-primary" disabled={!isApproved}>
                Publish Event <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => navigate('/organizer/events')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
