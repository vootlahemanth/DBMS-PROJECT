import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, ShieldCheck, Users, Sparkles, MapPin, Award, CheckCircle2 } from 'lucide-react';

export default function AboutUs() {
  return (
    <main className="static-page container py-8">
      <div className="static-header">
        <div className="eyebrow ink">ABOUT UNIVERSAL TICKETS</div>
        <h1>India's Seamless Live Entertainment Platform</h1>
        <p className="lead text-muted">
          Universal Tickets connects entertainment seekers with premier movies, concerts, sporting spectacles, theatre performances, and lifestyle experiences across 10+ major metropolitan cities.
        </p>
      </div>

      <div className="static-grid-3 my-8">
        <div className="static-feature-card">
          <div className="feature-icon red">
            <Ticket size={24} />
          </div>
          <h3>Curated Live Experiences</h3>
          <p>
            From blockbuster theatrical premieres and stadium concerts to stand-up comedy specials and heritage workshops, explore curated events tailored for your city.
          </p>
        </div>

        <div className="static-feature-card">
          <div className="feature-icon blue">
            <ShieldCheck size={24} />
          </div>
          <h3>Transparent Booking</h3>
          <p>
            Zero hidden fees, instant digital e-ticket generation, dynamic seat tier selection, and transparent cancellation terms on every ticket.
          </p>
        </div>

        <div className="static-feature-card">
          <div className="feature-icon green">
            <Users size={24} />
          </div>
          <h3>Verified Organizers</h3>
          <p>
            Every event host and venue enterprise goes through rigorous compliance verification by our compliance officers before publishing ticket inventory.
          </p>
        </div>
      </div>

      <div className="static-section my-8">
        <h2>Our Nationwide Footprint</h2>
        <p className="text-muted mb-4">
          Headquartered in Hyderabad with live operations across Mumbai, Delhi NCR, Bengaluru, Chennai, Pune, Kolkata, Ahmedabad, Jaipur, and Kochi.
        </p>

        <div className="city-badges-list">
          {['Hyderabad', 'Mumbai', 'Delhi NCR', 'Bengaluru', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Kochi'].map((city) => (
            <span key={city} className="city-chip">
              <MapPin size={13} /> {city}
            </span>
          ))}
        </div>
      </div>

      <div className="static-cta-box my-8">
        <h2>Are you an Event Organizer?</h2>
        <p>List your concert, tournament, or workshop with Universal Tickets and reach thousands of passionate fans.</p>
        <div className="cta-actions">
          <Link to="/organizer" className="button button-primary">
            Organizer Workspace
          </Link>
          <Link to="/contact" className="button button-secondary">
            Partner With Us
          </Link>
        </div>
      </div>
    </main>
  );
}
