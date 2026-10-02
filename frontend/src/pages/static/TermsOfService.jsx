import React from 'react';

export default function TermsOfService() {
  return (
    <main className="static-page container py-8">
      <div className="static-header">
        <div className="eyebrow ink">LEGAL & TERMS</div>
        <h1>Terms of Service</h1>
        <p className="lead text-muted">
          Last updated: September 2026. Please read these terms carefully before utilizing Universal Tickets services.
        </p>
      </div>

      <div className="legal-content-card my-8">
        <section className="legal-section">
          <h2>1. Introduction & Acceptance</h2>
          <p>
            Welcome to Universal Tickets. By accessing our web application, registering an account, or purchasing event tickets, you agree to comply with and be bound by these terms. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Ticketing & Booking Rules</h2>
          <p>
            Universal Tickets provides an authorized ticketing platform connecting customers with event organizers and venue operators. Tickets purchased are non-transferable unless explicitly authorized by the event organizer. All prices displayed are in Indian Rupees (INR) and inclusive of applicable taxes unless stated otherwise.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. User Account & Security</h2>
          <p>
            Users are responsible for maintaining the confidentiality of their account credentials, passwords, and session tokens. You agree to notify Universal Tickets immediately of any unauthorized access to your account.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Organizer Responsibilities</h2>
          <p>
            Organizers must submit accurate business registration details and valid event licensing. Universal Tickets reserves the right to suspend or reject any organizer profile that fails compliance review or provides false information.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Limitation of Liability</h2>
          <p>
            Universal Tickets acts as an intermediary ticketing platform and is not responsible for event postponement, rescheduling, venue alterations, or artist cancellations caused by external circumstances beyond our direct control.
          </p>
        </section>
      </div>
    </main>
  );
}
