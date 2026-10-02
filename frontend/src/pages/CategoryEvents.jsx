import React, { useState, useMemo } from 'react';
import { useSearchParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { Compass, Search, Filter, CalendarDays, MapPin, X, ArrowUpDown, RefreshCw } from 'lucide-react';
import { useData } from '../context/DataContext';
import EventCard from '../components/EventCard';

export default function CategoryEvents() {
  const { events, selectedCity, setSelectedCity, cities } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Resolve category from URL query OR route pathname (e.g. /movies -> 'movies')
  const pathCategory = location.pathname.replace(/^\//, '').toLowerCase();
  const queryParam = searchParams.get('query') || '';
  const queryCategory = searchParams.get('category') || '';
  
  const activeCategory = ['movies', 'concerts', 'sports', 'theatre', 'comedy', 'activities', 'other'].includes(pathCategory)
    ? pathCategory
    : queryCategory.toLowerCase();

  const [selectedSort, setSelectedSort] = useState('popular');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState('all');

  const categoriesList = [
    { label: 'All', value: '', path: '/events' },
    { label: 'Movies', value: 'movies', path: '/movies' },
    { label: 'Concerts', value: 'concerts', path: '/concerts' },
    { label: 'Sports', value: 'sports', path: '/sports' },
    { label: 'Theatre', value: 'theatre', path: '/theatre' },
    { label: 'Comedy', value: 'comedy', path: '/comedy' },
    { label: 'Activities', value: 'activities', path: '/activities' }
  ];

  // Robust Filtering logic
  const filteredEvents = useMemo(() => {
    return (events || []).filter((e) => {
      if (!e) return false;

      // Category match
      if (activeCategory && activeCategory !== 'all' && activeCategory !== 'events') {
        const itemCat = (e.category || e.type || '').toLowerCase();
        if (activeCategory === 'activities') {
          if (!['activities', 'activity', 'other'].includes(itemCat)) return false;
        } else if (itemCat !== activeCategory) {
          return false;
        }
      }

      // Query search match
      if (queryParam) {
        const q = queryParam.toLowerCase();
        const searchable = `${e.title || ''} ${e.venue || ''} ${e.city || ''} ${e.type || ''} ${e.language || ''}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }

      // Price filter
      const price = Number(e.price) || 0;
      if (selectedPriceFilter === 'under500' && price > 500) return false;
      if (selectedPriceFilter === '500to1500' && (price < 500 || price > 1500)) return false;
      if (selectedPriceFilter === 'above1500' && price <= 1500) return false;

      return true;
    }).sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;
      if (selectedSort === 'price-low') return priceA - priceB;
      if (selectedSort === 'price-high') return priceB - priceA;
      return 0;
    });
  }, [events, activeCategory, queryParam, selectedPriceFilter, selectedSort]);

  const handleCategoryClick = (catItem) => {
    if (catItem.path) {
      navigate(catItem.path);
    } else {
      navigate('/events');
    }
  };

  const handleClearFilters = () => {
    setSelectedPriceFilter('all');
    navigate('/events');
  };

  const currentCategoryTitle = activeCategory && activeCategory !== 'events' && activeCategory !== 'all'
    ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)
    : queryParam
    ? `Search results for "${queryParam}"`
    : 'All Live Experiences';

  return (
    <main className="listing-page">
      <div className="container">
        {/* Listing Header */}
        <div className="listing-head">
          <div>
            <div className="eyebrow ink">DISCOVER EXPERIENCES</div>
            <h1>{currentCategoryTitle}</h1>
            <p>
              Showing {filteredEvents.length} experience{filteredEvents.length === 1 ? '' : 's'} available in <strong>{selectedCity}</strong>
            </p>
          </div>

          <div className="listing-controls">
            {/* Sort Filter */}
            <div className="sort-wrap">
              <ArrowUpDown size={14} />
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="sort-select"
                aria-label="Sort events"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Pills Strip */}
        <div className="filter-pill-bar">
          <div className="category-scroll-pills">
            {categoriesList.map((cat) => {
              const isSelected = (activeCategory === cat.value) || (!activeCategory && cat.value === '');
              return (
                <button
                  key={`cat-pill-${cat.value || cat.label}`}
                  className={`filter-pill ${isSelected ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="price-filters">
            <button
              className={`price-pill ${selectedPriceFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedPriceFilter('all')}
            >
              All Prices
            </button>
            <button
              className={`price-pill ${selectedPriceFilter === 'under500' ? 'active' : ''}`}
              onClick={() => setSelectedPriceFilter('under500')}
            >
              Under ₹500
            </button>
            <button
              className={`price-pill ${selectedPriceFilter === '500to1500' ? 'active' : ''}`}
              onClick={() => setSelectedPriceFilter('500to1500')}
            >
              ₹500 - ₹1,500
            </button>
            <button
              className={`price-pill ${selectedPriceFilter === 'above1500' ? 'active' : ''}`}
              onClick={() => setSelectedPriceFilter('above1500')}
            >
              ₹1,500+
            </button>
          </div>
        </div>

        {/* Active Filter Tags */}
        {(activeCategory || queryParam || selectedPriceFilter !== 'all') && (
          <div className="active-tags-row">
            <span>Active filters:</span>
            {activeCategory && activeCategory !== 'events' && (
              <span className="active-tag">
                Category: {activeCategory}{' '}
                <X size={12} onClick={() => navigate('/events')} />
              </span>
            )}
            {queryParam && (
              <span className="active-tag">
                Search: {queryParam}{' '}
                <X size={12} onClick={() => navigate('/events')} />
              </span>
            )}
            {selectedPriceFilter !== 'all' && (
              <span className="active-tag">
                Price: {selectedPriceFilter}{' '}
                <X size={12} onClick={() => setSelectedPriceFilter('all')} />
              </span>
            )}
            <button className="clear-all-btn" onClick={handleClearFilters}>
              Reset all filters
            </button>
          </div>
        )}

        {/* Event Grid / Empty State */}
        {filteredEvents.length > 0 ? (
          <div className="event-grid listing-grid">
            {filteredEvents.map((event, idx) => (
              <EventCard key={`event-card-${event.id || idx}`} event={event} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Compass size={44} className="empty-state-icon" />
            <h3>No experiences found matching your selection</h3>
            <p>
              We couldn't find any events under "{currentCategoryTitle}" with your active filters. Try resetting your filters to explore all available shows.
            </p>
            <button className="button button-primary" onClick={handleClearFilters}>
              <RefreshCw size={15} /> Explore All Experiences
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
