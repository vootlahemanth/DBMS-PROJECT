import React, { useState } from 'react';
import { Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Booking Inquiry',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="static-page container py-8">
      <div className="static-header">
        <div className="eyebrow ink">REACH OUT TO US</div>
        <h1>Contact Universal Tickets Support</h1>
        <p className="lead text-muted">
          Have a question about a booking, need help with an event, or interested in partnership opportunities? We are here to assist.
        </p>
      </div>

      <div className="contact-layout-grid my-8">
        {/* Contact Information */}
        <div className="contact-info-panel">
          <h2>Headquarters & Operations</h2>
          <p className="text-muted mb-6">
            Our operational team is available Monday through Saturday to assist customers and event partners.
          </p>

          <div className="contact-point">
            <MapPin size={20} className="text-red" />
            <div>
              <strong>Hyderabad Operational Office</strong>
              <p className="text-sm text-muted">HITEC City, Madhapur, Hyderabad, Telangana 500081</p>
            </div>
          </div>

          <div className="contact-point">
            <Mail size={20} className="text-blue" />
            <div>
              <strong>Support Email</strong>
              <p className="text-sm text-muted">support@universaltickets.local</p>
            </div>
          </div>

          <div className="contact-point">
            <Clock size={20} className="text-emerald" />
            <div>
              <strong>Operating Hours</strong>
              <p className="text-sm text-muted">Monday – Saturday: 09:00 AM – 08:00 PM IST</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-panel">
          {submitted ? (
            <div className="contact-success-card">
              <CheckCircle2 size={40} className="text-emerald" />
              <h3>Message Received</h3>
              <p className="text-muted">
                Thank you for reaching out, <strong>{formData.name}</strong>. Our support desk has logged your inquiry and will respond to <strong>{formData.email}</strong> shortly.
              </p>
              <button
                className="button button-secondary"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: 'Booking Inquiry', message: '' });
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <h3>Send us a Message</h3>

              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Your Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="Booking Inquiry">Booking Inquiry</option>
                  <option value="Cancellation / Refund">Cancellation / Refund</option>
                  <option value="Organizer Partnership">Organizer Partnership</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="General Feedback">General Feedback</option>
                </select>
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Describe your question or issue in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button type="submit" className="button button-primary full">
                <Send size={16} /> Submit Message
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
