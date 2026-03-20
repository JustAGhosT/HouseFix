# Agent Backlog — HouseFix AI BOM Assistant

> Backlog for tracking work items across the HouseFix AI BOM Assistant project.
> Single source of truth for task status.

---

## Table of Contents

1. [Active Sprint](#active-sprint)
2. [Backlog](#backlog)
3. [Completed](#completed)
4. [Priority Definitions](#priority-definitions)
5. [Status Definitions](#status-definitions)

---

## Active Sprint

| Priority | Team              | Task                                          | Phase          | Status | Notes                                 |
| -------- | ----------------- | --------------------------------------------- | -------------- | ------ | ------------------------------------- |
| P0       | T1-Backend        | Set up Express + TypeScript project structure | Implementation | Todo   | `src/server.ts` entry point           |
| P0       | T3-Data           | Implement Drizzle ORM schema + SQLite setup   | Implementation | Todo   | See `docs/02_specs/04_data_models.md` |
| P0       | T3-Data           | Create seed script from `products.json`       | Implementation | Todo   | Load 15 products + 1 store            |
| P1       | T1-Backend        | Implement product catalog API endpoints       | Implementation | Todo   | GET /products, search, filter         |
| P1       | T1-Backend        | Implement BOM calculation engine              | Implementation | Todo   | Paint calculations first              |
| P1       | T4-Infrastructure | Set up CI pipeline (GitHub Actions)           | Implementation | Todo   | Lint + test + build                   |
| P2       | T6-Integration    | Build Cashbuild price scraper (Playwright)    | Planning       | Todo   | cashbuild.co.za product pages         |
| P2       | T2-Frontend       | Scaffold React + Vite frontend                | Planning       | Todo   | Interactive BOM artifact              |
| P2       | T8-DevEx          | Configure ESLint + TypeScript strict mode     | Implementation | Todo   | Extend existing prettier              |

---

## Backlog

Items not yet scheduled for the active sprint.

| Priority | Team             | Task                                         | Phase          | Status | Notes                                |
| -------- | ---------------- | -------------------------------------------- | -------------- | ------ | ------------------------------------ |
| P0       | T6-Integration   | Integrate Claude API with tool-use           | Planning       | Todo   | search_products, calculate_bom tools |
| P1       | T1-Backend       | Implement health check endpoint              | Implementation | Todo   | `GET /api/v1/health`                 |
| P1       | T1-Backend       | Add BOM calculation for tiling projects      | Implementation | Todo   | After paint engine works             |
| P1       | T1-Backend       | Add BOM calculation for electrical projects  | Implementation | Todo   | DB board + breaker sizing            |
| P1       | T2-Frontend      | Build BOM table component (3-section)        | Implementation | Todo   | Materials, Tools, Labour             |
| P1       | T2-Frontend      | Build slider inputs for area/coats/workers   | Implementation | Todo   | Live-updating calculations           |
| P1       | T2-Frontend      | Build chat interface component               | Implementation | Todo   | Conversation with Claude             |
| P2       | T3-Data          | Add price history tracking                   | Implementation | Todo   | Detect changes from scraper          |
| P2       | T6-Integration   | Add builders.co.za as second scrape source   | Planning       | Todo   | Price comparison data                |
| P2       | T2-Frontend      | Build cost summary cards                     | Implementation | Todo   | Materials/Tools/Labour/Total         |
| P2       | T2-Frontend      | Build color swatch preview                   | Implementation | Todo   | Paint color visualization            |
| P2       | T1-Backend       | Shopping list export (PDF)                   | Planning       | Todo   | Aggregated from BOMs                 |
| P2       | T10-Quality      | Write E2E tests with Playwright              | Planning       | Todo   | Critical user flows                  |
| P3       | T6-Integration   | Approach Cashbuild for PrestaShop API access | Discovery      | Todo   | B2B partnership                      |
| P3       | T6-Integration   | Evaluate GoBuild360 BOM API partnership      | Discovery      | Todo   | gobuildbom.io                        |
| P3       | T7-Documentation | Create API documentation (OpenAPI/Swagger)   | Planning       | Todo   | From api_spec.md                     |
| P3       | T5-Auth          | Implement JWT auth for saved projects        | Planning       | Todo   | Phase 2 feature                      |
| P3       | T9-Platform      | Add multi-store price comparison             | Planning       | Todo   | Phase 3 feature                      |

---

## Completed

| Priority | Team             | Task                                      | Phase | Completed | Notes                              |
| -------- | ---------------- | ----------------------------------------- | ----- | --------- | ---------------------------------- |
| P0       | T9-Platform      | Validate BOM concept through conversation | Ship  | Sprint 0  | Paint + electrical + waterproofing |
| P0       | T7-Documentation | Document exterior paint colors plan       | Ship  | Sprint 0  | `exterior-paint-colors.md`         |
| P0       | T7-Documentation | Document electrical DB board spec         | Ship  | Sprint 0  | `electrical-distribution-board.md` |
| P0       | T7-Documentation | Create materials shopping list            | Ship  | Sprint 0  | R4,118.05 total                    |
| P0       | T7-Documentation | Write AI BOM Assistant PRD                | Ship  | Sprint 0  | `ai-bom-assistant.md`              |
| P0       | T6-Integration   | Research API integration options          | Ship  | Sprint 1  | 6 options documented               |
| P1       | T3-Data          | Seed product catalog from Cashbuild       | Ship  | Sprint 1  | `products.json` — 15 products      |
| P1       | T8-DevEx         | Configure Prettier                        | Ship  | Sprint 1  | Fixed .prettierrc                  |
| P0       | T7-Documentation | Write roadmap                             | Ship  | Sprint 1  | 3-phase plan                       |
| P0       | T7-Documentation | Write architecture overview               | Ship  | Sprint 1  | System context + components        |
| P0       | T7-Documentation | Write technical specification             | Ship  | Sprint 1  | Stack + component design           |
| P0       | T7-Documentation | Write data models spec                    | Ship  | Sprint 1  | 7 models + Drizzle schema          |
| P0       | T7-Documentation | Write API specification                   | Ship  | Sprint 1  | Endpoints + examples               |

---

## Priority Definitions

| Priority | Label    | Definition                                                  | SLA           |
| -------- | -------- | ----------------------------------------------------------- | ------------- |
| P0       | Critical | Blocks all other work or affects production stability       | Same day      |
| P1       | High     | Required for current milestone; has downstream dependencies | Within sprint |
| P2       | Medium   | Important but not blocking; can be deferred one sprint      | Next sprint   |
| P3       | Low      | Nice to have; backlog filler; exploratory                   | Best effort   |

---

## Status Definitions

| Status      | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| Todo        | Not yet started; waiting for sprint allocation or dependencies |
| In Progress | Actively being worked on by the assigned team                  |
| Done        | Completed and passed quality gates for the current phase       |
| Blocked     | Cannot proceed; waiting on an external dependency              |

### Phase Progression

```text
Discovery -> Planning -> Implementation -> Validation -> Ship
```

---

## Cross-Team Dependencies

| Upstream Team           | Downstream Team | Dependency Description                   | Status   |
| ----------------------- | --------------- | ---------------------------------------- | -------- |
| T3-Data                 | T1-Backend      | Drizzle schema for product queries       | Pending  |
| T1-Backend              | T2-Frontend     | API contract for product + BOM endpoints | Pending  |
| T1-Backend              | T6-Integration  | Product upsert interface for scraper     | Pending  |
| T6-Integration (Claude) | T2-Frontend     | Artifact HTML format for rendering       | Pending  |
| T8-DevEx                | All Teams       | Linting + formatting configuration       | Resolved |
