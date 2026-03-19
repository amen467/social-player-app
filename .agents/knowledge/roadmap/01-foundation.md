# Slice 0 — Foundation

## Goal

Establish a deployable, production-ready base.

## Features

- Next.js App Router setup
- Auth (OAuth → magic links later)
- Prisma + PostgreSQL
- Redis (minimal usage)
- S3 + CloudFront
- Logging + error tracking
- Rate limiting + CSP
- CI/CD pipeline

## Core Models

- User
- Session
- AuditLog
- UserSettings
- NotificationPreference

## Definition of Done

- User can sign up/sign in
- App deploys successfully
- Errors are traceable