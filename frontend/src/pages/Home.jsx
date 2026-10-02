import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Film,
  Music2,
  Trophy,
  Drama,
  Laugh,
  Popcorn,
  ChevronRight,
  Zap,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { categories } from '../data/events';
import EventCard from '../components/EventCard';

export default function Home() {
  const { events, selectedCity, loading, error, retryFetch } = useData();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  const languages = ['All', 'Hindi', 'Telugu', 'English', 'Tamil', 'Malayalam'];

  // Filter events for city and language
  const cityEvents = (events || []).filter(
    (e) => (e.city || '').toLowerCase() === (selectedCity || '').toLowerCase() || selectedCity === 'Hyderabad'
  );

  const recommendedEvents = cityEvents.filter((e) => {
    if (selectedLanguage === 'All') return true;
    return (e.language || '').toLowerCase().includes(selectedLanguage.toLowerCase());
  });

  const concertEvents = (events || []).filter(
    (e) => (e.category || '').toLowerCase() === 'concerts' || (e.type || '').toLowerCase() === 'concerts'
  );

  if (loading && (!events || events.length === 0)) {
    return (
      <main className="homepage">
        <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
          <Loader2 size={40} className="spin" style={{ margin: '0 auto 1.5rem', color: '#c5a059' }} />
          <h2>Loading Universal Tickets Experiences...</h2>
          <p style={{ color: 'var(--text-muted)' }}>Connecting to backend catalog...</p>
        </div>
      </main>
    );
  }

  if (error && (!events || events.length === 0)) {
    return (
      <main className="homepage">
        <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
          <h2>Unable to Load Events</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
          <button className="button button-primary" onClick={retryFetch}>
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="homepage">
      {/* 1. Hero Promo Banner */}
      <section className="promo-band">
        <div className="container">
          <div className="promo-hero">
            <img
              src="/assets/universal-hero.png"
              alt="Live entertainment"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=85';
              }}
            />
            <div className="promo-copy">
              <span className="promo-tag">
                <Sparkles size={13} /> LIVE IN {(selectedCity || 'INDIA').toUpperCase()}
              </span>
              <h1>
                DISCOVER YOUR NEXT
                <br />
                UNFORGETTABLE EXPERIENCE
              </h1>
              <p>Movies, concerts, sports, theatre, comedy and experiences — all in one place.</p>
              <div className="promo-actions">
                <button className="button button-primary" onClick={() => navigate('/events')}>
                  Explore Lineup <ArrowRight size={16} />
                </button>
                <button
                  className="button button-ghost"
                  onClick={() => navigate('/concerts')}
                >
                  Live Concerts
                </button>
              </div>
            </div>
            <div className="promo-dots">
              <i className="active" key="dot-1" />
              <i key="dot-2" />
              <i key="dot-3" />
              <i key="dot-4" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Category Exploration Bar */}
      <section className="explore-strip">
        <div className="container">
          <Link to="/movies" className="explore-cat-card">
            <div className="cat-icon-wrap gold">
              <Film size={24} />
            </div>
            <span>Movies</span>
            <small>Now Showing</small>
          </Link>

          <Link to="/concerts" className="explore-cat-card">
            <div className="cat-icon-wrap teal">
              <Music2 size={24} />
            </div>
            <span>Concerts</span>
            <small>Live Music</small>
          </Link>

          <Link to="/sports" className="explore-cat-card">
            <div className="cat-icon-wrap red">
              <Trophy size={24} />
            </div>
            <span>Sports</span>
            <small>Stadium Action</small>
          </Link>

          <Link to="/theatre" className="explore-cat-card">
            <div className="cat-icon-wrap plum">
              <Drama size={24} />
            </div>
            <span>Plays & Theatre</span>
            <small>Stage Stories</small>
          </Link>

          <Link to="/comedy" className="explore-cat-card">
            <div className="cat-icon-wrap blue">
              <Laugh size={24} />
            </div>
            <span>Comedy</span>
            <small>Laugh Clubs</small>
          </Link>

          <Link to="/activities" className="explore-cat-card">
            <div className="cat-icon-wrap green">
              <Popcorn size={24} />
            </div>
            <span>Activities</span>
            <small>Weekend Fun</small>
          </Link>
        </div>
      </section>

      {/* 3. Recommended Experiences & Language Tabs */}
      <section className="section rec-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow ink">TRENDING NOW</div>
              <h2>Recommended in {selectedCity}</h2>
            </div>
            <Link className="text-link" to="/events">
              See all ({cityEvents.length}) <ArrowRight size={15} />
            </Link>
          </div>

          <div className="interest-row">
            {languages.map((lang) => (
              <button
                key={`lang-${lang}`}
                className={selectedLanguage === lang ? 'active' : ''}
                onClick={() => setSelectedLanguage(lang)}
              >
                {lang}
              </button>
            ))}
          </div>

          <div className="event-grid featured-grid">
            {(recommendedEvents.length > 0 ? recommendedEvents : events).slice(0, 5).map((event, idx) => (
              <EventCard key={`rec-${event.id || idx}`} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Live Concerts & Music Festivals */}
      <section className="section section-muted">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow ink">STAGE & SOUND</div>
              <h2>The Best of Live Music & Concerts</h2>
            </div>
            <Link className="text-link" to="/concerts">
              View all concerts <ArrowRight size={15} />
            </Link>
          </div>

          <div className="event-grid featured-grid">
            {(concertEvents.length > 0 ? concertEvents : events.filter(e => (e.category || '').includes('concert') || (e.type || '').includes('CONCERT'))).slice(0, 5).map((event, idx) => (
              <EventCard key={`concert-${event.id || idx}`} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Universal Premiere Spotlight */}
      <section className="container offer-banner-wrap">
        <div className="offer-banner">
          <div className="offer-copy">
            <span className="offer-tag">
              <Zap size={13} /> UNIVERSAL PREMIERE
            </span>
            <h2>
              Experiences made
              <br />
              for your weekend.
            </h2>
            <p>
              Get early-bird access, VIP lounge packages, and member-exclusive seat selections with guaranteed verification.
            </p>
            <button className="button button-primary" onClick={() => navigate('/events')}>
              Explore Premieres <ArrowRight size={16} />
            </button>
          </div>
          <div className="offer-media">
            <img
              src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=85"
              alt="Festival stage"
            />
          </div>
        </div>
      </section>

      {/* 6. Browse by Category Cards */}
      <section className="section browse-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow ink">DISCOVERY HUB</div>
              <h2>Browse Experiences by Category</h2>
            </div>
          </div>

          <div className="category-grid">
            {categories.map((c) => (
              <Link
                className={`category-card ${c.tone || 'gold'}`}
                to={c.path || `/events?category=${c.value}`}
                key={`cat-card-${c.value || c.label}`}
              >
                <div className="category-icon-bubble">{c.label.charAt(0)}</div>
                <div className="category-card-text">
                  <h3>{c.label}</h3>
                  <p>{c.count || 'Explore shows'}</p>
                </div>
                <ChevronRight size={18} className="cat-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
