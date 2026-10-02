import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <main className="static-page container py-8">
      <div className="static-header">
        <div className="eyebrow ink">CUSTOMER PROTECTION</div>
        <h1>Refund & Cancellation Policy</h1>
        <p className="lead text-muted">
          Clear, transparent policies for event cancellations, ticket modifications, and refund processing.
        </p>
      </div>

      <div className="static-grid-3 my-8">
        <div className="static-feature-card">
          <Clock size={24} className="text-blue" />
          <h3>Cancellation Window</h3>
          <p>
            Cancellations can be initiated up to 4 hours prior to the event showtime directly from your <strong>My Bookings</strong> dashboard.
          </p>
        </div>

        <div className="static-feature-card">
          <RefreshCw size={24} className="text-emerald" />
          <h3>Refund Timeline</h3>
          <p>
            Once a cancellation is confirmed, refunds are processed to your original payment method within 3 to 5 business banking days.
          </p>
        </div>

        <div className="static-feature-card">
          <CheckCircle2 size={24} className="text-amber" />
          <h3>Event Rescheduling</h3>
          <p>
            If an organizer reschedules or cancels an event, customers receive 100% full refund credits automatically with zero cancellation fee.
          </p>
        </div>
      </div>

      <div className="legal-content-card my-8">
        <section className="legal-section">
          <h2>1. Customer-Initiated Cancellations</h2>
          <p>
            To cancel an active booking, navigate to your <strong>My Bookings</strong> page, select the active ticket, and click "Cancel Booking". A confirmation dialogue will display the applicable refund breakdown before you confirm.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Non-Refundable Scenarios</h2>
          <p>
            Tickets cannot be cancelled once the 4-hour pre-show window has passed or after the event showtime has commenced. Promotional complimentary passes and festival multi-day passes marked non-refundable at checkout are exempt from cancellations.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Disputed Charges & Assistance</h2>
          <p>
            If your refund does not appear in your account after 7 banking days, please contact our support desk at <code>support@universaltickets.local</code> with your Booking Reference ID.
          </p>
        </section>
      </div>
    </main>
  );
}
