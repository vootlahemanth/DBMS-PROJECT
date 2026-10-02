import React from 'react';
import { Ticket, Users, CalendarDays, MapPin, Download } from 'lucide-react';
import { useData } from '../../context/DataContext';
import StatusBadge from '../../components/StatusBadge';

export default function OrganizerBookings() {
  const { bookings } = useData();

  return (
    <main className="dashboard-page">
      <div className="container">
        <div className="dashboard-head">
          <div>
            <div className="eyebrow ink">REVENUE & ADMISSIONS</div>
            <h1>Ticket Bookings Log</h1>
            <p>Comprehensive ledger of ticket sales, customer details, and payment confirmations.</p>
          </div>
          <button className="button button-secondary" onClick={() => window.print()}>
            <Download size={15} /> Export Ledger
          </button>
        </div>

        <div className="bookings-table-wrapper">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Event & Venue</th>
                <th>Tier & Qty</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.bookingId}>
                  <td>
                    <strong>{b.bookingId}</strong>
                  </td>
                  <td>
                    <div>
                      <b>{b.customerName}</b>
                      <small>{b.customerEmail}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <b>{b.eventTitle}</b>
                      <small>
                        {b.venue} · {b.date}
                      </small>
                    </div>
                  </td>
                  <td>
                    {b.quantity} × {b.ticketTier}
                  </td>
                  <td>
                    <strong>₹{b.total?.toLocaleString('en-IN')}</strong>
                  </td>
                  <td>
                    <span className="payment-mode-pill">{b.paymentMethod}</span>
                  </td>
                  <td>
                    <StatusBadge status={b.bookingStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
