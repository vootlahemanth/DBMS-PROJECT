# ============================================================
# CO3 — Backend API Engineering (FastAPI Gateway)
# Topic: Automated Testing with Pytest & TestClient
# Purpose: Validates API endpoints, Pydantic constraints, and Vector Search matching.
# ============================================================

import pytest
from fastapi.testclient import TestClient
from main import app, search_engine

client = TestClient(app)

def test_health_endpoint():
    """Validates CO6 Observability Health Probe"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "UP"
    assert "services" in data

def test_semantic_vector_search_success():
    """Validates CO2 Vector Search & Cosine Similarity matching"""
    response = client.get("/api/search/semantic?q=Arijit+Singh+romantic+music")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) > 0
    # Top result should be Arijit Singh
    assert "Arijit" in data["data"][0]["eventName"]
    assert data["data"][0]["similarityScore"] > 0.1

def test_semantic_vector_search_category_filter():
    """Validates category filtering in vector query"""
    response = client.get("/api/search/semantic?q=concert&category=CONCERT")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    for item in data["data"]:
        assert item["eventType"] == "CONCERT"

def test_semantic_search_empty_query_validation():
    """Validates CO3 Pydantic query length constraints"""
    response = client.get("/api/search/semantic?q=")
    assert response.status_code == 422  # Unprocessable Entity
