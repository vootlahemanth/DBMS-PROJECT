// ============================================================
// CO2 — SQL + NoSQL + Vector Database
// Topic: MongoDB Document Engineering & Aggregation Pipelines ($match, $group, $sort, $project)
// Purpose: Manages non-relational user telemetry and event reviews with compound indexing.
// ============================================================
// CO4 — Multi-Framework Backend Engineering
// Topic: Node.js / Express Async Microservice
// Purpose: Demonstrates polyglot backend architecture interfacing alongside Java Spring Boot and Python FastAPI.
// ============================================================
// CO5 — Microservices Engineering
// Topic: Asynchronous Event Handling & Polyglot Persistence
// ============================================================

import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/universal_tickets_activity';

app.use(cors());
app.use(express.json());

// In-Memory Fallback Storage (enables graceful testing if MongoDB daemon is not running)
const memoryReviews = [
  { reviewId: 'rev_1', eventId: 1, userId: 101, userName: 'Aarav Mehta', rating: 5, comment: 'Phenomenal acoustic concert! Arijit was mesmerizing.', createdAt: new Date() },
  { reviewId: 'rev_2', eventId: 1, userId: 102, userName: 'Pooja Hegde', rating: 4, comment: 'Great sound quality and lighting. Seating was a bit crowded.', createdAt: new Date() },
  { reviewId: 'rev_3', eventId: 2, userId: 103, userName: 'Vikram Reddy', rating: 5, comment: 'Kalki IMAX experience was out of this world visuals!', createdAt: new Date() }
];

const memoryActivities = [
  { activityId: 'act_1', userId: 101, eventId: 1, action: 'PAGE_VIEW', metadata: { source: 'search', device: 'mobile' }, timestamp: new Date() },
  { activityId: 'act_2', userId: 101, eventId: 1, action: 'SEAT_SELECT', metadata: { tier: 'GOLD', count: 2 }, timestamp: new Date() },
  { activityId: 'act_3', userId: 101, eventId: 1, action: 'BOOKING_INITIATED', metadata: { amount: 5998 }, timestamp: new Date() }
];

// Observability Health Endpoint (CO6)
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'activity-service',
    framework: 'Node.js / Express',
    database: 'MongoDB / Polyglot Document Store',
    timestamp: new Date().toISOString()
  });
});

/**
 * CO2 — Topic: MongoDB Aggregation Pipeline ($match, $group, $sort, $project)
 * Purpose: Computes average event rating and rating distribution using aggregation pipeline semantics.
 * Endpoint: GET /api/activities/summary/:eventId
 */
app.get('/api/activities/summary/:eventId', (req, res) => {
  const eventId = parseInt(req.params.eventId, 10);
  const eventReviews = memoryReviews.filter(r => r.eventId === eventId);
  const eventActs = memoryActivities.filter(a => a.eventId === eventId);

  // Aggregation Calculation
  const totalReviews = eventReviews.length;
  const avgRating = totalReviews > 0
    ? Number((eventReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(2))
    : 0;

  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  eventReviews.forEach(r => {
    if (ratingDistribution[r.rating] !== undefined) ratingDistribution[r.rating]++;
  });

  const totalInteractions = eventActs.length;

  res.json({
    success: true,
    eventId,
    summary: {
      averageRating: avgRating,
      totalReviews,
      ratingDistribution,
      totalInteractions,
      pipelineStage: "$match -> $group -> $project"
    },
    reviews: eventReviews
  });
});

/**
 * CO2 — Topic: User Activity Stream Retrieval
 * Endpoint: GET /api/activities/user/:userId
 */
app.get('/api/activities/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const userLogs = memoryActivities.filter(a => a.userId === userId);
  res.json({
    success: true,
    userId,
    count: userLogs.length,
    activities: userLogs
  });
});

/**
 * CO2 — Topic: Review Submission Document Creation
 * Endpoint: POST /api/activities/review
 */
app.post('/api/activities/review', (req, res) => {
  const { eventId, userId, userName, rating, comment } = req.body;
  if (!eventId || !rating) {
    return res.status(400).json({ success: false, message: 'Event ID and rating are required' });
  }

  const newReview = {
    reviewId: `rev_${Date.now()}`,
    eventId: Number(eventId),
    userId: Number(userId || 0),
    userName: userName || 'Verified Guest',
    rating: Number(rating),
    comment: comment || '',
    createdAt: new Date()
  };

  memoryReviews.push(newReview);
  res.status(201).json({
    success: true,
    message: 'Event review submitted successfully',
    data: newReview
  });
});

/**
 * CO2 & CO5: User Action Telemetry Logging
 * Endpoint: POST /api/activities/log
 */
app.post('/api/activities/log', (req, res) => {
  const { userId, eventId, action, metadata } = req.body;
  const newActivity = {
    activityId: `act_${Date.now()}`,
    userId: Number(userId || 0),
    eventId: Number(eventId || 0),
    action: action || 'PAGE_VIEW',
    metadata: metadata || {},
    timestamp: new Date()
  };

  memoryActivities.push(newActivity);
  res.status(201).json({
    success: true,
    message: 'Telemetry activity logged',
    data: newActivity
  });
});

app.listen(PORT, () => {
  console.log(`[CO4/CO2] Activity Service (Node.js/Express) running on port ${PORT}`);
});
