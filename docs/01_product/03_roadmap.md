# Roadmap — HouseFix AI BOM Assistant

## Overview

This roadmap outlines the planned timeline and milestones for HouseFix, from the current proof-of-concept (conversational BOM via Claude) to a production-ready AI-powered Bill of Materials assistant for South African building material retailers.

---

## Timeline

### Phase 1 — Foundation (Q2 2026)

> Core data layer, API, and basic product catalog. Get a working backend that serves product data and generates BOMs from structured input.

- [x] P0: Validate concept through conversational BOM (paint + electrical + waterproofing)
- [x] P0: Document product specifications (exterior paint, electrical DB board)
- [x] P0: Research API integration options for SA hardware retailers
- [x] P1: Seed product catalog from Cashbuild cart data (`src/catalog/products.json`)
- [ ] P0: Set up Node.js/TypeScript project with Express API server
- [ ] P0: Implement product catalog API (`GET /api/products`, search, filter by category)
- [ ] P1: Implement BOM calculation engine (coverage rates, quantities, pricing)
- [ ] P1: Define data models (Product, Project, BOMItem, ShoppingList)
- [ ] P1: Set up SQLite database with Drizzle ORM migrations
- [ ] P2: Add store model with delivery zones and pricing
- [ ] P2: Set up CI pipeline (GitHub Actions — lint, test, build)
- [ ] P3: Write API documentation (OpenAPI/Swagger)

**Milestone:** API serves product catalog and calculates BOMs from structured input (area, project type, preferences).

### Phase 2 — Intelligence (Q3 2026)

> Add Claude AI integration for conversational BOM generation. Build the web scraper for live pricing. Create the interactive frontend.

- [ ] P0: Integrate Claude API for conversational project intake
- [ ] P0: Build tool-use functions for product lookup, BOM calculation, price totalling
- [ ] P0: Implement web scraper for cashbuild.co.za product pages (Playwright)
- [ ] P1: Build React frontend with interactive BOM artifact (sliders, live cost updates)
- [ ] P1: Implement "show me" artifact rendering (materials table, tools, labour sections)
- [ ] P1: Add price update scheduler (weekly scrape, flag changes)
- [ ] P2: Multi-store support (Cashbuild, Builders Warehouse, Leroy Merlin)
- [ ] P2: Add application guidance engine (sequenced step-by-step instructions)
- [ ] P2: Implement smart tool logic (shared vs per-worker tools)
- [ ] P3: Shopping list export (PDF, shareable link)

**Milestone:** User describes a project in plain language, AI generates an interactive BOM with real Cashbuild prices.

### Phase 3 — Scale (Q4 2026)

> API partnerships, direct ordering, multi-store price comparison, and production hardening.

- [ ] P0: Negotiate Cashbuild PrestaShop API access (B2B key)
- [ ] P0: Or: Negotiate GoBuild360 BOM API partnership
- [ ] P1: Implement real-time pricing via API (replace scraper for partnered stores)
- [ ] P1: Direct cart/order creation through retailer API
- [ ] P1: Stock availability checking per store
- [ ] P2: Multi-store price comparison ("same cart at Cashbuild vs Builders")
- [ ] P2: User accounts — save projects, track price changes, re-order
- [ ] P2: Store-aware inventory (check if items are in stock at your store)
- [ ] P3: Contractor matching (connect with local electricians, painters)
- [ ] P3: Building permit/compliance checking
- [ ] P3: Mobile app (React Native or PWA)

**Milestone:** Users can generate a BOM, compare prices across stores, and order directly from the app.

---

## Release Cadence

| Phase   | Cadence   | Format                              |
| ------- | --------- | ----------------------------------- |
| Phase 1 | Weekly    | Internal dev builds, manual testing |
| Phase 2 | Bi-weekly | Beta releases to test users         |
| Phase 3 | Monthly   | Production releases with changelog  |

---

## Prioritisation Framework

| Priority | Label    | Description                       |
| -------- | -------- | --------------------------------- |
| P0       | Critical | Must ship in current phase        |
| P1       | High     | Should ship in current phase      |
| P2       | Medium   | Nice to have for current phase    |
| P3       | Low      | Future consideration / next phase |

---

## Key Dependencies

| Dependency                  | Phase    | Risk                              | Mitigation                               |
| --------------------------- | -------- | --------------------------------- | ---------------------------------------- |
| Cashbuild API access        | Phase 3  | High — no public API exists       | Web scraping in Phase 2 as fallback      |
| Claude API availability     | Phase 2  | Low — well-documented, stable     | Local fallback with structured forms     |
| Product pricing accuracy    | Phase 1+ | Medium — prices change frequently | Weekly scrape + manual verification      |
| Electrician CoC requirement | Phase 3  | Medium — regulatory               | Disclaimer + contractor referral network |

---

## References

- [PRD](../prd/ai-bom-assistant.md)
- [API Research](../07_integrations/01_external_apis.md)
- [Materials Shopping List](./materials-shopping-list.md)
- [Exterior Paint Colors](./exterior-paint-colors.md)
- [Electrical Distribution Board](./electrical-distribution-board.md)
