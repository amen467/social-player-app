# Product Roadmap Overview

## Agent Instructions

When implementing features:
1. Follow slice order strictly
2. Do not skip slices
3. Complete Definition of Done before moving on
4. Prefer simplicity over optimization
5. Avoid introducing realtime unless specified

## Product Strategy

Build the app in the following progression:

player → library → playlists → profiles → posts/feed → notifications → chat

### Core Principle

Build a **YouTube-powered personal player first**, then evolve into a **social platform**.

### Key Risks

1. YouTube integration constraints
2. Social graph complexity
3. Realtime over-engineering
4. Moderation and abuse handling

---

## Development Philosophy

Each slice must be:

- Fully functional
- Deployable to production
- Observable (logs, metrics)
- Secure (auth, rate limits, audit logs)
- Independently testable

---

## Engineering Order (per slice)

1. Schema
2. Backend services
3. API routes / server actions
4. UI
5. Observability
6. Security review
7. Tests
8. Feature flag rollout