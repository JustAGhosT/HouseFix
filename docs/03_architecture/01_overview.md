# Architecture Overview — HouseFix AI BOM Assistant

## Introduction

HouseFix is an AI-powered Bill of Materials assistant that helps South African homeowners plan and cost construction/renovation projects. It replaces the rigid template-based BOM workflow (e.g., Cashbuild's GoBuild360) with a conversational AI experience that generates interactive, priced shopping lists from natural language project descriptions.

---

## Principles

1. **Simplicity** — Start with JSON files and SQLite. Only add complexity when load demands it.
2. **Modularity** — Catalog, BOM engine, AI layer, and scraper are independent services that communicate through well-defined interfaces.
3. **Observability** — Every service exposes health, metrics, and structured logs.
4. **Offline-first data** — The product catalog works without external API access. Live pricing is an enhancement, not a requirement.
5. **South Africa context** — All prices in ZAR, products from SA retailers, compliance with SANS standards where relevant.

---

## System Context Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      User (Browser)                      │
│                                                          │
│  Describes project → Gets interactive BOM → Exports list │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    HouseFix Web App                       │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────────┐ │
│  │ React    │  │ Express  │  │ Claude AI Integration   │ │
│  │ Frontend │◄─┤ API      │◄─┤ (Tool Use)             │ │
│  │          │  │ Server   │  │                        │ │
│  └──────────┘  └────┬─────┘  └───────────┬────────────┘ │
│                     │                     │              │
│               ┌─────▼──────┐    ┌────────▼───────────┐  │
│               │ BOM Engine │    │ Product Catalog     │  │
│               │ (calc +    │◄───┤ (SQLite + Drizzle)  │  │
│               │  pricing)  │    │                     │  │
│               └────────────┘    └────────┬───────────┘  │
│                                          │              │
│                                 ┌────────▼───────────┐  │
│                                 │ Price Scraper      │  │
│                                 │ (Playwright)       │  │
│                                 └────────┬───────────┘  │
└──────────────────────────────────────────┼──────────────┘
                                           │ HTTPS
                         ┌─────────────────▼─────────────────┐
                         │        External Retailers          │
                         │                                    │
                         │  cashbuild.co.za  builders.co.za   │
                         │  leroymerlin.co.za                 │
                         │                                    │
                         │  (Phase 3: PrestaShop API / BOM    │
                         │   API via GoBuild360)              │
                         └────────────────────────────────────┘
```

---

## High-Level Components

| Component              | Responsibility                                                                                 | Technology                          |
| ---------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------- |
| **React Frontend**     | Interactive BOM artifact (sliders, live cost tables, color swatches, export)                   | React 19, Tailwind CSS, Vite        |
| **Express API Server** | REST API for products, BOMs, projects, shopping lists                                          | Node.js 20, Express, TypeScript     |
| **Claude AI Layer**    | Conversational intake, tool-use for product lookup and BOM generation                          | Claude API (Sonnet 4.6+), Tool Use  |
| **BOM Engine**         | Coverage rate calculations, quantity rounding, multi-section output (Materials, Tools, Labour) | TypeScript library (pure functions) |
| **Product Catalog**    | Product data store with search, filtering, and price history                                   | SQLite + Drizzle ORM                |
| **Price Scraper**      | Periodic price updates from retailer websites                                                  | Playwright, node-cron               |
| **Store Service**      | Store locations, delivery zones, stock availability                                            | Part of API server                  |

---

## Communication Patterns

```
User ──HTTP──▶ React Frontend ──HTTP──▶ Express API
                                           │
                              ┌─────────────┼──────────────┐
                              ▼             ▼              ▼
                        Claude API    BOM Engine    Product Catalog
                        (external)    (in-process)  (SQLite queries)
                              │
                              ▼
                        Tool-use callbacks
                        (product lookup, BOM calc)
```

- **Frontend ↔ API:** REST over HTTPS (JSON)
- **API → Claude:** Anthropic SDK with tool-use (product_search, calculate_bom, get_price)
- **API → Catalog:** Direct SQLite queries via Drizzle ORM (in-process, no network)
- **Scraper → Catalog:** Batch write via Drizzle (scheduled cron job)
- **API → External retailers:** HTTPS (Phase 3 — PrestaShop REST API)

---

## Data Storage

| Store           | Technology       | Purpose                                 | Size Estimate |
| --------------- | ---------------- | --------------------------------------- | ------------- |
| Product Catalog | SQLite           | Products, prices, categories, stores    | < 50 MB       |
| Price History   | SQLite (same DB) | Track price changes over time           | < 100 MB      |
| User Projects   | SQLite (same DB) | Saved BOMs, shopping lists, preferences | < 10 MB       |
| Session State   | In-memory        | Active conversation context             | Ephemeral     |
| Scraper Cache   | File system      | Raw HTML pages for debugging/replay     | < 500 MB      |

**Why SQLite?** Single-file database, zero configuration, perfect for a single-server app with < 1000 concurrent users. Upgrade path to PostgreSQL exists via Drizzle's dialect switching if needed.

---

## Infrastructure

| Concern    | Choice                                   | Rationale                                   |
| ---------- | ---------------------------------------- | ------------------------------------------- |
| Hosting    | Single VPS (Hetzner ZA or AWS Cape Town) | Low cost, SA data residency, < 50ms latency |
| Container  | Docker + Docker Compose                  | Simple deployment, reproducible builds      |
| CI/CD      | GitHub Actions                           | Free for public repos, good ecosystem       |
| CDN        | Cloudflare (free tier)                   | SSL termination, DDoS protection, caching   |
| Monitoring | Structured JSON logs + Sentry            | Error tracking, basic APM                   |
| Secrets    | `.env` files (dev), GitHub Secrets (CI)  | Standard Node.js pattern                    |

---

## Decision Records

Architecture Decision Records (ADRs) are stored in [03_decisions/](./03_decisions/).

| ADR                                                     | Title                                          | Status   |
| ------------------------------------------------------- | ---------------------------------------------- | -------- |
| [ADR-0001](./03_decisions/0001-adopt-agentkit-forge.md) | Adopt AgentKit Forge for project orchestration | Accepted |
| ADR-0002                                                | Use SQLite + Drizzle ORM for data persistence  | Proposed |
| ADR-0003                                                | Use Claude tool-use for AI BOM generation      | Proposed |
| ADR-0004                                                | Playwright for price scraping over Cheerio     | Proposed |

---

## References

- [Technical Spec](../02_specs/02_technical_spec.md)
- [Data Models](../02_specs/04_data_models.md)
- [API Spec](../02_specs/03_api_spec.md)
- [PRD](../prd/ai-bom-assistant.md)
- [Deployment Guide](../05_operations/01_deployment.md)
