# Feature Board

A small portfolio demo of a feature-request workspace. Built with browser JavaScript, CSS and a Node.js HTTP API. This is sample work, not a previous client project.

## Run locally

Requires Node.js 22 or newer. No dependencies or install step needed.

```sh
npm start
```

Open http://127.0.0.1:3000. Run `npm test` for API integration tests.

## Scope

- Responsive board grouped by status
- Six fictional requests across three applications
- Read-only JSON API at `/api/requests`
- Loading and failure states; text rendered without HTML injection

Data is in memory. There is no authentication, persistence or editing. This is not a production task-management service.

## Review workflow

The sample feature branch adds search and status filtering. Its PR documents behavior and verification. AI-assisted sample prepared with ChatGPT/Codex; no claim of Claude Code usage.
