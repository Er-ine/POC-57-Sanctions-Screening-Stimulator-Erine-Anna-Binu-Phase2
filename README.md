# Sanctions Screening Simulator

**Governance & Trust — Real Rails Intelligence Library**
**Batch 6 · POC-57**
**Author:** Erine Anna Binu
**Repository:** [POC--57--Sanctions-Screening-Stimulator--Erine-Anna-Binu](https://github.com/Er-ine/POC--57--Sanctions-Screening-Stimulator--Erine-Anna-Binu)
**Evidence Drive:** [Screenshots & Demonstration Video](https://drive.google.com/drive/folders/1PgA-M80GGV0YOokWQKraaN6XEbxouY1g?usp=drive_link)

---

## 1. Project Overview & Problem Statement

Financial institutions and cross-border payment processors are legally mandated by authorities like the U.S. Department of the Treasury's Office of Foreign Assets Control (OFAC) to screen payment counterparties and beneficial owners against designated sanctions lists before transaction settlement.

Exact-name string matching fails in production: sanctioned entities, blocked vessels, and designated individuals routinely appear under transliteration variations, spelling typos, token reorderings (e.g. *&quot;AIRLINES AEROCARIBBEAN&quot;* vs. *&quot;AEROCARIBBEAN AIRLINES&quot;*), and deliberate obfuscation.

**Sanctions Screening Simulator (POC-57)** provides a production-grade, two-tier compliance workflow:
1. **Real Data Ingestion:** Loads the live OFAC Specially Designated Nationals (SDN) dataset (19,130+ designated records).
2. **Fuzzy String Matching Engine:** RapidFuzz token-sort-ratio matching across synthetic payment counterparties (typo variants, token inversions, character mutations, and benign negative controls).
3. **Explainable Confidence Scoring:** Generates a 0–100 similarity score paired with a plain-language audit rationale for defensible analyst reviews.
4. **Real Rails 70/30 Split Architecture:** 70% Main Stage (score histogram, sensitivity slider, case queue) paired with a 30% Intelligence Sidebar (case inspector, reviewer decision persistence, regulatory authority breakdown, source provenance, and CSV export).

---

## 2. Architecture & System Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        REAL RAILS INTELLIGENCE                         │
│                    Sanctions Screening Simulator                       │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌───────────────────────┐         REST / JSON   ┌──────────────────┐  │
│  │   Next.js 16 Frontend │ ◄───────────────────► │  FastAPI Backend │  │
│  │   (Port 3000)         │                       │  (Port 8000)     │  │
│  │                       │                       │                  │  │
│  │  ┌─────────────────┐  │                       │  ┌────────────┐  │  │
│  │  │ Main Stage (70%)│  │                       │  │   DuckDB   │  │  │
│  │  │ - Histogram     │  │                       │  │ (In-Memory)│  │  │
│  │  │ - Slider (0-100)│  │                       │  └──────┬─────┘  │  │
│  │  │ - Case Queue    │  │                                 │        │  │
│  │  └─────────────────┘  │                       ┌─────────▼─────┐  │  │
│  │                       │                       │ OFAC SDN List │  │  │
│  │  ┌─────────────────┐  │                       │ (19,130+ rows)│  │  │
│  │  │ Sidebar (30%)   │  │                       └───────────────┘  │  │
│  │  │ - Case Inspector│  │                                          │  │
│  │  │ - Decisions (DB)│  │  Endpoints:                             │  │
│  │  │ - Why It Matters│  │  • GET  /cases?threshold=               │  │
│  │  │ - Who Controls  │  │  • GET  /stats?threshold=               │  │
│  │  │ - Source Prov.  │  │  • GET  /screen?name=&threshold=         │  │
│  │  │ - Export CSV    │  │  • POST /cases/{id}/decision            │  │
│  │  └─────────────────┘  │  • GET  /export?format=csv               │  │
│  └───────────────────────┘  • GET  /api/source-confidence          │  │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│  Data Layer & Protocols:                                               │
│  - Real Regulatory Data: U.S. Treasury OFAC SDN List (Confidence: 98%) │
│  - Simulation Model: Adversarial Typology Generator (Confidence: 85%) │
│  - FastMCP Protocol: mcp_server.py (stdio JSON-RPC integration)        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

| Layer | Technologies | Key Responsibilities |
|:---|:---|:---|
| **Backend** | Python 3.14, FastAPI, DuckDB, RapidFuzz, Pandas, Pydantic | Ingestion of OFAC SDN CSV, in-memory SQL execution, thread-safe cursors, fuzzy similarity calculations, audit decision persistence, CSV streaming |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS | High-density fintech aesthetic (`#030712` Obsidian black), reactive state, client-side filtering, interactive threshold slider, case review workflow |
| **Protocol** | FastMCP (Model Context Protocol) | LLM tool integration exposing `screen_name` and `list_sanctioned_entities` over stdio |
| **Testing** | Pytest, FastAPI TestClient, ESLint | 14 automated backend test cases, zero-error ESLint compliance, production build verification |

---

## 4. Verified Features & Workflows

- [x] **OFAC Ingestion:** Dynamic path-resolved ingestion of 19,130+ OFAC SDN records into DuckDB with entity types and sanctions program tags.
- [x] **Token-Sort Fuzzy Engine:** Uses `fuzz.token_sort_ratio` to ensure token permutations (e.g. *&quot;AEROCARIBBEAN AIRLINES&quot;* vs. *&quot;AIRLINES AEROCARIBBEAN&quot;*) yield a 100% match score while capturing spelling variants.
- [x] **Explainable Match Scoring:** Every candidate match generates a tier-based plain-language explanation distinguishing near-exact matches, potential transliterations, and low-probability lexical coincidences.
- [x] **Real Rails 70/30 Split:**
  - **Main Stage (70%):** Match distribution histogram, sensitivity threshold slider (0–100%), live search filter, and interactive case review table.
  - **Intelligence Sidebar (30%):** Dual-mode interface housing the **Case Inspector** (with decision workflow) and **Rail Governance** (*Why This Matters*, *Who Controls This Rail*, *Decisions to Make*, *Derived Insights*, and *Source Confidence Panel*).
- [x] **Reviewer Decision Workflow (Persisted):** Analysts can record audit actions (*Escalate Case*, *Clear Case*) with custom compliance notes via `POST /cases/{case_id}/decision`, immediately updating the case queue, stats, and audit records in DuckDB.
- [x] **Downloadable Sample Data / CSV Export:** Streamed live export from `GET /export?format=csv` incorporating case IDs, counterparty names, closest OFAC candidates, confidence scores, reviewer decisions, audit notes, and timestamps.
- [x] **Ad-Hoc Single Entity Screener:** Interactive modal allowing compliance teams to test arbitrary entity queries against the live OFAC database with immediate candidate rankings and explainability.
- [x] **MCP Tool Integration:** Fully wired `mcp_server.py` connecting AI agents directly to live sanctions screening functions.

---

## 5. API Reference

| Endpoint | Method | Parameters | Description |
|:---|:---|:---|:---|
| `/` | `GET` | — | System health status, project metadata, and rail category. |
| `/screen` | `GET` | `name` (string), `threshold` (float, default 70.0) | Screens a single counterparty name against the OFAC SDN list; returns top 5 candidate matches and explainability. |
| `/cases` | `GET` | `threshold` (float, 0.0–100.0) | Screens all counterparties at the given threshold and returns the case queue. |
| `/stats` | `GET` | `threshold` (float, 0.0–100.0) | Aggregate queue metrics (total, escalated, cleared, escalation rate %). |
| `/cases/{id}/decision` | `POST` | `case_id` (path int), Body: `{ decision: "escalated" \| "cleared" \| "in_review", notes: string }` | Persists an analyst review decision, audit timestamp, and compliance notes in DuckDB. |
| `/export` | `GET` | `threshold` (float), `format` (`"json"` or `"csv"`) | Exports the screened case queue. Format `csv` triggers a streaming download. |
| `/export/csv` | `GET` | `threshold` (float) | Direct download alias for the CSV case queue. |
| `/api/source-confidence` | `GET` | — | Data source attribution, freshness, record counts, and confidence ratings. |
| `/reset` | `POST` | — | Re-initializes synthetic counterparties to clean baseline state for testing. |

---

## 6. Installation & Startup Instructions

### Prerequisites
- Python 3.10+ (tested on Python 3.14)
- Node.js 18+ (tested on Node.js 20+)
- Official OFAC SDN dataset at `backend/data/ofac_sdn.csv` (included in repository)

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Run automated test suite
python -m pytest test_backend.py -v

# Start FastAPI server
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
*API runs at `http://127.0.0.1:8000` (Interactive Swagger docs at `http://127.0.0.1:8000/docs`).*

### Frontend Setup
```bash
# In a separate terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run type check & linter
npm run lint

# Build production bundle
npm run build

# Start development server
npm run dev
```
*Application runs at `http://localhost:3000`.*

---

## 7. Automated Test Suite & Quality Verification

The repository includes a comprehensive 14-test verification suite in [`backend/test_backend.py`](file:///c:/Users/ERINE%20ANNA%20BINU/OneDrive/Desktop/Projects/POC--57--Sanctions-Screening-Stimulator--Erine-Anna-Binu/backend/test_backend.py):

```
backend/test_backend.py::test_ofac_data_loading PASSED                   [  7%]
backend/test_backend.py::test_synthetic_counterparties_generation PASSED [ 14%]
backend/test_backend.py::test_matcher_exact_match PASSED                 [ 21%]
backend/test_backend.py::test_matcher_fuzzy_reordering_and_typo PASSED   [ 28%]
backend/test_backend.py::test_matcher_clean_entity_clears PASSED         [ 35%]
backend/test_backend.py::test_explainability_logic PASSED                [ 42%]
backend/test_backend.py::test_api_root PASSED                            [ 50%]
backend/test_backend.py::test_api_stats_math PASSED                      [ 57%]
backend/test_backend.py::test_api_cases_threshold_sensitivity PASSED     [ 64%]
backend/test_backend.py::test_api_reviewer_decision_persistence PASSED   [ 71%]
backend/test_backend.py::test_api_decision_validation_errors PASSED      [ 78%]
backend/test_backend.py::test_api_export_formats PASSED                  [ 85%]
backend/test_backend.py::test_api_source_confidence PASSED               [ 92%]
backend/test_backend.py::test_mcp_server_integration PASSED              [100%]

============================= 14 passed in 47.36s =============================
```

Frontend quality verification:
- **TypeScript:** Strict type contracts in [`frontend/lib/types.ts`](file:///c:/Users/ERINE%20ANNA%20BINU/OneDrive/Desktop/Projects/POC--57--Sanctions-Screening-Stimulator--Erine-Anna-Binu/frontend/lib/types.ts) with zero `any` types.
- **ESLint:** `npm run lint` passes with 0 errors and 0 warnings.
- **Next.js Build:** `npm run build` generates optimized static pages cleanly.

---

## 8. Responsible Screening & Data Provenance Disclosure

- **Potential vs. Confirmed Matches:** The screening scores represent lexical and token similarity against government lists. A score ≥ 70% indicates a *potential candidate for enhanced due diligence*, not a legally confirmed identity match.
- **Synthetic Test Controls:** While the OFAC SDN dataset is genuine and public, payment counterparty records are synthetically modeled to evaluate algorithm recall and precision without exposing real customer financial data.
- **Regulatory Disclaimers:** This proof of concept is an intelligence simulation and decision-support prototype. It does not replace official compliance counsel or mandatory regulatory filings (such as FinCEN SARs or OFAC blocking reports).

---

## 9. Project Structure

```
├── backend/
│   ├── data/
│   │   └── ofac_sdn.csv          # Real OFAC SDN sanctions list (19,130+ entries)
│   ├── data_loader.py            # Dynamic CSV ingestion & synthetic generator
│   ├── main.py                   # FastAPI application, decision endpoints & CSV streaming
│   ├── matcher.py                # RapidFuzz scoring & explainability generation
│   ├── requirements.txt          # Python dependencies (FastAPI, DuckDB, RapidFuzz, pytest)
│   └── test_backend.py           # 14-point automated test suite
├── frontend/
│   ├── app/
│   │   ├── globals.css           # Tailwind styling & dark theme variables
│   │   ├── layout.tsx            # Root layout wrapper
│   │   └── page.tsx              # Main dashboard composition root (70/30 split)
│   ├── components/
│   │   ├── CaseFilters.tsx       # Status toggle & search filtering
│   │   ├── CaseSidebar.tsx       # Presentational inspector component
│   │   ├── IntelligenceSidebar.tsx # Real Rails 30% Intelligence Layer & decision actions
│   │   ├── MatchDistributionChart.tsx # Match score bucket histogram
│   │   ├── QuickScreenModal.tsx  # Ad-hoc live OFAC entity screener
│   │   ├── ScreeningTable.tsx    # Case review table with candidate matching
│   │   ├── SourceConfidencePanel.tsx # Source attribution & confidence ratings
│   │   └── ThresholdSlider.tsx   # Sensitivity slider & quick presets
│   ├── lib/
│   │   ├── api.ts                # Typed backend API client
│   │   └── types.ts              # Domain interfaces & TypeScript contracts
│   └── README.md                 # Frontend architecture documentation
├── mcp_server.py                 # FastMCP server integrating live OFAC screening tools
├── Screenshots and video         # Reference URL for visual demonstration assets
├── ARCHITECTURE.md               # Detailed system architecture specification
├── AI_USAGE.md                   # AI usage summary and Repomix protocol audit
├── VAR_REPORT.md                 # Gate 1 Visualization Audit Review (100% compliant)
└── UAT_CHECKLIST.md              # Requirement-linked User Acceptance Checklist
```

---

## 10. Documentation Index

- [ARCHITECTURE.md](file:///c:/Users/ERINE%20ANNA%20BINU/OneDrive/Desktop/Projects/POC--57--Sanctions-Screening-Stimulator--Erine-Anna-Binu/ARCHITECTURE.md) — Architectural patterns, DuckDB concurrency, and data flow.
- [VAR_REPORT.md](file:///c:/Users/ERINE%20ANNA%20BINU/OneDrive/Desktop/Projects/POC--57--Sanctions-Screening-Stimulator--Erine-Anna-Binu/VAR_REPORT.md) — Visualization Audit Review across Gate 1 criteria.
- [UAT_CHECKLIST.md](file:///c:/Users/ERINE%20ANNA%20BINU/OneDrive/Desktop/Projects/POC--57--Sanctions-Screening-Stimulator--Erine-Anna-Binu/UAT_CHECKLIST.md) — Requirement-linked acceptance checklist with step-by-step test records.
- [AI_USAGE.md](file:///c:/Users/ERINE%20ANNA%20BINU/OneDrive/Desktop/Projects/POC--57--Sanctions-Screening-Stimulator--Erine-Anna-Binu/AI_USAGE.md) — AI usage methodology and verification log.
- [frontend/README.md](file:///c:/Users/ERINE%20ANNA%20BINU/OneDrive/Desktop/Projects/POC--57--Sanctions-Screening-Stimulator--Erine-Anna-Binu/frontend/README.md) — Frontend architecture, scripts, and component breakdown.

---

## 11. Local Docker Setup & Repomix Context

This setup runs the existing frontend and FastAPI backend locally in Docker Compose. It does not deploy or publish the application. The MCP stdio process is intentionally not a Compose service because the web application communicates with FastAPI over HTTP and does not depend on an MCP host.

### Prerequisites

- Docker Desktop with Docker Compose v2, started and available in the terminal.
- Node.js and npm only if running Repomix or frontend checks outside Docker.
- Python only if running the backend test suite locally.
- The included `backend/data/ofac_sdn.csv` dataset.

### Generate a Repomix project context

Run Repomix from the repository root. The output is deliberately named `repomix-phase2.xml` so the existing tracked `repomix-output.xml` is left unchanged. The excludes omit environment files, dependencies, generated output, caches, the large source CSV, local MCP-client configuration, and both Repomix output files:

```powershell
npx --yes repomix@latest --output repomix-phase2.xml --ignore "**/.env,**/.env.*,**/node_modules/**,**/.next/**,**/__pycache__/**,**/.pytest_cache/**,**/.mypy_cache/**,**/.ruff_cache/**,**/.venv/**,**/venv/**,**/coverage/**,**/build/**,**/dist/**,backend/data/ofac_sdn.csv,repomix-output.xml,repomix-phase2.xml,claude_desktop_config.json"
```

Review generated context for sensitive material before sharing it. Repomix output is an analysis artifact and is excluded from Docker build contexts.

### Environment configuration

Create the local Compose environment file from the non-secret template:

```powershell
Copy-Item .env.example .env
```

`NEXT_PUBLIC_API_URL` is intentionally blank for the Docker build. Next.js embeds public variables into the client bundle at build time; an empty value makes the browser call same-origin paths on the frontend. `API_INTERNAL_URL` is used when Next.js builds its rewrites and points from the frontend container to `http://backend:8000` on the Compose network. If either value changes, rebuild the frontend image with `docker compose build frontend`.

Never put secrets in `.env.example`, pass secrets as frontend `NEXT_PUBLIC_*` values, or commit a real `.env` file. The root `.gitignore` excludes `.env` files throughout the repository while allowing `.env.example`; the root `.dockerignore` prevents environment files from entering build contexts.

### Build, start, inspect, and stop

Run from the repository root:

```powershell
docker compose config
docker compose build
docker compose up -d
docker compose ps
docker compose logs --tail=100 frontend backend
```

The backend health check calls its existing operational `/` endpoint. Compose waits for the backend to become healthy before starting the frontend. The application is available at `http://localhost:3000`; the backend and interactive API docs are available at `http://localhost:8000` and `http://localhost:8000/docs`.

Stop the containers without deleting images:

```powershell
docker compose down
```

### Local development without Docker

The existing local workflow remains supported. In one terminal, start FastAPI from the backend directory:

```powershell
Set-Location backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

In another terminal, start Next.js:

```powershell
Set-Location frontend
npm ci
npm run dev
```

When `NEXT_PUBLIC_API_URL` is not set, the API client retains its `http://localhost:8000` fallback. Optionally set it in `frontend/.env.local` for local development; that file must not be committed.

### Validate the containers

After `docker compose up -d`, verify the public page, backend endpoints, and same-origin frontend proxy:

```powershell
Invoke-WebRequest http://localhost:3000
Invoke-RestMethod http://localhost:8000/
Invoke-RestMethod "http://localhost:8000/cases?threshold=70"
Invoke-RestMethod "http://localhost:8000/stats?threshold=70"
Invoke-RestMethod "http://localhost:8000/screen?name=AEROCARIBBEAN%20AIRLINES&threshold=70"
Invoke-RestMethod http://localhost:3000/api/source-confidence
Invoke-WebRequest "http://localhost:3000/export/csv?threshold=70"
```

The page should return HTTP 200 and show the existing screening dashboard. The API root should report `status: operational`; cases, stats, screening, source confidence, and CSV export should return successful responses. Also exercise a reviewer decision in the UI to verify the POST through the same-origin proxy.

Inspect logs and check backend recovery:

```powershell
docker compose logs --tail=100 frontend backend
docker compose restart backend
docker compose ps
Invoke-RestMethod http://localhost:8000/
Invoke-RestMethod http://localhost:3000/api/source-confidence
```

The backend uses in-memory DuckDB. Reviewer decisions and other runtime state are lost when the backend process restarts; there is intentionally no volume claiming to persist that memory state. To confirm a clean stop/start:

```powershell
docker compose down
docker compose up -d
docker compose ps
```

### Tests and troubleshooting

Run the existing backend and frontend checks outside Docker:

```powershell
python -m pytest backend/test_backend.py -v
Set-Location frontend
npm ci
npm run lint
npm run build
```

Backend dependencies in `backend/requirements.txt` are currently unpinned, so rebuilds can resolve newer package versions over time. The safest next step is to test and create a maintained, platform-appropriate lock/constraints file before pinning the Docker image; dependencies have not been blindly upgraded or pinned here.

- If Docker commands are unavailable, install/start Docker Desktop and reopen the terminal.
- If Compose reports a port bind failure, stop the process using port 3000 or 8000, or adjust the host-side port mapping in `docker-compose.yml`.
- If the frontend cannot reach the backend, keep the browser URL blank (same-origin) and ensure `API_INTERNAL_URL` resolves to `http://backend:8000`; rebuild the frontend after changing build-time values.
- If the backend is unhealthy, check `docker compose logs backend` for data-loading or Python dependency errors and confirm the CSV exists at `backend/data/ofac_sdn.csv`.
- If a page loads but API calls fail, inspect both service logs and test `/api/source-confidence` through the frontend origin.
