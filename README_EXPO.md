# Universal Tickets — Commercial Enterprise Ticket Booking System
**Course:** Database Systems Engineering and Distributed Backend Development (25CS1302E)  
**Team 2 (Section 9):** V. Hemanth (2520030025), K. Chaitanya (2520030266), CH. Vivek (2520030532)  
**Faculty Guide:** Dr. Prasanthi

---

## 1. PROJECT OVERVIEW
**Universal Tickets** is a high-concurrency, polyglot microservices ticket reservation system designed to support live movies, music concerts, stadium sports, and theater performances across major Indian metropolises. It enforces 3NF relational data integrity in MySQL, natural language event search via TF-IDF cosine similarity in FastAPI, 512-bit JWT security, and responsive React 18 interfaces.

---

## 2. KEY CAPABILITIES
- **Relational ACID Transactions**: Zero seat overbooking via Spring Boot `@Transactional` boundaries.
- **Polyglot Microservices**: Spring Boot 4.1.1 (Java 21), FastAPI (Python 3.10), Node.js (Express), React 18 (Vite).
- **Semantic Event Discovery**: Scikit-Learn TF-IDF vectorization and Cosine Similarity scoring.
- **Role-Based Access Control (RBAC)**: Distinct workflows for Customers, Organizers, Verifiers, and Admins.
- **CI/CD & Containerization**: Docker Compose multi-container virtualization and GitHub Actions automation.

---

## 3. MICROSERVICE & PORT TOPOLOGY
| Service | Runtime / Framework | Port | Responsibility |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 18 / Vite SPA | `5173` | Customer & Role Dashboards, Dark/Light Themes |
| **Backend Core** | Spring Boot 4.1.1 (Java 21) | `8080` | Relational Business Logic, JPA/Hibernate, BCrypt, JWT |
| **Search Gateway** | FastAPI / Uvicorn (Python) | `8000` | TF-IDF Semantic Search Engine & Swagger OpenAPI (`/docs`) |
| **Activity Service**| Node.js / Express | `5001` | Real-time User Audit Telemetry Stream (`/health`) |
| **Database** | MySQL 8.0 Community Server | `3306` | Relational 3NF Schema (`universal_ticket_booking`) |

---

## 4. COURSE OUTCOMES (CO1 – CO6) MAPPING
- **CO1 (Relational DBMS & SQL)**: 8 3NF normalized tables, indexes, CTEs, Window Functions, and `@Transactional` boundaries (`database/schema.sql`).
- **CO2 (NoSQL & Search)**: TF-IDF vectorization + Cosine Similarity semantic search in FastAPI (`fastapi-gateway/main.py`).
- **CO3 (APIs & Security)**: FastAPI gateway on Uvicorn, Pydantic v2 schemas, BCrypt password hashing, and HMAC-SHA512 JWT tokens.
- **CO4 (Enterprise Backend)**: Spring Boot 4.1.1 IoC/DI, Spring Data JPA, and Node.js activity microservice.
- **CO5 (Distributed Systems)**: Microservice boundaries, API gateway reverse proxy, and SAGA cancellation compensation.
- **CO6 (DevOps & Observability)**: Multi-stage Docker Compose, GitHub Actions CI pipeline, and Spring Boot Actuator (`/actuator/health`).

---

## 5. QUICK START GUIDE
```powershell
# 1. Navigate to project root
cd Universal_Tickets_EXPO_READY

# 2. Launch all 4 microservices
powershell -ExecutionPolicy Bypass -File .\start-project.ps1

# 3. Access URLs
Frontend:  http://localhost:5173/
FastAPI:   http://localhost:8000/docs
Backend:   http://localhost:8080/api/events
Node.js:   http://localhost:5001/health
```

---

## 6. AUTHORITATIVE DOCUMENTATION INDEX
- [DBMS_INFO.md](docs/DBMS_INFO.md) — Comprehensive Master Viva & Technical Knowledge Guide
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — Complete Microservices Architecture
- [TECHNOLOGY-MAPPING.md](docs/TECHNOLOGY-MAPPING.md) — Exact Technology Evidence & Statuses
- [API-ENDPOINTS.md](docs/API-ENDPOINTS.md) — Complete REST Endpoint Directory
- [SECURITY.md](docs/SECURITY.md) — BCrypt, JWT, RBAC & Security Audit
- [EXPO-DEMO-FLOW.md](docs/EXPO-DEMO-FLOW.md) — Step-by-Step Live Expo Demonstration Guide
- [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) — Port & Service Recovery Guide
- [FINAL-EXPO-AUDIT.md](docs/FINAL-EXPO-AUDIT.md) — Final Test & Verification Audit Report
- [PROJECT-CLEANUP-REPORT.md](docs/PROJECT-CLEANUP-REPORT.md) — Clean Packaging Audit Log
