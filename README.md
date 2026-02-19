# Operations Analytics Dashboard

A full-stack reporting app for operations analysts to view production, inspection, and shipping records in one place by lot ID or date range.

## Table of Contents

- [Project Overview](#project-overview)
- [Project Description](#project-description)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Quick Start (Docker)](#quick-start-docker)
- [Local Development (No Docker)](#local-development-no-docker)
- [How to Run / Build](#how-to-run--build)
- [Usage](#usage)
- [Usage Examples](#usage-examples)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [How to Run Tests](#how-to-run-tests)
- [Acceptance Criteria Coverage](#acceptance-criteria-coverage)
- [Configuration](#configuration)
- [What to Change Before Production](#what-to-change-before-production)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

### User Story

As an operations analyst,
I want to see production, inspection, and shipping records together by lot ID or date,
so that I can answer questions in meetings without manually opening multiple spreadsheets.

### What This App Provides

- Unified dashboard with multiple operational views in one request
- Filtering by `lotId`, `startDate`, and `endDate`
- Lifecycle view that aligns production + inspection + shipping by lot
- Clear missing-data indicators for incomplete records
- Fast drill-ready tables for meeting questions

## Project Description

This application combines data from production, inspection, and shipping into one dashboard so analysts can answer operational questions quickly during meetings. Instead of manually checking separate spreadsheets, users can filter by lot or date range and review aligned lifecycle records, issue indicators, and shipment status in one view.

---

## Architecture

This project follows a layered backend architecture and a separate frontend app:

```
React UI (Vite)
	 │
	 ▼
Express Routes → Controllers → Services → Repositories → PostgreSQL
```

### Backend Layer Responsibilities

- **Routes**: API endpoint declarations
- **Controllers**: HTTP request/response mapping
- **Services**: validation + orchestration/business rules
- **Repositories**: SQL query construction and execution
- **DB Config**: PostgreSQL connection pool

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Runtime/Infra | Docker Compose |
| Tests | Node built-in test runner (`node --test`) |

---

## Repository Structure

```
backend/
	src/
		app.js
		server.js
		config/db.js
		controllers/
		middleware/
		repositories/
		routes/
		services/
		utils/
	tests/

frontend/
	src/
		App.jsx
		api.js
		components/DataTable.jsx

db/
	schema.sql
	seed.sql
	sample_queries.sql

docs/
docker-compose.yml
README.md
```

---

## Quick Start (Docker)

### Prerequisites

- Docker Desktop installed and running

### Start the full stack

```bash
docker compose up --build
```

### Access

- Frontend: http://localhost:5173
- Backend health: http://localhost:4000/api/health

### Stop

```bash
docker compose down
```

---

## Local Development (No Docker)

### 1) Prepare PostgreSQL

Create a database, then run schema:

```bash
psql -U postgres -d <your_db_name> -f db/schema.sql
```

Optional seed data:

```bash
psql -U postgres -d <your_db_name> -f db/seed.sql
```

### 2) Run backend

```bash
cd backend
npm install
npm run dev
```

## How to Run / Build

### Run with Docker

```bash
docker compose up --build
```

### Build containers only

```bash
docker compose build
```

### Run without Docker

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

### 3) Run frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Usage

1. Open the dashboard in your browser.
2. Enter any combination of filters:
	 - `lotId`
	 - `startDate`
	 - `endDate`
3. Apply filters by pressing Enter in a filter input.
4. Review the updated tables, with lifecycle data prioritized when filters are active.

## Usage Examples

### Example 1: Check one lot end-to-end

1. Enter `lotId` (for example `LOT-001`).
2. Press Enter.
3. Review `Lot Lifecycle` at the top for production, inspection, shipping, and missing-data flags.

### Example 2: Analyze a weekly period

1. Set `startDate` and `endDate`.
2. Press Enter in one date field.
3. Compare `Production Line Performance`, `Top Defects`, and `Shipping Holds` for that period.

### Example 3: Reset and compare all data

1. Click `Clear Filters`.
2. Verify all records return and the default table order is restored.

---

## API Endpoints

- `GET /api/health`
- `GET /api/dashboard?lotId=...&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&topDefectsLimit=5`
- `GET /api/lots/summary`
- `GET /api/production-lines/performance`
- `GET /api/lots/inspections`
- `GET /api/lots/shipping`
- `GET /api/lots/lifecycle`
- `GET /api/lots/lifecycle/filter?lotId=...&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- `GET /api/lots/top-defects?limit=5`
- `GET /api/lots/holds`
- `GET /api/production/efficiency-by-shift`

---

## Testing

### Run tests locally

```bash
cd backend
npm test
```

### Run tests in Docker

```bash
docker compose exec backend npm test
```

### Current test suites

- `backend/tests/lifecycleQueryBuilder.test.js`
- `backend/tests/querySemantics.test.js`
- `backend/tests/serviceValidation.test.js`


---

## Acceptance Criteria Coverage

All ACs (AC1-AC10) are covered by at least one automated test.

| AC | Requirement | Test coverage |
|---|---|---|
| AC1 | Cross-function data availability | `lifecycleQueryBuilder.test.js` (`AC1/AC2/AC6 ...`), `querySemantics.test.js` (`AC1 - lifecycle query has all required joins`) |
| AC2 | Lot-based alignment | `lifecycleQueryBuilder.test.js` (`AC1/AC2/AC6 ...`) |
| AC3 | Date-based filtering | `lifecycleQueryBuilder.test.js` (`AC3 ... filters`), `serviceValidation.test.js` (2 AC3 validation tests) |
| AC4 | Missing data visibility | `lifecycleQueryBuilder.test.js` (`AC4/AC10 ... missing data flags`) |
| AC5 | Production issue identification | `querySemantics.test.js` (`AC5 ... issue_runs and issue_rate`) |
| AC6 | Shipment status clarity | `lifecycleQueryBuilder.test.js` + `querySemantics.test.js` (`AC6 ... inspection_result and shipment_status`) |
| AC7 | Meeting-ready summaries | `querySemantics.test.js` (`AC7 ... dashboard bundle keys`), `serviceValidation.test.js` (`AC7 ... limit boundaries`) |
| AC8 | Reduced manual effort | `querySemantics.test.js` (`AC8 ... unified dashboard endpoint`) |
| AC9 | Consistent results | `lifecycleQueryBuilder.test.js` (`AC9 ... deterministic sort`) |
| AC10 | Data completeness awareness | `lifecycleQueryBuilder.test.js` (`AC4/AC10 ... missing flags`) |

---

## Configuration

### Backend (`backend/.env`)

```env
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=operations_analytics
DB_USER=postgres
DB_PASSWORD=your_password
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

---

## What to Change Before Production

### 1) Replace credentials and host values

Update `docker-compose.yml` and any `.env` files:

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

### 2) Set frontend/backend URLs per environment

- `CORS_ORIGIN`
- `VITE_API_BASE_URL`

### 3) Optional branding updates

- `frontend/index.html` (title)
- `frontend/src/App.jsx` (page heading and labels)
- `backend/src/server.js` (startup log message)

### 4) Secrets management

- Do not keep real credentials in source files.
- Use environment variables or secret manager in deployment.

### 5) API keys

No third-party API key is required by the current implementation.

---

## Troubleshooting

### `docker compose --build` fails

Use a valid command:

```bash
docker compose up --build
```

### Build context errors on Windows

If you see tar/mode/snapshot errors:

1. Ensure `.dockerignore` exists in `backend/` and `frontend/`
2. Remove accidental nested folders (for example duplicated `backend/backend`)
3. Clean builder cache:

```bash
docker builder prune -af
```

### Dates show as ISO timestamp (`...T00:00:00.000Z`)

Date formatting is handled in `frontend/src/components/DataTable.jsx` and displayed as `YYYY-MM-DD`.
