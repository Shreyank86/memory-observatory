# Model Context Protocol (MCP) Server

Connects autonomous AI agents (Claude, AutoGen, CrewAI, LangChain, Cursor) to AgentMemory:

- **Tools (`/tools`)**:
  - `propose_memory`: Tool for agents to submit candidate memories.
  - `search_memories`: Semantic retrieval tool for accessing project context.
  - `get_project_context`: Scoped context extraction tool.
- **Transports (`/transports`)**: Stdio and SSE communication channels for agent integration.
