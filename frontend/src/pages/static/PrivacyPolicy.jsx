import React from 'react';

export default function PrivacyPolicy() {
  return (
    <main className="static-page container py-8">
      <div className="static-header">
        <div className="eyebrow ink">LEGAL & PRIVACY</div>
        <h1>Privacy Policy</h1>
        <p className="lead text-muted">
          Last updated: September 2026. How Universal Tickets protects, collects, and processes your personal data.
        </p>
      </div>

      <div className="legal-content-card my-8">
        <section className="legal-section">
          <h2>1. Information We Collect</h2>
          <p>
            When you create an account, purchase tickets, or register an organization, we collect information including your name, email address, contact phone number, chosen city, and transaction history.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. How We Use Information</h2>
          <p>
            We use your data strictly to:
          </p>
          <ul className="legal-list">
            <li>Process and confirm ticket bookings and generate verifiable digital e-tickets</li>
            <li>Send booking confirmations, status updates, and cancellation notices</li>
            <li>Enable role-based authorization and session management</li>
            <li>Provide relevant location-based event recommendations and semantic discovery</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. Data Protection & Security</h2>
          <p>
            We employ modern cryptographic measures including salted BCrypt password hashing, signed JSON Web Tokens (JWT) for stateless API access, and encrypted transport protocols. We do not sell your personal information to third-party advertisers.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Your Rights & Data Access</h2>
          <p>
            You have the right to access, review, and update your personal account details via your Customer Profile page. For complete account deactivation requests, please reach out to support@universaltickets.local.
          </p>
        </section>
      </div>
    </main>
  );
}
