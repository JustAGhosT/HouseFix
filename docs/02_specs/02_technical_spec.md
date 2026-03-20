# Technical Specification — HouseFix AI BOM Assistant

## Overview

Technical specification for the HouseFix AI BOM Assistant — a conversational AI system that generates interactive, priced Bills of Materials for South African homeowners using Claude and real retailer product data.

**Project:** HouseFix AI BOM Assistant
**Version:** 0.2.0

---

## System Context

HouseFix sits between the homeowner and South African hardware retailers (primarily Cashbuild). It replaces the manual process of browsing store websites, running BOM calculators, and building shopping lists — combining all of this into a single AI-powered conversation.

```
Homeowner ──▶ HouseFix AI ──▶ Cashbuild / Builders / Leroy Merlin
             (describes       (product catalog,
              project)         pricing, ordering)
```

---

## Technology Stack

| Layer         | Technology               | Rationale                                                       |
| ------------- | ------------------------ | --------------------------------------------------------------- |
| Language      | TypeScript 5.x           | Type safety, shared types between frontend and backend          |
| Runtime       | Node.js 20 LTS           | Stable LTS, native fetch, good performance                      |
| API Framework | Express 5                | Mature, minimal, large ecosystem                                |
| Database      | SQLite 3                 | Zero-config, single-file, perfect for single-server             |
| ORM           | Drizzle                  | Type-safe, SQL-like API, supports SQLite → PostgreSQL migration |
| AI            | Claude API (Sonnet 4.6+) | Tool-use for structured product lookups, best reasoning         |
| Frontend      | React 19 + Vite          | Fast dev experience, artifact rendering                         |
| Styling       | Tailwind CSS 4           | Rapid UI development, responsive design                         |
| Scraper       | Playwright               | Handles JavaScript-rendered pages (PrestaShop)                  |
| Testing       | Vitest + Playwright      | Unit + E2E, fast, TypeScript-native                             |
| Linting       | ESLint + Prettier        | Already configured in project                                   |

---

## Component Design

### Component A: Product Catalog Service

**Purpose:** CRUD operations on building material products with search, filtering, and price history tracking.

**Responsibilities:**

- Store and retrieve products with categories, prices, and specifications
- Full-text search across product names and descriptions
- Filter by category, subcategory, price range, store
- Track price history (date, old price, new price, source)
- Bulk import from scraper results

**Interface:**

```typescript
interface ProductService {
  search(query: string, filters?: ProductFilters): Promise<Product[]>;
  getById(id: number): Promise<Product | null>;
  getByCategory(category: string): Promise<Product[]>;
  upsert(product: ProductInput): Promise<Product>;
  bulkUpsert(products: ProductInput[]): Promise<number>;
  getPriceHistory(productId: number): Promise<PriceChange[]>;
}
```

### Component B: BOM Calculation Engine

**Purpose:** Pure-function library that calculates material quantities, tool requirements, and costs from project parameters.

**Responsibilities:**

- Calculate paint quantities from wall area, coverage rate, and number of coats
- Calculate tile quantities from area, tile size, and waste allowance
- Determine tool requirements (shared vs per-worker)
- Sequence application steps (prep → prime → coat → finish)
- Generate three-section output (Materials, Tools, Labour)

**Interface:**

```typescript
interface BOMEngine {
  calculatePaint(params: PaintParams): BOMSection;
  calculateTiling(params: TilingParams): BOMSection;
  calculateWaterproofing(params: WaterproofParams): BOMSection;
  calculateElectrical(params: ElectricalParams): BOMSection;
  generateBOM(sections: BOMSection[]): BillOfMaterials;
  getApplicationOrder(projectType: ProjectType): Step[];
}

interface PaintParams {
  wallAreaM2: number;
  ceilingAreaM2: number;
  coats: number;
  surfaceType: 'new_plaster' | 'repaint' | 'face_brick';
  includeWaterproofing: boolean;
  workers: number;
}
```

### Component C: Claude AI Integration

**Purpose:** Conversational interface that uses Claude's tool-use capability to translate natural language project descriptions into structured BOM parameters.

**Responsibilities:**

- Accept natural language project descriptions
- Ask clarifying questions (measurements, surface types, preferences)
- Call tool functions for product lookup and BOM calculation
- Generate interactive artifact HTML (sliders, tables, cost breakdowns)
- Support iterative refinement ("swap the grey for white")

**Tool definitions for Claude:**

```typescript
const tools = [
  {
    name: 'search_products',
    description: 'Search the product catalog by name, category, or specification',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        category: {
          type: 'string',
          enum: ['paint', 'electrical', 'waterproofing', 'preparation', 'plumbing', 'tiling'],
        },
        maxResults: { type: 'number', default: 10 },
      },
      required: ['query'],
    },
  },
  {
    name: 'calculate_bom',
    description: 'Calculate a Bill of Materials for a specific project type',
    input_schema: {
      type: 'object',
      properties: {
        projectType: { type: 'string', enum: ['paint', 'tiling', 'waterproofing', 'electrical'] },
        areaM2: { type: 'number' },
        coats: { type: 'number', default: 2 },
        workers: { type: 'number', default: 1 },
      },
      required: ['projectType', 'areaM2'],
    },
  },
  {
    name: 'get_store_info',
    description: 'Get store details including delivery cost and location',
    input_schema: {
      type: 'object',
      properties: {
        storeId: { type: 'number' },
      },
    },
  },
];
```

### Component D: Price Scraper

**Purpose:** Automated price collection from retailer websites to keep the product catalog current.

**Responsibilities:**

- Navigate cashbuild.co.za category and product pages
- Extract product name, price, availability, SKU
- Detect price changes and flag them
- Store raw HTML for debugging/replay
- Respect robots.txt and rate limits

**Interface:**

```typescript
interface PriceScraper {
  scrapeCategory(url: string): Promise<ScrapedProduct[]>;
  scrapeProduct(url: string): Promise<ScrapedProduct>;
  runFullScrape(): Promise<ScrapeResult>;
  getLastScrapeResult(): Promise<ScrapeResult>;
}
```

---

## Data Flow

### Primary Flow: Conversational BOM Generation

```
1. User: "I need to paint my exterior walls and fix a leaky roof"
                    │
2. Express API receives message, forwards to Claude API
                    │
3. Claude asks clarifying questions:
   - "What's the approximate wall area?"
   - "New plaster or repainting?"
   - "Which Cashbuild store?"
                    │
4. User provides details: "About 80m², repainting, Kwa Thema"
                    │
5. Claude calls tools:
   ├─ search_products("PVA paint 20L")     → [Mackay PVA, Champion PVA, ...]
   ├─ search_products("waterproofing roof") → [Powacoat, Flexikote, ...]
   ├─ calculate_bom({type: "paint", area: 80, coats: 2})
   └─ get_store_info({storeId: 1})
                    │
6. Claude generates interactive artifact HTML:
   ├─ Sliders for area, coats, workers
   ├─ Materials table with quantities and prices
   ├─ Application order checklist
   └─ Grand total with delivery
                    │
7. Frontend renders artifact, user adjusts sliders
                    │
8. User: "Export as PDF" → shopping list generated
```

### Secondary Flow: Price Update

```
1. Cron job triggers scraper (weekly)
                    │
2. Playwright navigates cashbuild.co.za categories
                    │
3. Extract product data (name, price, availability)
                    │
4. Compare with existing catalog prices
                    │
5. Update catalog, log price changes
                    │
6. Flag significant changes (>10%) for review
```

---

## Security Considerations

- **API key management:** Claude API key and any retailer API keys stored in environment variables, never committed to repo
- **Input sanitization:** All user input sanitized before passing to Claude or database queries
- **Rate limiting:** Express rate-limit middleware (100 req/min per IP)
- **CORS:** Restrict to known frontend origins
- **No user auth (Phase 1):** Shopping lists are session-based, no PII stored
- **Phase 2+:** JWT authentication for saved projects, bcrypt for passwords
- **Scraper ethics:** Respect robots.txt, rate limit requests (1 req/sec), identify via User-Agent

---

## Performance Targets

| Metric                       | Target       | Measurement            |
| ---------------------------- | ------------ | ---------------------- |
| Product search response time | < 50ms       | SQLite FTS query time  |
| BOM calculation time         | < 100ms      | Engine processing time |
| Claude response time         | < 5s         | Time to first token    |
| Artifact render time         | < 200ms      | React mount + hydrate  |
| Scraper throughput           | 10 pages/min | Playwright page loads  |
| Database size (1 year)       | < 100 MB     | SQLite file size       |

---

## Directory Structure

```
HouseFix/
├── docs/                       # Documentation (existing)
│   ├── 01_product/             # Product specs, roadmap, shopping lists
│   ├── 02_specs/               # Technical and API specs
│   ├── 03_architecture/        # Architecture, diagrams, ADRs
│   ├── 04_api/                 # API reference
│   ├── 05_operations/          # Deployment, monitoring
│   ├── 06_engineering/         # Setup, standards, testing
│   ├── 07_integrations/        # External API research
│   ├── 08_reference/           # Glossary, FAQ
│   └── prd/                    # Product requirements
├── src/
│   ├── catalog/                # Product catalog (existing: products.json)
│   │   ├── products.json       # Seed data
│   │   ├── schema.ts           # Drizzle schema definitions
│   │   └── service.ts          # ProductService implementation
│   ├── bom/                    # BOM calculation engine
│   │   ├── engine.ts           # Core calculation functions
│   │   ├── paint.ts            # Paint-specific calculations
│   │   ├── tiling.ts           # Tiling-specific calculations
│   │   ├── electrical.ts       # Electrical calculations
│   │   └── types.ts            # Shared BOM types
│   ├── ai/                     # Claude AI integration
│   │   ├── client.ts           # Anthropic SDK client
│   │   ├── tools.ts            # Tool definitions
│   │   └── conversation.ts     # Conversation management
│   ├── scraper/                # Price scraper
│   │   ├── cashbuild.ts        # Cashbuild-specific scraper
│   │   ├── scheduler.ts        # Cron scheduling
│   │   └── parser.ts           # HTML → product data extraction
│   ├── api/                    # Express API routes
│   │   ├── products.ts         # Product endpoints
│   │   ├── bom.ts              # BOM endpoints
│   │   ├── chat.ts             # AI chat endpoint
│   │   └── health.ts           # Health check
│   ├── db/                     # Database
│   │   ├── index.ts            # Database connection
│   │   └── migrations/         # Drizzle migrations
│   └── server.ts               # Express app entry point
├── web/                        # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── BOMTable.tsx     # Three-section BOM display
│   │   │   ├── Slider.tsx       # Input sliders
│   │   │   ├── CostSummary.tsx  # Grand total cards
│   │   │   └── ChatInterface.tsx # Conversation UI
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── vite.config.ts
├── package.json
├── tsconfig.json
├── drizzle.config.ts
├── .prettierrc
└── .env.example
```

---

## References

- [Architecture Overview](../03_architecture/01_overview.md)
- [Functional Spec](./01_functional_spec.md)
- [Data Models](./04_data_models.md)
- [PRD](../prd/ai-bom-assistant.md)
