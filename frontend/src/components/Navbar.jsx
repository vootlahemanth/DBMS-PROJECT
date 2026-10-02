import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Ticket,
  Search,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Building,
  PlusCircle,
  Menu,
  X,
  MapPin,
  SunMedium,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import SearchOverlay from './SearchOverlay';

export default function Navbar() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { selectedCity = 'Hyderabad', setSelectedCity = () => {}, cities = ['Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi-NCR', 'Chennai', 'Pune'] } = useData() || {};
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    const savedTheme = localStorage.getItem('ut-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  const profileRef = useRef(null);
  const cityRef = useRef(null);

  const userName = currentUser?.name || currentUser?.email?.split('@')[0] || 'User';
  const userRole = (currentUser?.role || 'CUSTOMER').toUpperCase();
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U';
  const userFirstName = userName ? userName.split(' ')[0] : 'User';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ut-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setCityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMenuOpen(false);
    setProfileDropdownOpen(false);
    setCityDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const navCategories = [
    { label: 'Movies', path: '/movies' },
    { label: 'Concerts', path: '/concerts' },
    { label: 'Sports', path: '/sports' },
    { label: 'Theatre', path: '/theatre' },
    { label: 'Comedy', path: '/comedy' },
    { label: 'Activities', path: '/activities' }
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/">
          <span className="brand-mark">
            <Ticket size={18} strokeWidth={2.6} />
          </span>
          <span className="brand-text">
            UNIVERSAL<span className="brand-red">TICKETS</span>
          </span>
        </Link>

        <button
          className="desktop-search"
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
        >
          <Search size={16} />
          <span>Search for Movies, Concerts, Sports, Plays and Activities</span>
        </button>

        <div className="header-actions">
          {/* City Selection Dropdown */}
          <div className="city-selector-wrap" ref={cityRef}>
            <button
              className="location-button"
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
            >
              <MapPin size={14} className="city-pin" />
              <span>{selectedCity}</span>
              <ChevronDown size={13} />
            </button>

            {cityDropdownOpen && (
              <div className="city-dropdown-menu">
                <span className="city-dropdown-title">SELECT YOUR CITY</span>
                {cities.map((city) => (
                  <button
                    key={city}
                    className={`city-option ${selectedCity === city ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCity(city);
                      setCityDropdownOpen(false);
                    }}
                  >
                    <span>{city}</span>
                    {selectedCity === city && <span className="city-check">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? <SunMedium size={16} /> : <Moon size={16} />}
          </button>

          <button
            className="mobile-search-btn"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={18} />
          </button>

          {isAuthenticated && currentUser ? (
            <div className="profile-menu-wrap" ref={profileRef}>
              <button
                className="profile-button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="avatar-circle">
                  {userInitial}
                </div>
                <div className="profile-info-text">
                  <span className="profile-name">{userFirstName}</span>
                  <span className="profile-role-tag">{userRole}</span>
                </div>
                <ChevronDown size={13} />
              </button>

              {profileDropdownOpen && (
                <div className="profile-dropdown-menu">
                  <div className="dropdown-user-header">
                    <strong>{userName}</strong>
                    <small>{currentUser.email || ''}</small>
                    <span className={`role-badge badge-${userRole.toLowerCase()}`}>
                      {userRole}
                    </span>
                  </div>

                  <div className="dropdown-divider" />

                  {userRole === 'CUSTOMER' && (
                    <>
                      <Link
                        to="/my-bookings"
                        className="dropdown-item"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <Ticket size={15} /> My Bookings
                      </Link>
                      <Link
                        to="/profile"
                        className="dropdown-item"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <User size={15} /> Customer Profile
                      </Link>
                    </>
                  )}

                  {userRole === 'ORGANIZER' && (
                    <>
                      <Link
                        to="/organizer"
                        className="dropdown-item"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <LayoutDashboard size={15} /> Organizer Dashboard
                      </Link>
                      <Link
                        to="/organizer/events"
                        className="dropdown-item"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <Calendar size={15} /> Manage Events
                      </Link>
                      <Link
                        to="/organizer/events/add"
                        className="dropdown-item"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <PlusCircle size={15} /> Add New Event
                      </Link>
                      <Link
                        to="/organizer/venues"
                        className="dropdown-item"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <Building size={15} /> Manage Venues
                      </Link>
                      <Link
                        to="/organizer/profile"
                        className="dropdown-item"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <User size={15} /> Company Profile
                      </Link>
                    </>
                  )}

                  {userRole === 'VERIFIER' && (
                    <>
                      <Link
                        to="/verifier"
                        className="dropdown-item"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <ShieldCheck size={15} /> Verifier Queue
                      </Link>
                      <Link
                        to="/verifier/organizers"
                        className="dropdown-item"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <Building size={15} /> Inspect Organizers
                      </Link>
                    </>
                  )}

                  {userRole === 'ADMIN' && (
                    <>
                      <Link
                        to="/admin"
                        className="dropdown-item"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <ShieldAlert size={15} /> Admin Dashboard
                      </Link>
                      <Link
                        to="/admin?tab=users"
                        className="dropdown-item"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <User size={15} /> Users Management
                      </Link>
                      <Link
                        to="/admin?tab=organizers"
                        className="dropdown-item"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <Building size={15} /> Organizer Directory
                      </Link>
                      <Link
                        to="/admin?tab=events"
                        className="dropdown-item"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <Calendar size={15} /> Event Inventory
                      </Link>
                    </>
                  )}

                  <div className="dropdown-divider" />

                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="button button-ghost-auth">
                Sign In
              </Link>
              <Link to="/register" className="button button-primary-auth">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Drawer Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation drawer"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Primary Category Navigation Bar */}
      <nav className="category-bar">
        <div className="container">
          <ul className="category-links">
            {navCategories.map((item) => {
              const isActive = location.pathname === item.path || 
                (location.pathname === '/events' && location.search.includes(`category=${item.label.toLowerCase()}`));
              return (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className={`cat-link ${isActive ? 'active' : ''}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-content">
            <div className="mobile-city-selector">
              <span>Current City:</span>
              <strong>{selectedCity}</strong>
            </div>

            <div className="mobile-cat-grid">
              {navCategories.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="mobile-cat-item"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mobile-auth-section">
              {isAuthenticated && currentUser ? (
                <div className="mobile-user-actions">
                  <div className="mobile-user-tag">
                    Signed in as <strong>{userName}</strong> ({userRole})
                  </div>
                  {userRole === 'CUSTOMER' && (
                    <>
                      <Link to="/my-bookings" className="mobile-link" onClick={() => setMenuOpen(false)}>
                        My Bookings
                      </Link>
                      <Link to="/profile" className="mobile-link" onClick={() => setMenuOpen(false)}>
                        Customer Profile
                      </Link>
                    </>
                  )}
                  {userRole === 'ORGANIZER' && (
                    <Link to="/organizer" className="mobile-link" onClick={() => setMenuOpen(false)}>
                      Organizer Workspace
                    </Link>
                  )}
                  {userRole === 'VERIFIER' && (
                    <Link to="/verifier" className="mobile-link" onClick={() => setMenuOpen(false)}>
                      Verifier Queue
                    </Link>
                  )}
                  {userRole === 'ADMIN' && (
                    <Link to="/admin" className="mobile-link" onClick={() => setMenuOpen(false)}>
                      Admin Dashboard & Intelligence
                    </Link>
                  )}
                  <button className="mobile-logout-btn" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="mobile-guest-actions">
                  <Link to="/login" className="button button-primary full" onClick={() => setMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link to="/register" className="button button-secondary full" onClick={() => setMenuOpen(false)}>
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instant Search Overlay */}
      {searchOpen && (
        <SearchOverlay
          onClose={() => setSearchOpen(false)}
          close={() => setSearchOpen(false)}
        />
      )}
    </header>
  );
}
