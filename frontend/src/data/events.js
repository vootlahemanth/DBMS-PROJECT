// frontend/src/data/events.js

import { eventService } from '../services/api';

/*
|--------------------------------------------------------------------------
| CATEGORY CONFIGURATION
|--------------------------------------------------------------------------
*/

export const categories = [
  {
    label: 'Movies',
    count: 'Movies',
    icon: 'Film',
    tone: 'gold',
    path: '/movies',
    value: 'movies',
  },
  {
    label: 'Concerts',
    count: 'Live shows',
    icon: 'Music2',
    tone: 'teal',
    path: '/concerts',
    value: 'concerts',
  },
  {
    label: 'Sports',
    count: 'Fixtures',
    icon: 'Trophy',
    tone: 'red',
    path: '/sports',
    value: 'sports',
  },
  {
    label: 'Theatre',
    count: 'Stage shows',
    icon: 'Drama',
    tone: 'plum',
    path: '/theatre',
    value: 'theatre',
  },
  {
    label: 'Comedy',
    count: 'Comedy shows',
    icon: 'Laugh',
    tone: 'blue',
    path: '/comedy',
    value: 'comedy',
  },
  {
    label: 'Activities',
    count: 'More to explore',
    icon: 'Popcorn',
    tone: 'green',
    path: '/activities',
    value: 'activities',
  },
];

/*
|--------------------------------------------------------------------------
| CATEGORY NORMALIZATION
|--------------------------------------------------------------------------
*/

export function normalizeCategory(eventType) {
  const type = String(eventType || '').trim().toUpperCase();

  switch (type) {
    case 'MOVIE':
    case 'MOVIES':
      return 'movies';

    case 'CONCERT':
    case 'CONCERTS':
      return 'concerts';

    case 'SPORT':
    case 'SPORTS':
      return 'sports';

    case 'THEATRE':
    case 'THEATER':
      return 'theatre';

    case 'COMEDY':
      return 'comedy';

    case 'OTHER':
    case 'ACTIVITY':
    case 'ACTIVITIES':
      return 'activities';

    default:
      return 'activities';
  }
}

/*
|--------------------------------------------------------------------------
| DISPLAY NAME
|--------------------------------------------------------------------------
*/

export function getCategoryLabel(category) {
  switch (category) {
    case 'movies':
      return 'Movies';

    case 'concerts':
      return 'Concerts';

    case 'sports':
      return 'Sports';

    case 'theatre':
      return 'Theatre';

    case 'comedy':
      return 'Comedy';

    case 'activities':
      return 'Activities';

    default:
      return 'Activities';
  }
}

/*
|--------------------------------------------------------------------------
| CATEGORY IMAGE FALLBACKS
|--------------------------------------------------------------------------
|
| The current backend events table does not contain image URLs.
| These images are only used as frontend presentation fallbacks.
|--------------------------------------------------------------------------
*/

const categoryImages = {
  movies:
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=85',

  concerts:
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85',

  sports:
    'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=85',

  theatre:
    'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=85',

  comedy:
    'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1200&q=85',

  activities:
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=85',
};

/*
|--------------------------------------------------------------------------
| DATE FORMATTING
|--------------------------------------------------------------------------
*/

export function formatEventDate(dateValue) {
  if (!dateValue) {
    return 'Date unavailable';
  }

  try {
    const date = new Date(`${dateValue}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return String(dateValue);
  }
}

/*
|--------------------------------------------------------------------------
| TIME FORMATTING
|--------------------------------------------------------------------------
*/

export function formatEventTime(timeValue) {
  if (!timeValue) {
    return 'Time unavailable';
  }

  const value = String(timeValue);

  const match = value.match(/^(\d{1,2}):(\d{2})/);

  if (!match) {
    return value;
  }

  let hours = Number(match[1]);
  const minutes = match[2];

  const period = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;

  if (hours === 0) {
    hours = 12;
  }

  return `${hours}:${minutes} ${period}`;
}

/*
|--------------------------------------------------------------------------
| BACKEND EVENT -> FRONTEND EVENT
|--------------------------------------------------------------------------
*/

export function mapBackendEvent(event) {
  if (!event) {
    return null;
  }

  const category = normalizeCategory(event.eventType);

  return {
    /*
     * IDs
     */
    id: event.eventId || '',
    eventId: event.eventId || '',

    /*
     * Organizer
     */
    organizerId: event.organizerId || '',

    /*
     * Event information
     */
    title: event.eventName || 'Untitled Event',

    eventName: event.eventName || 'Untitled Event',

    type: getCategoryLabel(category),

    eventType: event.eventType || '',

    category,

    description:
      event.description ||
      'Event details will be available soon.',

    language: event.language || 'English',

    /*
     * Date and time
     */
    date: formatEventDate(event.eventDate),

    rawDate: event.eventDate || null,

    time: formatEventTime(event.startTime),

    rawStartTime: event.startTime || null,

    endTime: formatEventTime(event.endTime),

    rawEndTime: event.endTime || null,

    /*
     * Venue
     *
     * The current events API gives venueId but not
     * venue name/city. We therefore preserve the ID.
     */
    venueId: event.venueId || '',

    venue: event.venueId
      ? `Venue ${event.venueId}`
      : 'Venue information unavailable',

    city: 'Location unavailable',

    /*
     * Status
     */
    status: event.status || 'UNKNOWN',

    availabilityStatus:
      event.status === 'PUBLISHED'
        ? 'AVAILABLE'
        : event.status || 'UNKNOWN',

    /*
     * Presentation
     */
    image:
      categoryImages[category] ||
      categoryImages.activities,

    accent: category,

    /*
     * Ticket information
     *
     * These values are intentionally null because the
     * current events table does not contain ticket pricing.
     */
    price: null,

    totalTickets: null,

    availableTickets: null,

    tiers: [],

    /*
     * Database timestamp
     */
    createdAt: event.createdAt || null,
  };
}

/*
|--------------------------------------------------------------------------
| LOAD EVENTS FROM SPRING BOOT
|--------------------------------------------------------------------------
*/

export async function fetchEvents(params = {}) {
  const response = await eventService.list(params);

  const data = Array.isArray(response.data)
    ? response.data
    : [];

  return data
    .map(mapBackendEvent)
    .filter(Boolean);
}

/*
|--------------------------------------------------------------------------
| LOAD SINGLE EVENT
|--------------------------------------------------------------------------
*/

export async function fetchEventById(eventId) {
  if (!eventId) {
    return null;
  }

  try {
    const response = await eventService.getById(eventId);

    return mapBackendEvent(response.data);
  } catch (error) {
    console.error(
      `Failed to load event ${eventId}:`,
      error
    );

    return null;
  }
}

/*
|--------------------------------------------------------------------------
| FILTER BY CATEGORY
|--------------------------------------------------------------------------
*/

export function filterEventsByCategory(eventsList, category) {
  if (!Array.isArray(eventsList)) {
    return [];
  }

  const normalizedCategory =
    String(category || '').toLowerCase();

  return eventsList.filter(
    (event) =>
      event?.category === normalizedCategory
  );
}

/*
|--------------------------------------------------------------------------
| SEARCH EVENTS
|--------------------------------------------------------------------------
*/

export function searchEvents(eventsList, query) {
  if (!Array.isArray(eventsList)) {
    return [];
  }

  const searchText = String(query || '')
    .trim()
    .toLowerCase();

  if (!searchText) {
    return eventsList;
  }

  return eventsList.filter((event) => {
    const title =
      String(event?.title || '').toLowerCase();

    const description =
      String(event?.description || '').toLowerCase();

    const language =
      String(event?.language || '').toLowerCase();

    const category =
      String(event?.category || '').toLowerCase();

    const eventType =
      String(event?.eventType || '').toLowerCase();

    return (
      title.includes(searchText) ||
      description.includes(searchText) ||
      language.includes(searchText) ||
      category.includes(searchText) ||
      eventType.includes(searchText)
    );
  });
}

/*
|--------------------------------------------------------------------------
| SORT EVENTS
|--------------------------------------------------------------------------
*/

export function sortEvents(eventsList, sortBy = 'date') {
  if (!Array.isArray(eventsList)) {
    return [];
  }

  const copiedEvents = [...eventsList];

  switch (sortBy) {
    case 'name':
      return copiedEvents.sort((a, b) =>
        String(a?.title || '').localeCompare(
          String(b?.title || '')
        )
      );

    case 'newest':
      return copiedEvents.sort((a, b) => {
        const dateA = new Date(
          a?.rawDate || '1970-01-01'
        );

        const dateB = new Date(
          b?.rawDate || '1970-01-01'
        );

        return dateB - dateA;
      });

    case 'oldest':
      return copiedEvents.sort((a, b) => {
        const dateA = new Date(
          a?.rawDate || '1970-01-01'
        );

        const dateB = new Date(
          b?.rawDate || '1970-01-01'
        );

        return dateA - dateB;
      });

    default:
      return copiedEvents.sort((a, b) => {
        const dateA = new Date(
          a?.rawDate || '1970-01-01'
        );

        const dateB = new Date(
          b?.rawDate || '1970-01-01'
        );

        return dateA - dateB;
      });
  }
}

/*
|--------------------------------------------------------------------------
| LEGACY EXPORT
|--------------------------------------------------------------------------
|
| Keep these exports so existing components that import
| categories or INITIAL_EVENTS do not immediately break.
|
| IMPORTANT:
| INITIAL_EVENTS is now empty because real data should
| come from the Spring Boot API.
|--------------------------------------------------------------------------
*/

export const INITIAL_USERS = [];

export const INITIAL_ORGANIZERS = [];

export const INITIAL_VENUES = [];

export const INITIAL_EVENTS = [];

export const INITIAL_BOOKINGS = [];

/*
|--------------------------------------------------------------------------
| LEGACY EVENTS EXPORT
|--------------------------------------------------------------------------
*/

export const events = INITIAL_EVENTS;

/*
|--------------------------------------------------------------------------
| DEFAULT EXPORT
|--------------------------------------------------------------------------
*/

export default {
  categories,
  fetchEvents,
  fetchEventById,
  mapBackendEvent,
  filterEventsByCategory,
  searchEvents,
  sortEvents,
};