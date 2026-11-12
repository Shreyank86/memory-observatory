# Database Architecture & Schemas

Designated for persistence schemas, indexes, and migrations:

- **pgvector (`/pgvector`)**: PostgreSQL 16 schema definitions with 1536-dimensional HNSW vector index for memory embeddings.
- **MongoDB (`/mongodb`)**: Document collections for retrieval traces, telemetry, and access audit logs.
- **Migrations (`/migrations`)**: Version-controlled database migration scripts.
