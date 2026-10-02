import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowRight, Home, LayoutDashboard, ShieldCheck, Ticket } from 'lucide-react';

export default function ProtectedRoute({ allowedRoles = ['CUSTOMER', 'ORGANIZER', 'VERIFIER', 'ADMIN'], children }) {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !currentUser) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return (
      <Navigate
        to={`/login?redirect=${returnUrl}`}
        state={{ message: 'Please log in to continue.' }}
        replace
      />
    );
  }

  const userRole = (currentUser.role || 'CUSTOMER').toUpperCase();
  const userEmail = currentUser.email || 'User';

  if (!allowedRoles.includes(userRole)) {
    // Determine dynamic primary redirect based on user's active authenticated role
    let primaryRedirect = '/';
    let primaryLabel = 'Go to Home';
    let PrimaryIcon = Home;

    if (userRole === 'ADMIN') {
      primaryRedirect = '/admin';
      primaryLabel = 'Go to Admin Dashboard';
      PrimaryIcon = ShieldAlert;
    } else if (userRole === 'ORGANIZER') {
      primaryRedirect = '/organizer';
      primaryLabel = 'Go to Organizer Dashboard';
      PrimaryIcon = LayoutDashboard;
    } else if (userRole === 'VERIFIER') {
      primaryRedirect = '/verifier';
      primaryLabel = 'Go to Verifier Dashboard';
      PrimaryIcon = ShieldCheck;
    } else if (userRole === 'CUSTOMER') {
      primaryRedirect = '/my-bookings';
      primaryLabel = 'View My Bookings';
      PrimaryIcon = Ticket;
    }

    // Contextual explanation if visiting /verifier or /organizer or /admin
    const isVerifierPath = location.pathname.startsWith('/verifier');
    const isOrganizerPath = location.pathname.startsWith('/organizer');
    const isAdminPath = location.pathname.startsWith('/admin');

    let sectionTitle = 'Unauthorized Area';
    let sectionSubtitle = `Your account (${userEmail}, role: ${userRole}) does not have permission to view this section.`;

    if (isVerifierPath) {
      sectionTitle = 'Verifier Workspace';
      sectionSubtitle = `This area is available to verified verifier accounts. Your account (${userEmail}, role: ${userRole}) does not have permission to access compliance verification queues.`;
    } else if (isOrganizerPath) {
      sectionTitle = 'Organizer Workspace';
      sectionSubtitle = `This area is designated for registered event organizers. Your account (${userEmail}, role: ${userRole}) does not have event management privileges.`;
    } else if (isAdminPath) {
      sectionTitle = 'Administrator Workspace';
      sectionSubtitle = `This area requires system administrator authorization. Your account (${userEmail}, role: ${userRole}) is not authorized.`;
    }

    return (
      <main className="access-denied-page">
        <div className="container narrow">
          <div className="access-denied-card">
            <div className="denied-icon">
              <ShieldAlert size={36} />
            </div>
            <div className="eyebrow ink">RESTRICTED ACCESS</div>
            <h1>{sectionTitle}</h1>
            <p>{sectionSubtitle}</p>

            <div className="denied-actions">
              <Link className="button button-primary" to={primaryRedirect}>
                <PrimaryIcon size={16} /> {primaryLabel}
              </Link>
              <Link className="button button-secondary" to="/">
                <Home size={16} /> Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return children;
}
