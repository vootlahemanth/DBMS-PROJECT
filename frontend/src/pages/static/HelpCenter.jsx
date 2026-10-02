import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Search, Ticket, CreditCard, RefreshCw, ChevronDown, MessageSquare, Mail } from 'lucide-react';

export default function HelpCenter() {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'How do I download or view my booked tickets?',
      a: 'After successful checkout, navigate to "My Bookings" in your profile menu. Your digital e-ticket containing your Booking Reference ID, QR verification code, and seat details will be available for instant viewing and printing.'
    },
    {
      q: 'Can I cancel my booking and get a refund?',
      a: 'Yes. Eligible bookings can be cancelled directly from your "My Bookings" page up to 4 hours prior to event showtime, subject to the event organizer\'s cancellation policy. Refunds are credited back to your original payment method within 3 to 5 business days.'
    },
    {
      q: 'How does semantic search work on Universal Tickets?',
      a: 'Our search engine matches terms in event titles, artists, genre descriptions, and venues using text similarity algorithms to help you discover events even if you don\'t know the exact keyword.'
    },
    {
      q: 'What should I do if my payment was deducted but ticket wasn\'t generated?',
      a: 'In rare network interruption cases, check your "My Bookings" page first. If the booking status shows pending, contact our support team at support@universaltickets.local with your transaction timestamp for immediate resolution.'
    },
    {
      q: 'How do I register as an Event Organizer?',
      a: 'Click "Sign Up" and select "Event Organizer" during registration. Provide your organization details and registration documents. Once approved by our compliance verifiers, you can publish events and manage venue inventory.'
    }
  ];

  return (
    <main className="static-page container py-8">
      <div className="static-header text-center">
        <div className="eyebrow ink">SUPPORT & ASSISTANCE</div>
        <h1>How can we help you today?</h1>
        <p className="lead text-muted max-w-xl mx-auto">
          Find quick answers to common questions about ticket bookings, refunds, cancellations, and account settings.
        </p>
      </div>

      <div className="faq-section my-8">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`faq-item ${openFaq === idx ? 'open' : ''}`}
              onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
            >
              <div className="faq-question">
                <span>{faq.q}</span>
                <ChevronDown size={18} className={`faq-chevron ${openFaq === idx ? 'rotated' : ''}`} />
              </div>
              {openFaq === idx && (
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="static-grid-2 my-8">
        <div className="support-card">
          <Mail size={24} className="text-red" />
          <h3>Email Support</h3>
          <p>Send an inquiry to our dedicated customer support desk.</p>
          <code>support@universaltickets.local</code>
        </div>
        <div className="support-card">
          <MessageSquare size={24} className="text-blue" />
          <h3>Contact Form</h3>
          <p>Submit a query directly via our online contact portal.</p>
          <Link to="/contact" className="button button-ghost-sm">
            Open Contact Form →
          </Link>
        </div>
      </div>
    </main>
  );
}
