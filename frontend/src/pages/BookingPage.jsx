import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  AlertCircle,
  Loader2,
  Tag
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import BookingConfirmation from './BookingConfirmation';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=85';

export default function BookingPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { events, addBooking, showToast } = useData();
  const { currentUser } = useAuth();

  const event = (events || []).find((e) => e.id === id) || (events && events[0]);

  if (!event) {
    return (
      <main className="booking-page">
        <div className="container narrow">
          <div className="empty-state">
            <AlertCircle size={44} />
            <h3>No event selected for booking</h3>
            <p>Please select an event from our catalog to proceed with checkout.</p>
            <Link to="/events" className="button button-primary">
              Browse Events
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const tierParam = searchParams.get('tier') || 'Premium';
  const qtyParam = parseInt(searchParams.get('qty') || '2', 10);

  const matchedTier = (event.tiers || []).find((t) => t.name === tierParam) || {
    name: tierParam,
    price: event.price || 499
  };

  const quantity = Math.max(1, qtyParam);
  const unitPrice = matchedTier.price || event.price || 499;
  const rawSubtotal = unitPrice * quantity;

  // Coupon Promo Code state
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'UNIVERSAL10') {
      const discount = Math.round(rawSubtotal * 0.1);
      setAppliedDiscount(discount);
      setCouponMsg('Coupon UNIVERSAL10 applied! 10% discount added.');
      showToast('10% discount applied!', 'success');
    } else {
      setCouponMsg('Invalid coupon code. Try "UNIVERSAL10"');
    }
  };

  const subtotal = Math.max(0, rawSubtotal - appliedDiscount);
  const convenienceFee = Math.round(subtotal * 0.02); // 2% fee
  const gst = Math.round((subtotal + convenienceFee) * 0.18); // 18% GST
  const grandTotal = subtotal + convenienceFee + gst;

  // Payment Form States
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('rahul.sharma@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('884');
  const [cardName, setCardName] = useState(currentUser?.name || 'Rahul Sharma');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [selectedWallet, setSelectedWallet] = useState('Paytm');

  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Execute Mock Payment
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentError('');

    // Validation
    if (paymentMethod === 'UPI' && (!upiId || !upiId.includes('@'))) {
      setPaymentError('Please enter a valid UPI ID (e.g. name@okaxis)');
      return;
    }

    if (paymentMethod === 'Card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        setPaymentError('Please enter a valid 16-digit card number.');
        return;
      }
      if (!cardExpiry || !cardExpiry.includes('/')) {
        setPaymentError('Please enter a valid expiry date (MM/YY).');
        return;
      }
      if (!cardCvv || cardCvv.length < 3) {
        setPaymentError('Please enter a valid 3-digit CVV.');
        return;
      }
    }

    setProcessing(true);

    // Simulate payment gateway roundtrip
    await new Promise((resolve) => setTimeout(resolve, 1600));

    try {
      const savedBooking = await addBooking({
        userId: currentUser?.userId || 'CUS-2026-000001',
        customerName: currentUser?.name || 'Rahul Sharma',
        customerEmail: currentUser?.email || 'rahul.sharma@gmail.com',
        customerPhone: currentUser?.phone || '+91 98765 43210',
        eventId: event.id,
        eventTitle: event.title,
        eventType: event.type,
        eventImage: event.image || FALLBACK_IMAGE,
        venue: event.venue,
        city: event.city,
        date: event.date,
        time: event.time,
        ticketTier: matchedTier.name,
        pricePerTicket: unitPrice,
        quantity: quantity,
        subtotal: subtotal,
        convenienceFee: convenienceFee,
        gst: gst,
        totalAmount: grandTotal,
        total: grandTotal,
        paymentMethod: paymentMethod
      });

      // Clear any pending booking from session
      try {
        sessionStorage.removeItem('ut_pending_booking');
      } catch (err) {}

      setProcessing(false);
      setConfirmedBooking({
        ...savedBooking,
        eventTitle: event.title,
        customerEmail: currentUser?.email || 'rahul.sharma@gmail.com',
        venue: event.venue,
        city: event.city,
        date: event.date,
        time: event.time,
        ticketTier: matchedTier.name,
        quantity: quantity,
        total: grandTotal,
        paymentMethod: paymentMethod
      });
      showToast('Payment successful! Booking confirmed.', 'success');
    } catch (err) {
      setProcessing(false);
      setPaymentError(err.response?.data?.message || err.message || 'Payment processing failed. Please try again.');
    }
  };

  if (confirmedBooking) {
    return <BookingConfirmation booking={confirmedBooking} />;
  }

  return (
    <main className="booking-page">
      <div className="container narrow">
        {/* Stepper Progress */}
        <div className="stepper">
          <span className="step-item active">
            <span className="step-num">01</span> <b>Event</b>
          </span>
          <i className="step-line active" />
          <span className="step-item active">
            <span className="step-num">02</span> <b>Tickets</b>
          </span>
          <i className="step-line active" />
          <span className="step-item active">
            <span className="step-num">03</span> <b>Payment</b>
          </span>
          <i className="step-line" />
          <span className="step-item">
            <span className="step-num">04</span> <b>Confirmation</b>
          </span>
        </div>

        <div className="booking-layout">
          {/* Main Booking Column */}
          <div className="booking-main-col">
            <Link className="back-link" to={`/events/${event.id}`}>
              <ChevronLeft size={16} /> Back to event details
            </Link>

            <div className="booking-header">
              <div className="eyebrow ink">SECURE CHECKOUT</div>
              <h1>Complete your booking.</h1>
              <p>
                Booking for <strong>{currentUser?.name || 'Customer'}</strong> ({currentUser?.email})
              </p>
            </div>

            {/* Event Summary Card */}
            <div className="payment-card">
              <div className="booking-event">
                <img
                  src={event.image || FALLBACK_IMAGE}
                  alt={event.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = FALLBACK_IMAGE;
                  }}
                />
                <div className="booking-event-details">
                  <span className="event-tag">{event.type}</span>
                  <h3>{event.title}</h3>
                  <p>
                    {event.date} · {event.time}
                    <br />
                    {event.venue}, {event.city}
                  </p>
                </div>
              </div>

              {/* Coupon Code Strip */}
              <div className="coupon-box">
                <form onSubmit={handleApplyCoupon} className="coupon-form">
                  <div className="input-wrap">
                    <Tag size={15} className="input-icon" />
                    <input
                      placeholder="Enter promo code (e.g. UNIVERSAL10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="button button-secondary">
                    Apply
                  </button>
                </form>
                {couponMsg && (
                  <small className={appliedDiscount > 0 ? 'coupon-success' : 'coupon-err'}>
                    {couponMsg}
                  </small>
                )}
              </div>

              {/* Payment Tabs & Form */}
              <div className="payment-section">
                <label className="section-label">Select Payment Method</label>
                <div className="payment-tabs">
                  <button
                    type="button"
                    className={`pay-tab ${paymentMethod === 'UPI' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('UPI')}
                  >
                    <Smartphone size={16} /> UPI
                  </button>
                  <button
                    type="button"
                    className={`pay-tab ${paymentMethod === 'Card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('Card')}
                  >
                    <CreditCard size={16} /> Card
                  </button>
                  <button
                    type="button"
                    className={`pay-tab ${paymentMethod === 'Net Banking' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('Net Banking')}
                  >
                    <Building2 size={16} /> Net Banking
                  </button>
                  <button
                    type="button"
                    className={`pay-tab ${paymentMethod === 'Wallet' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('Wallet')}
                  >
                    <Wallet size={16} /> Wallet
                  </button>
                </div>

                {paymentError && (
                  <div className="form-error-banner">
                    <AlertCircle size={15} /> {paymentError}
                  </div>
                )}

                {/* UPI Sub-form */}
                {paymentMethod === 'UPI' && (
                  <div className="payment-subform">
                    <label>Virtual Payment Address (VPA / UPI ID)</label>
                    <input
                      placeholder="e.g. rahul@okaxis or mobile@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                    <div className="upi-apps-row">
                      <span
                        className="upi-chip"
                        onClick={() => setUpiId(`${(currentUser?.email || 'user').split('@')[0]}@okaxis`)}
                      >
                        Google Pay
                      </span>
                      <span
                        className="upi-chip"
                        onClick={() => setUpiId(`${(currentUser?.email || 'user').split('@')[0]}@ybl`)}
                      >
                        PhonePe
                      </span>
                      <span
                        className="upi-chip"
                        onClick={() => setUpiId(`${(currentUser?.email || 'user').split('@')[0]}@paytm`)}
                      >
                        Paytm UPI
                      </span>
                    </div>
                  </div>
                )}

                {/* Card Sub-form */}
                {paymentMethod === 'Card' && (
                  <div className="payment-subform">
                    <label>Card Number</label>
                    <input
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      maxLength={19}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />

                    <div className="form-grid-2" style={{ marginTop: '12px' }}>
                      <div>
                        <label>Expiry Date</label>
                        <input
                          placeholder="MM/YY"
                          value={cardExpiry}
                          maxLength={5}
                          onChange={(e) => setCardExpiry(e.target.value)}
                        />
                      </div>
                      <div>
                        <label>CVV</label>
                        <input
                          placeholder="123"
                          type="password"
                          value={cardCvv}
                          maxLength={4}
                          onChange={(e) => setCardCvv(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                      <label>Cardholder Name</label>
                      <input
                        placeholder="Name on card"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Net Banking Sub-form */}
                {paymentMethod === 'Net Banking' && (
                  <div className="payment-subform">
                    <label>Select Your Bank</label>
                    <select
                      className="form-select"
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {/* Wallet Sub-form */}
                {paymentMethod === 'Wallet' && (
                  <div className="payment-subform">
                    <label>Select Wallet</label>
                    <select
                      className="form-select"
                      value={selectedWallet}
                      onChange={(e) => setSelectedWallet(e.target.value)}
                    >
                      <option value="Paytm Wallet">Paytm Wallet</option>
                      <option value="PhonePe Wallet">PhonePe Wallet</option>
                      <option value="Amazon Pay">Amazon Pay</option>
                      <option value="Mobikwik">Mobikwik</option>
                    </select>
                  </div>
                )}

                <p className="secure-note">
                  <ShieldCheck size={14} /> Bank-grade 256-bit encryption. PCI-DSS compliant.
                </p>
              </div>
            </div>
          </div>

          {/* Right Summary Aside */}
          <aside className="summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>
                {matchedTier.name} × {quantity}
              </span>
              <strong>₹{rawSubtotal.toLocaleString('en-IN')}</strong>
            </div>

            {appliedDiscount > 0 && (
              <div className="summary-row discount">
                <span>Promo Discount (10%)</span>
                <strong>-₹{appliedDiscount.toLocaleString('en-IN')}</strong>
              </div>
            )}

            <div className="summary-row">
              <span>Convenience fee (2%)</span>
              <strong>₹{convenienceFee.toLocaleString('en-IN')}</strong>
            </div>

            <div className="summary-row">
              <span>Integrated GST (18%)</span>
              <strong>₹{gst.toLocaleString('en-IN')}</strong>
            </div>

            <div className="summary-total">
              <div>
                <span>Total Payable</span>
                <small>Including all government taxes</small>
              </div>
              <strong>₹{grandTotal.toLocaleString('en-IN')}</strong>
            </div>

            <button
              className="button button-primary full pay-submit-btn"
              onClick={handlePaymentSubmit}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 size={16} className="spinner" /> Processing payment...
                </>
              ) : (
                <>
                  Pay ₹{grandTotal.toLocaleString('en-IN')} <ArrowRight size={17} />
                </>
              )}
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
