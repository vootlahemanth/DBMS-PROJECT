import axios from 'axios';

/*
  Spring Boot backend
  React frontend: http://localhost:5173
  Spring Boot backend: http://localhost:8080
*/

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
  Attach logged-in user's token to requests
*/
api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('ut_user');

    if (userStr) {
      try {
        const user = JSON.parse(userStr);

        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error('Invalid user data in localStorage:', error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
  Handle backend errors
*/
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear expired user data safely without hard-redirecting public pages
      if (localStorage.getItem('ut_user')) {
        localStorage.removeItem('ut_user');
      }
    }

    return Promise.reject(error);
  }
);

/*
  =========================
  AUTHENTICATION SERVICES
  =========================
*/
export const authService = {
  async login(credentials) {
    return api.post('/auth/login', credentials);
  },

  async register(userData) {
    return api.post('/auth/register', userData);
  },

  async getCurrentUser() {
    return api.get('/auth/me');
  },
};

/*
  =========================
  EVENT SERVICES
  =========================
*/
export const eventService = {
  async list(params = {}) {
    return api.get('/events', {
      params,
    });
  },

  async getById(id) {
    return api.get(`/events/${id}`);
  },

  async create(eventData) {
    return api.post('/events', eventData);
  },
};

/*
  =========================
  BOOKING SERVICES
  =========================
*/
export const bookingService = {
  async create(payload) {
    return api.post('/bookings', payload);
  },

  async getByUser(userId) {
    return api.get(`/bookings/user/${userId}`);
  },

  async cancel(bookingId, reason) {
    return api.post(`/bookings/${bookingId}/cancel`, {
      reason,
    });
  },
};

/*
  =========================
  VENUE SERVICES
  =========================
*/
export const venueService = {
  async list(city) {
    return api.get('/venues', {
      params: {
        city,
      },
    });
  },

  async create(venueData) {
    return api.post('/venues', venueData);
  },
};

/*
  =========================
  ORGANIZER SERVICES
  =========================
*/
export const organizerService = {
  async getProfile(userId) {
    return api.get(`/organizers/profile/${userId}`);
  },

  async getVenues(orgId) {
    return api.get(`/organizers/${orgId}/venues`);
  },

  async getEvents(orgId) {
    return api.get(`/organizers/${orgId}/events`);
  },

  async getBookings(orgId) {
    return api.get(`/organizers/${orgId}/bookings`);
  },
};

/*
  =========================
  VERIFIER SERVICES
  =========================
*/
export const verifierService = {
  async getApplications() {
    return api.get('/verifier/organizers');
  },

  async updateStatus(orgId, status, notes) {
    return api.put(`/verifier/organizers/${orgId}/status`, {
      status,
      notes,
    });
  },
};

/*
  =========================
  ADMIN SERVICES
  =========================
*/
export const adminService = {
  async getOverview() {
    return api.get('/admin/overview');
  },

  async getUsers() {
    return api.get('/admin/users');
  },

  async getOrganizers() {
    return api.get('/admin/organizers');
  },

  async getVerifiers() {
    return api.get('/admin/verifiers');
  },

  async getEventRevenueReport() {
    return api.get('/reports/event-revenue');
  },

  async getOrganizerPerformanceReport() {
    return api.get('/reports/organizer-performance');
  },

  async getCategoryPopularityReport() {
    return api.get('/reports/category-popularity');
  },
};
