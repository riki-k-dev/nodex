# Nodex — Decision Record

This document records the main architectural and implementation decisions made while building Nodex, including the alternatives considered, why each decision was made, and the trade-offs accepted.

## Decision 1 — Local-first architecture

### Decision
Nodex processes and stores JSON data in the browser instead of sending JSON payloads to a backend.

### Alternatives considered
- Build a backend API to process and store JSON.
- Store workspaces in a database.
- Build cloud accounts and synchronization.
- Keep the application client-side and local-first.

### Why this was chosen
The core problem is understanding and editing JSON, not managing accounts or cloud data. A local-first architecture keeps the project focused and avoids authentication, backend APIs, databases, and server-side JSON storage.

It also means user JSON does not need to be sent to a server.

### Cost / trade-off
Nodex cannot provide cloud synchronization, accounts, team collaboration, or cross-device workspaces. The application is also limited by browser storage and capabilities.

## Decision 2 — Use a Web Worker for graph processing

### Decision
JSON parsing, graph generation, and Dagre layout calculations run inside a Web Worker.

### Alternatives considered
- Run everything directly in React.
- Move only JSON parsing to a worker.
- Move parsing and graph layout to a worker.

### Why this was chosen
Large and deeply nested JSON can require recursive parsing and graph layout work. Running this on the main thread could make the editor and UI feel unresponsive.

A Web Worker keeps expensive processing away from the main UI thread.

### Cost / trade-off
The architecture becomes more complex because communication with the worker is asynchronous and the application needs processing states such as `isProcessing`.

Debugging is also more involved than a synchronous implementation.

## Decision 3 — React Flow + Dagre for graph visualization

### Decision
React Flow handles graph rendering and interaction, while Dagre handles automatic node layout.

### Alternatives considered
- Build a custom graph renderer with HTML/CSS.
- Build the graph with SVG and implement interactions manually.
- Use another visualization library.
- Use React Flow with a separate layout engine.

### Why this was chosen
React Flow already provides nodes, edges, panning, zooming, controls, and viewport interaction. Dagre provides automatic positioning for the tree-like JSON structure.

This allowed the project to focus on the JSON visualization problem instead of building a graph engine from scratch.

### Cost / trade-off
Nodex depends on the behavior and APIs of both libraries, and the layout is constrained by Dagre's model.

A custom renderer would provide more control but require considerably more implementation and testing.

## Decision 4 — Zustand as the workspace source of truth

### Decision
JSON text, validation state, graph nodes, edges, collapsed nodes, and related workspace state are managed through Zustand.

### Alternatives considered
- Keep state inside individual React components.
- Pass state through component props.
- Use React Context.
- Use Zustand.

### Why this was chosen
The editor and graph need to stay synchronized. A graph edit can update the JSON, while an editor change can regenerate the graph. Centralizing this state makes those relationships easier to manage.

### Cost / trade-off
Global state adds an abstraction and an external dependency compared with local React state.

The trade-off was accepted because synchronization between the editor, graph, persistence, and search became more important than keeping all state local.

## Decision 5 — IndexedDB for workspace persistence

### Decision
Nodex persists its workspace in IndexedDB through `idb-keyval`.

### Alternatives considered
- No persistence.
- `localStorage`.
- IndexedDB.
- A backend database.

### Why this was chosen
Users should be able to refresh the page without losing their workspace. IndexedDB is better suited to larger structured browser data than `localStorage`, while still keeping persistence local.

### Cost / trade-off
IndexedDB is asynchronous and more complex than `localStorage`, so Nodex needs an adapter and hydration handling.

Persistence also remains limited to the current browser.

## Decision 6 — URL-based sharing instead of a sharing backend

### Decision
Nodex creates shareable URLs by encoding the current JSON into the URL.

### Alternatives considered
- Build a backend sharing API.
- Store shared JSON in a database and generate IDs.
- Require accounts for sharing.
- Encode the JSON directly into the URL.

### Why this was chosen
URL sharing provides a simple stateless sharing mechanism without adding a backend, authentication, or database.

### Cost / trade-off
The JSON becomes part of the URL, so very large payloads are not suitable for this approach. Shared URLs can also expose the encoded data through browser history or wherever the URL is shared.

There is no server-side expiration, access control, or permission system.

## Decision 7 — Limit graph editing to primitive values

### Decision
Graph nodes directly edit primitive values such as strings, numbers, booleans, and null. Objects and arrays can be visualized and collapsed/expanded, but their structure is edited through the JSON editor.

### Alternatives considered
- Allow complete JSON editing from the graph.
- Support adding/removing object properties.
- Support adding/removing array elements.
- Limit graph editing to primitive values.

### Why this was chosen
Full structural editing would significantly increase complexity. It would require handling key creation/removal, key renaming, array operations, type changes, validation, and stable paths after structural changes.

The JSON editor already provides a natural place for structural editing, while the graph is useful for understanding structure and making small value changes.

### Cost / trade-off
Users cannot perform complete JSON editing directly from the graph and must use the editor for structural changes.

## Summary

These decisions intentionally prioritize a focused, local-first, finishable developer tool over a broader collaborative JSON platform.

The main trade-offs are:

- Local-first means no cloud synchronization.
- Web Workers improve responsiveness but add asynchronous complexity.
- React Flow and Dagre reduce graph implementation work but introduce dependencies.
- Zustand simplifies synchronization but adds global state management.
- IndexedDB improves persistence but is more complex than `localStorage`.
- URL sharing avoids backend infrastructure but is not ideal for very large or sensitive payloads.
- Primitive-only graph editing keeps the graph manageable but leaves structural editing to the JSON editor.
