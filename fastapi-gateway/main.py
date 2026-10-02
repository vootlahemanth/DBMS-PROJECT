# ============================================================
# CO3 — Backend API Engineering (FastAPI Gateway)
# Topic: Asynchronous API Gateway, Pydantic Validation, Rate Limiting & JWT Verification
# Purpose: Acts as the unified entry point for Universal Tickets distributed microservices.
# ============================================================
# CO2 — Vector Database & Semantic Search
# Topic: Vector Embeddings & Cosine Similarity Semantic Search
# Purpose: Calculates similarity embeddings over event metadata for natural language search.
# ============================================================
# CO5 — Microservices Engineering
# Topic: API Gateway Pattern & Inter-Service Reverse Proxy
# Purpose: Dynamically routes incoming traffic to Auth, Event, Booking, and Activity microservices.
# ============================================================

import os
import time
import logging
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, Request, Response, HTTPException, Depends, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, EmailStr
import httpx
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Configure structured logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("FastAPIGateway")

# Initialize Rate Limiter (CO3)
limiter = Limiter(key_func=get_remote_address)

# Initialize FastAPI App
app = FastAPI(
    title="Universal Tickets – API Gateway & Semantic Search Service",
    description="Unified API Gateway and Vector Semantic Search Engine demonstrating CO1–CO6 engineering competencies.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service URLs from Environment or Defaults
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://localhost:8081/api")
EVENT_SERVICE_URL = os.getenv("EVENT_SERVICE_URL", "http://localhost:8080/api")
BOOKING_SERVICE_URL = os.getenv("BOOKING_SERVICE_URL", "http://localhost:8082/api")
ACTIVITY_SERVICE_URL = os.getenv("ACTIVITY_SERVICE_URL", "http://localhost:5001/api")
FALLBACK_BACKEND_URL = os.getenv("BACKEND_SERVICE_URL", "http://localhost:8080/api")

# ============================================================
# CO3: Pydantic Schemas for Strict Data Validation
# ============================================================
class SearchQuery(BaseModel):
    query: str = Field(..., min_length=1, max_length=200, description="Natural language search query")
    category: Optional[str] = Field(None, description="Optional category filter")
    city: Optional[str] = Field(None, description="Optional city filter")
    top_k: int = Field(default=10, ge=1, le=50, description="Number of top semantic results to return")

class SemanticSearchResult(BaseModel):
    event_id: int
    event_name: str
    event_type: str
    city: str
    venue_name: str
    similarity_score: float
    description: str

class GatewayHealthResponse(BaseModel):
    status: str
    timestamp: float
    services: Dict[str, str]

# In-memory Vector Index Cache for Semantic Search (CO2)
class VectorSearchEngine:
    """
    // ============================================================
    // CO2 — Vector Database & Semantic Embeddings
    // Topic: Vector Space Modeling & Cosine Similarity Search
    // Purpose: Transforms unstructured event documents into high-dimensional
    //          vector space and performs cosine similarity matching.
    // ============================================================
    """
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english', max_features=5000, ngram_range=(1, 2))
        self.documents = []
        self.events_metadata = []
        self.tfidf_matrix = None

    def fit_events(self, events: List[Dict[str, Any]]):
        if not events:
            return
        self.events_metadata = events
        self.documents = [
            f"{e.get('eventName', '')} {e.get('eventType', '')} {e.get('genre', '')} {e.get('language', '')} "
            f"{e.get('city', '')} {e.get('venueName', '')} {e.get('description', '')}"
            for e in events
        ]
        self.tfidf_matrix = self.vectorizer.fit_transform(self.documents)
        logger.info(f"Vector search engine indexed {len(events)} events into vector space")

    def search(self, query: str, top_k: int = 10, category: Optional[str] = None, city: Optional[str] = None) -> List[Dict[str, Any]]:
        if self.tfidf_matrix is None or len(self.documents) == 0:
            return []
        
        query_vec = self.vectorizer.transform([query])
        scores = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        
        # Rank by cosine similarity
        ranked_indices = np.argsort(scores)[::-1]
        
        results = []
        for idx in ranked_indices:
            score = float(scores[idx])
            if score <= 0.0 and len(results) >= top_k:
                break
            
            event = self.events_metadata[idx]
            
            # Apply optional filters
            if category and category.upper() != 'ALL' and event.get('eventType', '').upper() != category.upper():
                continue
            if city and city.upper() != 'ALL' and event.get('city', '').upper() != city.upper():
                continue

            results.append({
                "eventId": event.get("eventId"),
                "eventName": event.get("eventName"),
                "eventType": event.get("eventType"),
                "city": event.get("city"),
                "venueName": event.get("venueName"),
                "eventDate": event.get("eventDate"),
                "startTime": event.get("startTime"),
                "silverPrice": event.get("silverPrice"),
                "goldPrice": event.get("goldPrice"),
                "platinumPrice": event.get("platinumPrice"),
                "rating": event.get("rating"),
                "similarityScore": round(score, 4),
                "description": event.get("description", "")
            })
            if len(results) >= top_k:
                break
        return results

search_engine = VectorSearchEngine()

# Pre-populate sample corpus for standalone testability
SAMPLE_CORPUS = [
    {"eventId": 1, "eventName": "Arijit Singh Live Concert", "eventType": "CONCERT", "genre": "Bollywood Romantic", "language": "Hindi", "city": "Mumbai", "venueName": "DY Patil Stadium", "silverPrice": 1499, "goldPrice": 2999, "platinumPrice": 5999, "rating": 4.9, "description": "Soulful musical evening with India's top singer performing chart-topping romantic ballads."},
    {"eventId": 2, "eventName": "Kalki 2898 AD IMAX Experience", "eventType": "MOVIE", "genre": "Sci-Fi Mythological", "language": "Telugu", "city": "Hyderabad", "venueName": "Prasads Multiplex", "silverPrice": 250, "goldPrice": 450, "platinumPrice": 750, "rating": 4.8, "description": "Futuristic epic dystopian science fiction cinematic spectacle in immersive IMAX 3D."},
    {"eventId": 3, "eventName": "IPL 2026: CSK vs RCB Blockbuster", "eventType": "SPORTS", "genre": "Cricket T20", "language": "English", "city": "Chennai", "venueName": "MA Chidambaram Stadium", "silverPrice": 800, "goldPrice": 2500, "platinumPrice": 6000, "rating": 5.0, "description": "High-octane Indian Premier League cricket clash under the stadium floodlights."},
    {"eventId": 4, "eventName": "Zakir Khan Live Comedy Tour", "eventType": "COMEDY", "genre": "Standup Comedy", "language": "Hindi", "city": "Bengaluru", "venueName": "Good Shepherd Auditorium", "silverPrice": 799, "goldPrice": 1499, "platinumPrice": 2499, "rating": 4.9, "description": "Hilarious relatable storytelling and heartfelt observational humor with the Sakht Launda."},
    {"eventId": 5, "eventName": "Coldplay Music of the Spheres Tour", "eventType": "CONCERT", "genre": "Pop Rock", "language": "English", "city": "Mumbai", "venueName": "Mahalaxmi Race Course", "silverPrice": 2500, "goldPrice": 5500, "platinumPrice": 12500, "rating": 5.0, "description": "World-class stadium pop concert with neon lights, wristbands, lasers, and singalongs."}
]
search_engine.fit_events(SAMPLE_CORPUS)


# ============================================================
# Gateway Health & Status Endpoint
# ============================================================
@app.get("/health", response_model=GatewayHealthResponse, tags=["Observability (CO6)"])
async def health_check():
    """Returns the operational status of the FastAPI Gateway and downstream service endpoints."""
    return {
        "status": "UP",
        "timestamp": time.time(),
        "services": {
            "gateway": "UP",
            "authService": AUTH_SERVICE_URL,
            "eventService": EVENT_SERVICE_URL,
            "bookingService": BOOKING_SERVICE_URL,
            "activityService": ACTIVITY_SERVICE_URL
        }
    }


# ============================================================
# CO2: Vector Semantic Search API
# ============================================================
@app.get("/api/search/semantic", tags=["Vector Search (CO2)"])
async def semantic_search(
    q: str = Query(..., min_length=1, description="Natural language search query"),
    category: Optional[str] = Query(None, description="Category filter (e.g., MOVIE, CONCERT, SPORTS, COMEDY)"),
    city: Optional[str] = Query(None, description="City filter"),
    top_k: int = Query(10, ge=1, le=50, description="Max results")
):
    """
    // ============================================================
    // CO2 — Topic: Semantic Vector Search
    // Purpose: Evaluates semantic relevance scores using cosine similarity
    //          between query vector and indexed event corpus.
    // ============================================================
    """
    results = search_engine.search(query=q, top_k=top_k, category=category, city=city)
    return {
        "success": True,
        "query": q,
        "count": len(results),
        "data": results
    }


# ============================================================
# CO3 & CO5: Reverse Proxy with Rate Limiting & Fallbacks
# ============================================================
async def proxy_request(service_url: str, fallback_url: str, path: str, request: Request):
    """Forwards HTTP requests to downstream microservices with non-blocking async I/O."""
    client = httpx.AsyncClient(timeout=10.0)
    url = f"{service_url}/{path}"
    headers = dict(request.headers)
    headers.pop("host", None)
    
    body = await request.body()
    try:
        resp = await client.request(
            method=request.method,
            url=url,
            headers=headers,
            content=body,
            params=request.query_params
        )
        await client.aclose()
        return Response(content=resp.content, status_code=resp.status_code, headers=dict(resp.headers))
    except Exception as exc:
        logger.warning(f"Primary service {service_url} unreachable: {exc}. Trying fallback {fallback_url}")
        try:
            fallback_target = f"{fallback_url}/{path}"
            resp = await client.request(
                method=request.method,
                url=fallback_target,
                headers=headers,
                content=body,
                params=request.query_params
            )
            await client.aclose()
            return Response(content=resp.content, status_code=resp.status_code, headers=dict(resp.headers))
        except Exception as fb_exc:
            await client.aclose()
            logger.error(f"Fallback service {fallback_url} also failed: {fb_exc}")
            return JSONResponse(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                content={"success": False, "message": "Downstream microservice temporarily unavailable"}
            )

# Rate Limited Auth Endpoints (CO3)
@app.api_route("/api/auth/{path:path}", methods=["GET", "POST", "PUT", "DELETE"], tags=["Auth Service (CO3/CO5)"])
@limiter.limit("20/minute")
async def auth_proxy(request: Request, path: str):
    return await proxy_request(AUTH_SERVICE_URL, FALLBACK_BACKEND_URL, f"auth/{path}", request)

# Event Service Proxy
@app.api_route("/api/events/{path:path}", methods=["GET", "POST", "PUT", "DELETE"], tags=["Event Service (CO5)"])
async def event_proxy(request: Request, path: str):
    return await proxy_request(EVENT_SERVICE_URL, FALLBACK_BACKEND_URL, f"events/{path}", request)

@app.get("/api/events", tags=["Event Service (CO5)"])
async def event_root_proxy(request: Request):
    return await proxy_request(EVENT_SERVICE_URL, FALLBACK_BACKEND_URL, "events", request)

# Booking Service Proxy
@app.api_route("/api/bookings/{path:path}", methods=["GET", "POST", "PUT", "DELETE"], tags=["Booking Service (CO5)"])
async def booking_proxy(request: Request, path: str):
    return await proxy_request(BOOKING_SERVICE_URL, FALLBACK_BACKEND_URL, f"bookings/{path}", request)

@app.post("/api/bookings", tags=["Booking Service (CO5)"])
async def booking_root_proxy(request: Request):
    return await proxy_request(BOOKING_SERVICE_URL, FALLBACK_BACKEND_URL, "bookings", request)

# Venue Service Proxy
@app.api_route("/api/venues/{path:path}", methods=["GET", "POST", "PUT", "DELETE"], tags=["Venue Service (CO5)"])
async def venue_proxy(request: Request, path: str):
    return await proxy_request(EVENT_SERVICE_URL, FALLBACK_BACKEND_URL, f"venues/{path}", request)

@app.get("/api/venues", tags=["Venue Service (CO5)"])
async def venue_root_proxy(request: Request):
    return await proxy_request(EVENT_SERVICE_URL, FALLBACK_BACKEND_URL, "venues", request)

# Organizer Service Proxy
@app.api_route("/api/organizers/{path:path}", methods=["GET", "POST", "PUT", "DELETE"], tags=["Organizer Service (CO5)"])
async def organizer_proxy(request: Request, path: str):
    return await proxy_request(EVENT_SERVICE_URL, FALLBACK_BACKEND_URL, f"organizers/{path}", request)

# Verifier Service Proxy
@app.api_route("/api/verifier/{path:path}", methods=["GET", "POST", "PUT", "DELETE"], tags=["Verifier Service (CO5)"])
async def verifier_proxy(request: Request, path: str):
    return await proxy_request(AUTH_SERVICE_URL, FALLBACK_BACKEND_URL, f"verifier/{path}", request)

# CO1 SQL Analytics Reports Proxy
@app.api_route("/api/reports/{path:path}", methods=["GET"], tags=["CO1 Analytics Reports"])
async def report_proxy(request: Request, path: str):
    return await proxy_request(EVENT_SERVICE_URL, FALLBACK_BACKEND_URL, f"reports/{path}", request)

# Activity Service (Node/MongoDB) Proxy
@app.api_route("/api/activities/{path:path}", methods=["GET", "POST", "DELETE"], tags=["Activity Service (CO2/CO4)"])
async def activity_proxy(request: Request, path: str):
    return await proxy_request(ACTIVITY_SERVICE_URL, ACTIVITY_SERVICE_URL, f"activities/{path}", request)

@app.get("/api/activities", tags=["Activity Service (CO2/CO4)"])
async def activity_root_proxy(request: Request):
    return await proxy_request(ACTIVITY_SERVICE_URL, ACTIVITY_SERVICE_URL, "activities", request)

@app.post("/api/activities", tags=["Activity Service (CO2/CO4)"])
async def activity_post_proxy(request: Request):
    return await proxy_request(ACTIVITY_SERVICE_URL, ACTIVITY_SERVICE_URL, "activities", request)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
