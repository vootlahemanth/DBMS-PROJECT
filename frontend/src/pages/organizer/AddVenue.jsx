import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, ChevronLeft, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export default function AddVenue() {
  const navigate = useNavigate();
  const { addVenue, cities } = useData();
  const { currentUser } = useAuth();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [capacity, setCapacity] = useState(1000);
  const [contact, setContact] = useState('+91 40 2345 6789');
  const [type, setType] = useState('AUDITORIUM');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await addVenue({
        venueName: name,
        venueType: type,
        address,
        city,
        state: 'Telangana',
        pincode: '500081',
        capacity: parseInt(capacity, 10),
        organizerId: currentUser?.userId || 'ORG-2026-000001',
        status: 'ACTIVE'
      });
      navigate('/organizer/venues');
    } catch (err) {}
  };

  return (
    <main className="dashboard-page">
      <div className="container narrow">
        <Link className="back-link" to="/organizer/venues">
          <ChevronLeft size={16} /> Back to venues
        </Link>

        <div className="dashboard-head">
          <div>
            <div className="eyebrow ink">VENUE SETUP</div>
            <h1>Register New Venue</h1>
            <p>Add a new performance hall, stadium, or cinema complex to your organizer catalog.</p>
          </div>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Venue / Arena Name</label>
              <input
                placeholder="e.g. Hyderabad Open Air Amphitheatre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Venue Category</label>
                <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="AUDITORIUM">Auditorium / Stadium</option>
                  <option value="CINEMA">Multiplex Cinema</option>
                  <option value="EVENT_HALL">Event Hall</option>
                  <option value="STADIUM">Stadium / Arena</option>
                  <option value="CLUB">Comedy / Music Club</option>
                </select>
              </div>

              <div className="form-group">
                <label>City</label>
                <select className="form-select" value={city} onChange={(e) => setCity(e.target.value)}>
                  {(cities || ['Hyderabad', 'Bengaluru', 'Mumbai', 'Chennai', 'Delhi-NCR', 'Pune']).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Full Physical Address</label>
              <input
                placeholder="Plot / Road, Area, Landmark"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Total Seating Capacity</label>
                <input
                  type="number"
                  min="50"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contact Phone</label>
                <input value={contact} onChange={(e) => setContact(e.target.value)} required />
              </div>
            </div>

            <div className="form-actions-row">
              <button type="submit" className="button button-primary">
                Save Venue <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => navigate('/organizer/venues')}
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
