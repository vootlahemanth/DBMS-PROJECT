import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Global Contexts
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Core Layout & Utility Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';

// Customer Facing Pages
import Home from './pages/Home';
import CategoryEvents from './pages/CategoryEvents';
import EventDetails from './pages/EventDetails';
import BookingPage from './pages/BookingPage';
import BookingConfirmation from './pages/BookingConfirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import CustomerProfile from './pages/CustomerProfile';

// Static Informational Pages
import AboutUs from './pages/static/AboutUs';
import HelpCenter from './pages/static/HelpCenter';
import ContactUs from './pages/static/ContactUs';
import TermsOfService from './pages/static/TermsOfService';
import PrivacyPolicy from './pages/static/PrivacyPolicy';
import RefundPolicy from './pages/static/RefundPolicy';

// Admin Portal Pages
import AdminDashboard from './pages/AdminDashboard';

// Organizer Portal Pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import OrganizerVenues from './pages/organizer/OrganizerVenues';
import AddVenue from './pages/organizer/AddVenue';
import OrganizerEvents from './pages/organizer/OrganizerEvents';
import AddEvent from './pages/organizer/AddEvent';
import OrganizerBookings from './pages/organizer/OrganizerBookings';
import OrganizerProfile from './pages/organizer/OrganizerProfile';

// Verifier Portal Pages
import VerifierDashboard from './pages/verifier/VerifierDashboard';
import VerifierOrganizers from './pages/verifier/VerifierOrganizers';

// Design System CSS
import './styles/app.css';

function App() {
  return (
    <ErrorBoundary>
      <div className="app-shell">
        <Toast />
        <Navbar />
        <div className="app-content-wrapper">
          <Routes>
            {/* Public Category & Browsing Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<CategoryEvents />} />
            <Route path="/movies" element={<CategoryEvents />} />
            <Route path="/concerts" element={<CategoryEvents />} />
            <Route path="/sports" element={<CategoryEvents />} />
            <Route path="/theatre" element={<CategoryEvents />} />
            <Route path="/comedy" element={<CategoryEvents />} />
            <Route path="/activities" element={<CategoryEvents />} />
            <Route path="/other" element={<CategoryEvents />} />
            <Route path="/events/:id" element={<EventDetails />} />

            {/* Static Information & Policy Routes */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/refunds" element={<RefundPolicy />} />

            {/* Unified Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer Protected Booking & Account Routes */}
            <Route
              path="/booking/:id"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ORGANIZER', 'VERIFIER', 'ADMIN']}>
                  <BookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ORGANIZER', 'VERIFIER', 'ADMIN']}>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-cancellations"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ORGANIZER', 'VERIFIER', 'ADMIN']}>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ORGANIZER', 'VERIFIER', 'ADMIN']}>
                  <CustomerProfile />
                </ProtectedRoute>
              }
            />

            {/* Admin Management Workspace */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Organizer Workspace Routes */}
            <Route
              path="/organizer"
              element={
                <ProtectedRoute allowedRoles={['ORGANIZER']}>
                  <OrganizerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/venues"
              element={
                <ProtectedRoute allowedRoles={['ORGANIZER']}>
                  <OrganizerVenues />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/venues/add"
              element={
                <ProtectedRoute allowedRoles={['ORGANIZER']}>
                  <AddVenue />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events"
              element={
                <ProtectedRoute allowedRoles={['ORGANIZER']}>
                  <OrganizerEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events/add"
              element={
                <ProtectedRoute allowedRoles={['ORGANIZER']}>
                  <AddEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/bookings"
              element={
                <ProtectedRoute allowedRoles={['ORGANIZER']}>
                  <OrganizerBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/profile"
              element={
                <ProtectedRoute allowedRoles={['ORGANIZER']}>
                  <OrganizerProfile />
                </ProtectedRoute>
              }
            />

            {/* Verifier Workspace Routes */}
            <Route
              path="/verifier"
              element={
                <ProtectedRoute allowedRoles={['VERIFIER']}>
                  <VerifierDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verifier/organizers"
              element={
                <ProtectedRoute allowedRoles={['VERIFIER']}>
                  <VerifierOrganizers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verifier/organizers/:id"
              element={
                <ProtectedRoute allowedRoles={['VERIFIER']}>
                  <VerifierOrganizers />
                </ProtectedRoute>
              }
            />

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
