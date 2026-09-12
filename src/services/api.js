import axios from 'axios';

export const api = axios.create({ baseURL: '/api', timeout: 8000 });

export const eventService = {
  async list() { return Promise.resolve({ data: [] }); },
  async getById(id) { return Promise.resolve({ data: id }); },
};

export const bookingService = {
  async create(payload) { return Promise.resolve({ data: payload }); },
};
