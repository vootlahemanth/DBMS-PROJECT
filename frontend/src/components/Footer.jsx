import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Mail, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="site-footer">
      <div className="container">
        {/* Main 5-Column Navigation Section */}
        <div className="footer-grid">
          {/* Column 1: Brand & Identity */}
          <div className="footer-col brand-col">
            <Link className="brand footer-brand" to="/">
              <span className="brand-mark">
                <Ticket size={18} />
              </span>
              <span className="brand-text">
                UNIVERSAL<span className="brand-red">TICKETS</span>
              </span>
            </Link>
            <p className="brand-tagline">
              Discover events. Book securely. Experience more.
            </p>
            <p className="footer-description">
              India's premier ticket booking platform for blockbuster cinema, live concerts, sports spectacles, and performing arts across 10+ cities.
            </p>
            <div className="footer-contact-mini">
              <span className="contact-item">
                <Mail size={14} className="icon" /> support@universaltickets.local
              </span>
              <span className="contact-item">
                <MapPin size={14} className="icon" /> HITEC City, Hyderabad, India
              </span>
            </div>
          </div>

          {/* Column 2: Explore Events */}
          <div className="footer-col">
            <h4 className="footer-col-title">Explore Events</h4>
            <ul className="footer-links">
              <li><Link to="/movies">Movies & Cinema</Link></li>
              <li><Link to="/concerts">Live Music & Concerts</Link></li>
              <li><Link to="/sports">Sports & Tournaments</Link></li>
              <li><Link to="/theatre">Theatre & Stage Plays</Link></li>
              <li><Link to="/comedy">Stand-Up Comedy</Link></li>
              <li><Link to="/activities">Workshops & Activities</Link></li>
            </ul>
          </div>

          {/* Column 3: For Organizers */}
          <div className="footer-col">
            <h4 className="footer-col-title">For Organizers</h4>
            <ul className="footer-links">
              <li><Link to="/organizer">Organizer Dashboard</Link></li>
              <li><Link to="/organizer/events/add">List Your Event</Link></li>
              <li><Link to="/organizer/venues">Venue Management</Link></li>
              <li><Link to="/login">Organizer Login</Link></li>
              <li><Link to="/register">Register Organization</Link></li>
            </ul>
          </div>

          {/* Column 4: Help & Support */}
          <div className="footer-col">
            <h4 className="footer-col-title">Help & Support</h4>
            <ul className="footer-links">
              <li><Link to="/help">Help Center & FAQs</Link></li>
              <li><Link to="/my-bookings">View Booked Tickets</Link></li>
              <li><Link to="/refunds">Cancellation & Refunds</Link></li>
              <li><Link to="/contact">Contact Customer Support</Link></li>
              <li><Link to="/about">About Universal Tickets</Link></li>
            </ul>
          </div>

          {/* Column 5: Legal & Policies */}
          <div className="footer-col">
            <h4 className="footer-col-title">Legal & Policies</h4>
            <ul className="footer-links">
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/refunds">Refund & Cancellation Terms</Link></li>
              <li><Link to="/contact">Grievance Desk</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-left">
            <p className="copyright-text">
              © {currentYear} Universal Tickets. All rights reserved.
            </p>
          </div>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy</Link>
            <span className="dot">•</span>
            <Link to="/terms">Terms</Link>
            <span className="dot">•</span>
            <Link to="/refunds">Refunds</Link>
            <span className="dot">•</span>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
