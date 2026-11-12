# AgentMemory Backend Core

This module is designated for the persistent memory governance backend:

- **API Layer (`/api`)**: REST API endpoints for memory submission, updates, search, and telemetry.
- **Governance (`/governance`)**: Validation, schema enforcement, classification (Factual, Procedural, Episodic, Semantic, Contextual), importance scoring, and confidence estimation.
- **Duplicate Detection (`/duplicate_detection`)**: MinHash and Jaccard similarity algorithms ($\ge 0.85$ threshold).
- **Conflict Resolution (`/conflict_resolution`)**: Contradictory assertion detection and supersession tracking.
- **Retrieval Engine (`/retrieval`)**: Vector similarity search and adaptive multi-factor ranking ($S = w_s S_{sim} + w_i S_{imp} + w_c S_{conf} + w_r S_{rec} + w_f S_{freq}$).
- **Lifecycle Engine (`/lifecycle`)**: Consolidation and Ebbinghaus temporal decay.
- **Storage Layer (`/storage`)**: PostgreSQL with pgvector integration and MongoDB telemetry logging.
