import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { eventService, venueService, bookingService, organizerService, verifierService } from '../services/api';

const DataContext = createContext(null);

const CATEGORY_IMAGES = {
  movies: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=85',
  concerts: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=85',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=85',
  theatre: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=900&q=85',
  comedy: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=900&q=85',
  activities: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=85',
  other: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=85'
};

export const DataProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('ut_city') || 'Hyderabad';
  });

  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToast({ message, type, id });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, duration);
  };

  const hideToast = () => setToast(null);

  useEffect(() => {
    localStorage.setItem('ut_city', selectedCity);
  }, [selectedCity]);

  // Helper to normalize an event object from backend
  const normalizeEvent = useCallback((rawEvent, venueMap = {}) => {
    if (!rawEvent) return null;
    const eventId = rawEvent.eventId || rawEvent.id || '';
    const typeStr = (rawEvent.eventType || rawEvent.type || 'OTHER').toUpperCase();
    
    let cat = 'activities';
    if (typeStr.includes('MOVIE')) cat = 'movies';
    else if (typeStr.includes('CONCERT') || typeStr.includes('MUSIC')) cat = 'concerts';
    else if (typeStr.includes('SPORT')) cat = 'sports';
    else if (typeStr.includes('THEATRE') || typeStr.includes('PLAY')) cat = 'theatre';
    else if (typeStr.includes('COMEDY')) cat = 'comedy';
    else if (typeStr.includes('OTHER') || typeStr.includes('ACTIVIT')) cat = 'activities';

    const matchedVenue = venueMap[rawEvent.venueId] || {};
    const venueName = matchedVenue.venueName || rawEvent.venue || (rawEvent.venueId ? `Venue (${rawEvent.venueId})` : 'Universal Arena');
    const city = matchedVenue.city || rawEvent.city || 'Hyderabad';

    const basePrice = 350;
    const defaultTiers = [
      { name: 'General', price: basePrice, available: 150, desc: 'General admission entry' },
      { name: 'Regular', price: Math.floor(basePrice * 1.5), available: 100, desc: 'Reserved standard seating' },
      { name: 'Premium', price: Math.floor(basePrice * 2.5), available: 40, desc: 'Prime viewing sightlines' },
      { name: 'VIP', price: Math.floor(basePrice * 4.0), available: 10, desc: 'VIP hospitality & lounge access' }
    ];

    const tiers = rawEvent.tiers && rawEvent.tiers.length > 0 ? rawEvent.tiers : defaultTiers;
    const totalAvail = tiers.reduce((acc, t) => acc + (t.available || 0), 0);

    return {
      id: eventId,
      eventId: eventId,
      title: rawEvent.eventName || rawEvent.title || 'Untitled Event',
      eventName: rawEvent.eventName || rawEvent.title || 'Untitled Event',
      type: rawEvent.eventType || rawEvent.type || 'Event',
      eventType: rawEvent.eventType || rawEvent.type || 'Event',
      category: cat,
      description: rawEvent.description || 'Join us for this premier live event.',
      date: rawEvent.eventDate || rawEvent.date || 'Upcoming',
      time: rawEvent.startTime || rawEvent.time || '18:00',
      endTime: rawEvent.endTime || '21:00',
      language: rawEvent.language || 'English',
      status: rawEvent.status || 'PUBLISHED',
      organizerId: rawEvent.organizerId || 'ORG-2026-000001',
      venueId: rawEvent.venueId || 'VEN-2026-000001',
      venue: venueName,
      city: city,
      price: basePrice,
      totalTickets: 300,
      availableTickets: totalAvail,
      availabilityStatus: totalAvail === 0 ? 'SOLD OUT' : totalAvail <= 4 ? 'ONLY 4 LEFT' : 'AVAILABLE',
      tiers: tiers,
      image: rawEvent.image || CATEGORY_IMAGES[cat] || CATEGORY_IMAGES.other
    };
  }, []);

  // Fetch real data from backend
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Venues
      let venuesData = [];
      try {
        const vRes = await venueService.list();
        venuesData = vRes.data || [];
        setVenues(venuesData);
      } catch (e) {
        console.warn('Venue fetch fallback:', e);
      }

      const venueMap = {};
      venuesData.forEach((v) => {
        if (v.venueId) venueMap[v.venueId] = v;
      });

      // 2. Fetch Events
      const eRes = await eventService.list();
      const rawEvents = Array.isArray(eRes.data) ? eRes.data : [];
      const normalizedEvents = rawEvents.map((evt) => normalizeEvent(evt, venueMap));
      setEvents(normalizedEvents);

      setLoading(false);
    } catch (err) {
      console.error('Failed to load initial data:', err);
      setError('Unable to load events from the server. Please verify backend connection.');
      setLoading(false);
    }
  }, [normalizeEvent]);

  const fetchOrganizers = useCallback(async () => {
    try {
      const orgRes = await verifierService.getApplications();
      if (orgRes.data) {
        setOrganizers(Array.isArray(orgRes.data) ? orgRes.data : []);
      }
    } catch (e) {
      console.warn('Verifier fetch skipped or unauthorized:', e.message);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Booking action
  const addBooking = async (bookingData) => {
    try {
      const payload = {
        userId: bookingData.userId || 'CUS-2026-000001',
        eventId: bookingData.eventId,
        ticketTier: bookingData.ticketTier || 'PREMIUM',
        quantity: bookingData.quantity || 1,
        pricePerTicket: bookingData.pricePerTicket || 300.0,
        totalAmount: bookingData.totalAmount || 300.0,
        paymentMethod: bookingData.paymentMethod || 'UPI'
      };

      const res = await bookingService.create(payload);
      const savedBooking = res.data;

      // Update local state
      setBookings((prev) => [savedBooking, ...prev]);

      // Update event availability locally
      setEvents((prev) =>
        prev.map((evt) => {
          if (evt.id === bookingData.eventId) {
            const updatedTiers = (evt.tiers || []).map((tier) => {
              if (tier.name === bookingData.ticketTier) {
                return {
                  ...tier,
                  available: Math.max(0, tier.available - bookingData.quantity)
                };
              }
              return tier;
            });
            const totalAvail = Math.max(0, evt.availableTickets - bookingData.quantity);
            return {
              ...evt,
              availableTickets: totalAvail,
              availabilityStatus: totalAvail === 0 ? 'SOLD OUT' : totalAvail <= 4 ? 'ONLY 4 LEFT' : 'AVAILABLE',
              tiers: updatedTiers
            };
          }
          return evt;
        })
      );

      return savedBooking;
    } catch (err) {
      console.error('Failed to create booking in backend:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to complete booking.';
      showToast(msg, 'error');
      throw err;
    }
  };

  // Cancel Booking action
  const cancelBooking = async (bookingId, reason = 'Customer cancellation') => {
    try {
      await bookingService.cancel(bookingId, reason);

      setBookings((prev) =>
        prev.map((b) => {
          if (b.bookingId === bookingId) {
            return {
              ...b,
              bookingStatus: 'CANCELLED',
              refundStatus: 'PROCESSED',
              cancelledAt: new Date().toISOString(),
              cancellationReason: reason
            };
          }
          return b;
        })
      );

      showToast('Booking cancelled successfully. Refund processed to original payment method.', 'success');
      return true;
    } catch (err) {
      console.error('Failed to cancel booking in backend:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to cancel booking.';
      showToast(msg, 'error');
      return false;
    }
  };

  // Add Venue action
  const addVenue = async (venueData) => {
    try {
      const res = await venueService.create(venueData);
      const newVenue = res.data;
      setVenues((prev) => [...prev, newVenue]);
      showToast('Venue added successfully!', 'success');
      return newVenue;
    } catch (err) {
      console.error('Failed to add venue:', err);
      showToast('Failed to add venue. Please try again.', 'error');
      throw err;
    }
  };

  // Add Event action
  const addEvent = async (eventData) => {
    try {
      const res = await eventService.create(eventData);
      const raw = res.data;
      const normalized = normalizeEvent(raw);
      setEvents((prev) => [normalized, ...prev]);
      showToast('Event published successfully!', 'success');
      return normalized;
    } catch (err) {
      console.error('Failed to add event:', err);
      showToast('Failed to publish event. Please try again.', 'error');
      throw err;
    }
  };

  // Update Organizer Verification status
  const updateOrganizerStatus = async (orgId, status, verifierId = 'VER-2026-000001') => {
    try {
      await verifierService.updateStatus(orgId, status, 'Verification updated by verifier');
      setOrganizers((prev) =>
        prev.map((org) => {
          if (org.organizerId === orgId || org.id === orgId) {
            return {
              ...org,
              verificationStatus: status,
              verificationDate: status === 'APPROVED' ? new Date().toISOString() : null,
              verifiedBy: verifierId
            };
          }
          return org;
        })
      );
      showToast(`Organizer application ${status.toLowerCase()}!`, status === 'APPROVED' ? 'success' : 'info');
    } catch (err) {
      console.error('Failed to update organizer status:', err);
      showToast('Failed to update organizer status.', 'error');
    }
  };

  const cities = ['Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi-NCR', 'Chennai', 'Pune'];

  return (
    <DataContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        cities,
        events,
        venues,
        organizers,
        bookings,
        loading,
        error,
        retryFetch: fetchData,
        fetchOrganizers,
        toast,
        showToast,
        hideToast,
        addBooking,
        cancelBooking,
        addVenue,
        addEvent,
        updateOrganizerStatus
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
