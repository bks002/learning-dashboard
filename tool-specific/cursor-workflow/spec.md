# Cursor — Specification

## Problem statement

Track learning goals and project tasks with ownership, priorities, due dates, and progress visibility through a dashboard and task management UI.

## Users

Seeded users only (no user CRUD UI). Roles: Admin, Member (Stretch RBAC).

## Core capabilities

1. Dashboard — 5 count cards from real data
2. Task list — with status filter and keyword search
3. Create / read / update tasks
4. Status actions — mark in progress, completed
5. Validation — client + server
6. UI states — loading, empty, success, error on all data views
7. Persistence — SQLite, survives restart
8. Tests — integration + component

## Stretch capabilities (implemented)

- JWT login + protected routes
- Activity audit log per task
- Pagination, priority filter, sort
- Docker + GitHub Actions CI
- AI prompt templates
- Responsive / a11y UI polish

## Out of scope

- User registration / password reset
- Multi-tenant companies
- Email notifications
- Mobile native app

## Acceptance

12/12 Core criteria — see [acceptance-criteria.md](../../acceptance-criteria.md).
