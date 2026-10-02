import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Ticket, Download, ArrowRight, Home, CalendarDays, MapPin } from 'lucide-react';

export default function BookingConfirmation({ booking }) {
  const navigate = useNavigate();

  if (!booking) {
    return (
      <main className="confirmation-page">
        <div className="confirmation-card">
          <h1>Booking not found</h1>
          <Link className="button button-primary" to="/">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="confirmation-page">
      <div className="confirmation-card">
        {/* Success Icon */}
        <div className="success-mark">
          <Check size={32} />
        </div>

        <div className="eyebrow ink">CONFIRMATION # {booking.bookingId}</div>
        <h1>You’re all set!</h1>
        <p className="confirmation-intro">
          Your booking is confirmed. We’ve sent the e-ticket receipt and entry barcode to{' '}
          <strong>{booking.customerEmail}</strong>.
        </p>

        {/* Realistic Ticket Receipt */}
        <div className="ticket-receipt printable-ticket">
          <div className="receipt-row">
            <span>Booking Reference</span>
            <strong>{booking.bookingId}</strong>
          </div>

          <div className="receipt-row">
            <span>Event Name</span>
            <strong>{booking.eventTitle}</strong>
          </div>

          <div className="receipt-row">
            <span>Date & Time</span>
            <strong>
              {booking.date} · {booking.time}
            </strong>
          </div>

          <div className="receipt-row">
            <span>Venue & City</span>
            <strong>
              {booking.venue}, {booking.city}
            </strong>
          </div>

          <div className="receipt-row">
            <span>Ticket Details</span>
            <strong>
              {booking.quantity} × {booking.ticketTier} Tier
            </strong>
          </div>

          <div className="receipt-row">
            <span>Payment Method</span>
            <strong>{booking.paymentMethod} (PAID)</strong>
          </div>

          <div className="receipt-row total-receipt-row">
            <span>Total Amount Paid</span>
            <strong>₹{booking.total?.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        {/* Actions */}
        <div className="confirmation-actions">
          <Link className="button button-primary" to="/my-bookings">
            <Ticket size={16} /> View in My Bookings
          </Link>
          <button className="button button-secondary" onClick={handlePrint}>
            <Download size={16} /> Download E-Ticket
          </button>
        </div>

        <Link className="text-link centered-link" to="/">
          <Home size={14} /> Back to Homepage
        </Link>
      </div>
    </main>
  );
}
