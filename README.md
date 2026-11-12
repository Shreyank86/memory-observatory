# Persistent Memory Infrastructure for Collaborative AI Software Engineering
### Memory Observatory — Adaptive Memory Governance Layer for Multi-Agent Systems

---

## 📌 Abstract & Overview

**AgentMemory** is an agent-agnostic, persistent, and adaptive memory infrastructure that enables multiple AI agents and authorized software engineers to store, retrieve, share, inspect, and govern persistent knowledge across heterogeneous sessions and collaborative software projects.

Rather than functioning as an autonomous agent or a simple conversational chatbot, the system serves as a **centralized, intelligent shared memory substrate** positioned underneath developer tools and autonomous AI agents.

### Central Architectural Principle

> **"The agent proposes. AgentMemory governs the memory lifecycle."**

AI agents submit candidate memories during development tasks. **AgentMemory** independently governs the entire lifecycle:
1. **Schema Validation & Classification**
2. **Confidence Estimation & Importance Scoring**
3. **Duplicate Detection** (MinHash with 128 permutations & Jaccard similarity)
4. **Conflict Resolution** (Contradictory and overlapping assertion detection)
5. **Vector Indexing & Persistence** (PostgreSQL with `pgvector` HNSW indexing)
6. **Adaptive Multi-Factor Ranking & Retrieval**
7. **Consolidation & Automated Decay** (Ebbinghaus temporal forgetting curve)

---

## 🔭 Memory Observatory Dashboard

The **Memory Observatory** is the administrative and telemetry frontend for monitoring, auditing, and governing the memory infrastructure in real time.

### Core Modules & Views

| Module | Route | Capabilities |
|---|---|---|
| **Overview Dashboard** | `/` | 6 Core KPI stat cards, 5 Recharts visualizations (growth, retrievals, types, importance distribution, lifecycle breakdown), real-time audit log, and infrastructure health monitoring (PostgreSQL, pgvector, MongoDB, REST API, MCP). |
| **Memories Store** | `/memories` | Full-text and identifier search, 6 multi-dimensional filters (Type, Status, Project, Agent, Importance, Confidence), 9-column data table, and slide-over inspector showing full embeddings, version history, scoring breakdown, and interactive governance actions. Includes **"Propose Candidate Memory"** agent simulation modal. |
| **Semantic Search** | `/search` | Natural language query search showcasing the 5-stage retrieval pipeline: `Query` $\rightarrow$ `Embedding Generation` $\rightarrow$ `pgvector HNSW Search` $\rightarrow$ `Adaptive Ranking` $\rightarrow$ `Top-K Selection`. Includes formula breakdown and dynamically uses live ranking weights. |
| **Projects & Workspaces** | `/projects` | Collaborative project workspaces with clear isolation between **Shared Project Knowledge** (collaborative context) and **Agent Private Scopes** (isolated scratchpads), with member role management (`Admin`, `Editor`, `Viewer`). |
| **AI Agents Registry** | `/agents` | Registered autonomous agents, telemetry (contributions vs. retrievals), connection status toggles, and an explicit **Project Permissions Matrix** for access control. |
| **Retrieval Traces** | `/traces` | Detailed inspection of query execution latency, evaluated candidates, multi-factor scoring bars, and end-to-end retrieval pipeline audit traces. |
| **Memory Lifecycle** | `/lifecycle` | Comprehensive governance monitoring for the 8 memory states: `Candidate`, `Validated`, `Active`, `Updated`, `Superseded`, `Consolidated`, `Decayed`, and `Deleted`. Features a dedicated **Supersession History** audit section, **Duplicate Detection Engine**, **Conflict Resolution**, and **Automated Decay**. |
| **Analytics & Evaluation** | `/analytics` | Information Retrieval (IR) evaluation metrics: **Mean Reciprocal Rank (MRR)**, **Precision@K**, **Recall@K**, retrieval latency trends, duplicate resolution rate, and consolidation trends. |
| **System Settings** | `/settings` | User profile management, project ACL, agent ingestion permissions, vector embedding model configuration, interactive ranking weight sliders, and persistent browser storage. |

---

## 📐 Adaptive Multi-Factor Ranking Formula

During semantic retrieval, memories are not ranked by cosine similarity alone. The system executes an adaptive multi-factor scoring function:

$$\text{Final Score} = (w_{\text{sim}} \cdot \text{Sim}) + (w_{\text{imp}} \cdot \text{Imp}) + (w_{\text{conf}} \cdot \text{Conf}) + (w_{\text{rec}} \cdot \text{Rec}) + (w_{\text{freq}} \cdot \text{Freq})$$

Where:
- $\text{Sim}$ = Cosine/Dot similarity from vector embeddings ($1536$-dim float32)
- $\text{Imp}$ = AgentMemory-governed importance score ($0.0 - 1.0$)
- $\text{Conf}$ = Verification confidence score ($0.0 - 1.0$)
- $\text{Rec}$ = Temporal recency decay function based on timestamp
- $\text{Freq}$ = Logarithmic access frequency score

Weights are fully configurable via the **Settings** view and persist across sessions.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 (Clean, minimal, developer-tool dark navy & slate palette)
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Data Visualization**: Recharts (Area, Bar, Line, and Pie charts)
- **HTTP Client**: Axios (with pre-configured `/v1/memories` endpoints and mock toggle)
- **State & Persistence**: Reactive Context Layer backed by Browser `localStorage`

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation & Run

1. **Clone or navigate to the repository directory**:
   ```bash
   cd memory-observatory
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables (optional)**:
   A default `.env` is provided. You can inspect `.env.example`:
   ```bash
   VITE_API_BASE_URL=http://localhost:8000/v1
   VITE_USE_MOCK_DATA=true
   VITE_MCP_SERVER_URL=http://localhost:8001
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at:
   ```
   http://localhost:5173/
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
memory-observatory/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── common/         # StatCard, DataTable, SearchBar, StatusBadge, ScoreBar, ChartCard, FilterPanel
│   │   └── layout/         # AppLayout, persistent Sidebar
│   ├── context/
│   │   └── AppContext.tsx  # Centralized reactive state & localStorage persistence engine
│   ├── data/
│   │   └── mockData.ts     # Realistic multi-agent software engineering fixtures & benchmarks
│   ├── pages/
│   │   ├── Dashboard/      # Main overview dashboard with 5 Recharts visualizations
│   │   ├── Memories/       # Memory table, slide-over inspector, and candidate proposal modal
│   │   ├── SemanticSearch/ # Semantic query interface and retrieval pipeline visualizer
│   │   ├── Projects/       # Collaborative workspaces & personal/shared memory scoping
│   │   ├── AIAgents/       # Agent registry & project permissions matrix
│   │   ├── RetrievalTraces/# Query latency and multi-factor ranking trace inspector
│   │   ├── MemoryLifecycle/# 8-state governance, supersession history, and conflict resolution
│   │   ├── Analytics/      # Precision@K, Recall@K, MRR, and IR evaluation metrics
│   │   └── Settings/       # ACL, embedding config, dynamic ranking weight sliders
│   ├── services/
│   │   ├── api.ts          # Axios base client
│   │   └── memoryService.ts# Reusable CRUD service with mock/live fallback
│   ├── types/
│   │   └── index.ts        # TypeScript domain models and interfaces
│   ├── App.tsx             # Root router wrapped with AppProvider
│   ├── main.tsx            # DOM root entrypoint
│   └── index.css           # Tailwind CSS imports
├── .env.example            # Environment configuration template
├── package.json            # Dependencies and npm scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite bundler configuration
```

---

## 🎓 Final-Year Engineering Presentation Highlights

When demonstrating this project to evaluators or stakeholders:
1. **Explain the Paradigm Shift**: Contrast standard conversational memory (simple chat history buffers) with **Autonomous Memory Governance** (independent validation, confidence scoring, conflict resolution, and decay).
2. **Demonstrate Agent Proposal**: On `/memories`, click **"+ Propose Candidate Memory"** to showcase how an agent proposes a candidate fact and how AgentMemory runs automated pre-flight checks.
3. **Showcase Retrieval & Dynamic Ranking**: On `/search`, demonstrate how natural language queries evaluate multiple factors (not just vector similarity). Adjust the sliders in `/settings` to show live adaptive score recalculation.
4. **Display Lifecycle & Supersession**: On `/lifecycle`, show how outdated knowledge (`mem-009`) is superseded by updated architecture (`mem-010`), and demonstrate interactive conflict resolution.
5. **Highlight IR Accuracy**: On `/analytics`, present the Mean Reciprocal Rank ($0.89$), Precision@K, and Recall@K curves.
