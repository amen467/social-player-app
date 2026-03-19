# Architecture Guidelines

## Domain Separation

Organize by domain:

- auth
- media
- player
- library
- social-graph
- feed
- notifications
- chat
- search
- moderation

## Background Jobs

Use queues for:

- notifications
- stats aggregation
- feed fanout
- cache invalidation

## Realtime Scope

Allowed:

- notifications
- presence
- chat

Avoid:

- full app realtime sync
- collaborative playback (initially)

## Moderation

Must include:

- block
- mute
- report
- rate limiting
- audit logs