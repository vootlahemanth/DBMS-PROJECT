import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ArrowRight, Film, Music2, Trophy, Drama, Laugh, Popcorn } from 'lucide-react';

export default function SearchOverlay({ close, onClose }) {
  const handleClose = onClose || close || (() => {});
  const navigate = useNavigate();
  const [value, setValue] = useState('');

  const quickSearches = [
    { label: 'Arijit Singh', category: 'concerts' },
    { label: 'Interstellar IMAX', category: 'movies' },
    { label: 'India vs Australia', category: 'sports' },
    { label: 'Hamlet Theatre', category: 'theatre' },
    { label: 'Rahul Dua Comedy', category: 'comedy' },
  ];

  const handleSearch = (query) => {
    if (query?.trim()) {
      handleClose();
      navigate(`/events?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="search-overlay">
      <div className="search-overlay-header">
        <div className="search-overlay-inner">
          <button className="icon-button" onClick={handleClose} aria-label="Back">
            <ChevronLeft size={20} />
          </button>
          <div className="search-input-wrap">
            <Search size={20} className="search-icon-inside" />
            <input
              autoFocus
              placeholder="Search movies, concerts, sports, theatre & activities..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(value)}
            />
          </div>
          <button className="search-submit" onClick={() => handleSearch(value)}>
            Search <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="container search-suggestions">
        <span className="suggestions-title">POPULAR SEARCHES</span>
        <div className="chips-grid">
          {quickSearches.map((item) => (
            <button
              key={item.label}
              className="suggestion-chip"
              onClick={() => handleSearch(item.label)}
            >
              <Search size={13} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <span className="suggestions-title" style={{ marginTop: '24px' }}>BROWSE CATEGORIES</span>
        <div className="category-pills">
          <button onClick={() => { handleClose(); navigate('/events?category=movies'); }}><Film size={15} /> Movies</button>
          <button onClick={() => { handleClose(); navigate('/events?category=concerts'); }}><Music2 size={15} /> Concerts</button>
          <button onClick={() => { handleClose(); navigate('/events?category=sports'); }}><Trophy size={15} /> Sports</button>
          <button onClick={() => { handleClose(); navigate('/events?category=theatre'); }}><Drama size={15} /> Theatre</button>
          <button onClick={() => { handleClose(); navigate('/events?category=comedy'); }}><Laugh size={15} /> Comedy</button>
          <button onClick={() => { handleClose(); navigate('/events?category=activities'); }}><Popcorn size={15} /> Activities</button>
        </div>
      </div>
    </div>
  );
}
