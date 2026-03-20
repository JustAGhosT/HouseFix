# Data Models — HouseFix AI BOM Assistant

## Overview

Data models for the HouseFix product catalog, BOM engine, and project management. All models use SQLite with Drizzle ORM. IDs are auto-incrementing integers (SQLite default). Timestamps are ISO 8601 strings.

---

## Entity Relationship Summary

```
Store ──1:N──▶ Product ──1:N──▶ PriceHistory
                  │
                  ▼
Product ──N:M──▶ BOMItem ◀──N:1── BillOfMaterials
                                        │
                                        ▼
                              BillOfMaterials ──N:1──▶ Project
                                                          │
                                                          ▼
                                                Project ──N:1──▶ ShoppingList
```

---

## Models

### Model: Product

The core product entity. Seeded from `src/catalog/products.json`, updated by the price scraper.

| Field         | Type      | Required | Description                                                                          |
| ------------- | --------- | -------- | ------------------------------------------------------------------------------------ |
| `id`          | `INTEGER` | Yes      | Primary key, auto-increment                                                          |
| `name`        | `TEXT`    | Yes      | Product name (e.g., "Champion Extra Thick PVA 20L Winters Grey")                     |
| `category`    | `TEXT`    | Yes      | Top-level category (paint, electrical, waterproofing, preparation, plumbing, tiling) |
| `subcategory` | `TEXT`    | No       | Sub-category (e.g., pva, enamel, breaker, protection)                                |
| `price`       | `REAL`    | Yes      | Current price in ZAR (VAT inclusive)                                                 |
| `unit`        | `TEXT`    | Yes      | Pricing unit (each, per_m2, per_kg)                                                  |
| `volume`      | `TEXT`    | No       | Product volume/size (e.g., "20L", "5L", "40KG")                                      |
| `coverage`    | `TEXT`    | No       | What the product is used for / coverage description                                  |
| `specs`       | `TEXT`    | No       | Technical specifications (e.g., "63A, 30mA, DIN rail")                               |
| `sku`         | `TEXT`    | No       | Retailer SKU code                                                                    |
| `store_id`    | `INTEGER` | Yes      | Foreign key → Store                                                                  |
| `in_stock`    | `INTEGER` | Yes      | Boolean (0/1) — is the product available                                             |
| `source_url`  | `TEXT`    | No       | URL where price was scraped from                                                     |
| `created_at`  | `TEXT`    | Yes      | ISO 8601 timestamp                                                                   |
| `updated_at`  | `TEXT`    | Yes      | ISO 8601 timestamp                                                                   |

#### Indexes

| Name                   | Columns       | Unique               |
| ---------------------- | ------------- | -------------------- |
| `idx_product_category` | `category`    | No                   |
| `idx_product_name_fts` | `name` (FTS5) | No                   |
| `idx_product_store`    | `store_id`    | No                   |
| `idx_product_sku`      | `sku`         | Yes (where not null) |

#### Relationships

- **Belongs to** Store via `store_id`
- **Has many** PriceHistory via `product_id`
- **Has many** BOMItem via `product_id`

---

### Model: Store

Retailer store locations with delivery information.

| Field           | Type      | Required | Description                                        |
| --------------- | --------- | -------- | -------------------------------------------------- |
| `id`            | `INTEGER` | Yes      | Primary key, auto-increment                        |
| `name`          | `TEXT`    | Yes      | Store name (e.g., "Cashbuild Kwa Thema")           |
| `retailer`      | `TEXT`    | Yes      | Retailer brand (Cashbuild, Builders, Leroy Merlin) |
| `address`       | `TEXT`    | Yes      | Full street address                                |
| `city`          | `TEXT`    | Yes      | City/town                                          |
| `province`      | `TEXT`    | Yes      | Province (Gauteng, Western Cape, etc.)             |
| `delivery_cost` | `REAL`    | No       | Standard delivery fee in ZAR                       |
| `website_url`   | `TEXT`    | No       | Store page URL                                     |
| `created_at`    | `TEXT`    | Yes      | ISO 8601 timestamp                                 |

#### Relationships

- **Has many** Product via `store_id`

---

### Model: PriceHistory

Tracks price changes over time for each product.

| Field         | Type      | Required | Description                                        |
| ------------- | --------- | -------- | -------------------------------------------------- |
| `id`          | `INTEGER` | Yes      | Primary key, auto-increment                        |
| `product_id`  | `INTEGER` | Yes      | Foreign key → Product                              |
| `old_price`   | `REAL`    | Yes      | Previous price in ZAR                              |
| `new_price`   | `REAL`    | Yes      | Updated price in ZAR                               |
| `change_pct`  | `REAL`    | Yes      | Percentage change ((new-old)/old × 100)            |
| `source`      | `TEXT`    | Yes      | How the change was detected (scraper, manual, api) |
| `detected_at` | `TEXT`    | Yes      | ISO 8601 timestamp                                 |

#### Indexes

| Name                 | Columns       | Unique |
| -------------------- | ------------- | ------ |
| `idx_price_product`  | `product_id`  | No     |
| `idx_price_detected` | `detected_at` | No     |

#### Relationships

- **Belongs to** Product via `product_id`

---

### Model: Project

A user's renovation/construction project containing one or more BOMs.

| Field         | Type      | Required | Description                                           |
| ------------- | --------- | -------- | ----------------------------------------------------- |
| `id`          | `INTEGER` | Yes      | Primary key, auto-increment                           |
| `name`        | `TEXT`    | Yes      | Project name (e.g., "House exterior + bathroom reno") |
| `description` | `TEXT`    | No       | Natural language project description                  |
| `store_id`    | `INTEGER` | No       | Preferred store for this project                      |
| `status`      | `TEXT`    | Yes      | draft, active, completed                              |
| `created_at`  | `TEXT`    | Yes      | ISO 8601 timestamp                                    |
| `updated_at`  | `TEXT`    | Yes      | ISO 8601 timestamp                                    |

#### Relationships

- **Has many** BillOfMaterials via `project_id`
- **Has one** ShoppingList via `project_id`

---

### Model: BillOfMaterials

A calculated BOM for a specific project scope (e.g., "exterior painting" or "bathroom tiling").

| Field             | Type      | Required | Description                                                      |
| ----------------- | --------- | -------- | ---------------------------------------------------------------- |
| `id`              | `INTEGER` | Yes      | Primary key, auto-increment                                      |
| `project_id`      | `INTEGER` | Yes      | Foreign key → Project                                            |
| `scope`           | `TEXT`    | Yes      | What this BOM covers (e.g., "exterior_paint", "bathroom_tiling") |
| `project_type`    | `TEXT`    | Yes      | paint, tiling, waterproofing, electrical                         |
| `parameters`      | `TEXT`    | Yes      | JSON string of input parameters (area, coats, workers, etc.)     |
| `materials_total` | `REAL`    | Yes      | Materials subtotal in ZAR                                        |
| `tools_total`     | `REAL`    | Yes      | Tools subtotal in ZAR                                            |
| `labour_total`    | `REAL`    | Yes      | Labour subtotal in ZAR                                           |
| `grand_total`     | `REAL`    | Yes      | Sum of all sections                                              |
| `created_at`      | `TEXT`    | Yes      | ISO 8601 timestamp                                               |

#### Relationships

- **Belongs to** Project via `project_id`
- **Has many** BOMItem via `bom_id`

---

### Model: BOMItem

A single line item in a Bill of Materials.

| Field        | Type      | Required | Description                                                  |
| ------------ | --------- | -------- | ------------------------------------------------------------ |
| `id`         | `INTEGER` | Yes      | Primary key, auto-increment                                  |
| `bom_id`     | `INTEGER` | Yes      | Foreign key → BillOfMaterials                                |
| `product_id` | `INTEGER` | No       | Foreign key → Product (null for labour items)                |
| `section`    | `TEXT`    | Yes      | materials, tools, labour                                     |
| `name`       | `TEXT`    | Yes      | Display name                                                 |
| `quantity`   | `REAL`    | Yes      | Calculated quantity needed                                   |
| `unit_price` | `REAL`    | Yes      | Price per unit at time of calculation                        |
| `line_total` | `REAL`    | Yes      | quantity × unit_price                                        |
| `is_shared`  | `INTEGER` | Yes      | Boolean — is this a shared tool (1) or per-worker (0)        |
| `notes`      | `TEXT`    | No       | Calculation notes (e.g., "80m² ÷ 10 m²/L = 8L → 1× 20L tub") |

#### Relationships

- **Belongs to** BillOfMaterials via `bom_id`
- **Belongs to** Product via `product_id` (optional)

---

### Model: ShoppingList

The final aggregated shopping list for a project — combines all BOMs, deduplicates products, totals quantities.

| Field           | Type      | Required | Description                                 |
| --------------- | --------- | -------- | ------------------------------------------- |
| `id`            | `INTEGER` | Yes      | Primary key, auto-increment                 |
| `project_id`    | `INTEGER` | Yes      | Foreign key → Project                       |
| `store_id`      | `INTEGER` | Yes      | Foreign key → Store                         |
| `items_total`   | `REAL`    | Yes      | Sum of all items                            |
| `delivery_cost` | `REAL`    | Yes      | Delivery fee                                |
| `grand_total`   | `REAL`    | Yes      | items_total + delivery_cost                 |
| `exported_at`   | `TEXT`    | No       | When the list was last exported (PDF, link) |
| `created_at`    | `TEXT`    | Yes      | ISO 8601 timestamp                          |
| `updated_at`    | `TEXT`    | Yes      | ISO 8601 timestamp                          |

#### Relationships

- **Belongs to** Project via `project_id`
- **Belongs to** Store via `store_id`

---

## Coverage Rate Constants

These constants power the BOM engine's quantity calculations.

| Product Type             | Coverage Rate | Unit      | Source                       |
| ------------------------ | ------------- | --------- | ---------------------------- |
| PVA paint (first coat)   | 8-10 m²/L     | per litre | Manufacturer spec            |
| PVA paint (top coat)     | 10-12 m²/L    | per litre | Manufacturer spec            |
| Enamel paint             | 12-14 m²/L    | per litre | Manufacturer spec            |
| Flexikote waterproofing  | 1.5-2.0 m²/L  | per litre | Manufacturer spec            |
| Tile adhesive (20kg bag) | 4-5 m²/bag    | per bag   | 3-4mm notched trowel         |
| Tile grout (5kg bag)     | 8-12 m²/bag   | per bag   | Depends on tile size and gap |
| Rhinolite plaster (40kg) | 2-3 m²/bag    | per bag   | 10mm thickness               |

---

## Drizzle Schema (TypeScript)

```typescript
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const stores = sqliteTable('stores', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  retailer: text('retailer').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  province: text('province').notNull(),
  deliveryCost: real('delivery_cost'),
  websiteUrl: text('website_url'),
  createdAt: text('created_at').notNull(),
});

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  category: text('category').notNull(),
  subcategory: text('subcategory'),
  price: real('price').notNull(),
  unit: text('unit').notNull(),
  volume: text('volume'),
  coverage: text('coverage'),
  specs: text('specs'),
  sku: text('sku'),
  storeId: integer('store_id')
    .notNull()
    .references(() => stores.id),
  inStock: integer('in_stock').notNull().default(1),
  sourceUrl: text('source_url'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const priceHistory = sqliteTable('price_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id),
  oldPrice: real('old_price').notNull(),
  newPrice: real('new_price').notNull(),
  changePct: real('change_pct').notNull(),
  source: text('source').notNull(),
  detectedAt: text('detected_at').notNull(),
});

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  storeId: integer('store_id').references(() => stores.id),
  status: text('status').notNull().default('draft'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const billOfMaterials = sqliteTable('bill_of_materials', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id),
  scope: text('scope').notNull(),
  projectType: text('project_type').notNull(),
  parameters: text('parameters').notNull(),
  materialsTotal: real('materials_total').notNull(),
  toolsTotal: real('tools_total').notNull(),
  labourTotal: real('labour_total').notNull(),
  grandTotal: real('grand_total').notNull(),
  createdAt: text('created_at').notNull(),
});

export const bomItems = sqliteTable('bom_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bomId: integer('bom_id')
    .notNull()
    .references(() => billOfMaterials.id),
  productId: integer('product_id').references(() => products.id),
  section: text('section').notNull(),
  name: text('name').notNull(),
  quantity: real('quantity').notNull(),
  unitPrice: real('unit_price').notNull(),
  lineTotal: real('line_total').notNull(),
  isShared: integer('is_shared').notNull().default(0),
  notes: text('notes'),
});

export const shoppingLists = sqliteTable('shopping_lists', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id),
  storeId: integer('store_id')
    .notNull()
    .references(() => stores.id),
  itemsTotal: real('items_total').notNull(),
  deliveryCost: real('delivery_cost').notNull(),
  grandTotal: real('grand_total').notNull(),
  exportedAt: text('exported_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
```

---

## Migration Strategy

- Migrations managed by Drizzle Kit (`drizzle-kit generate` → `drizzle-kit migrate`)
- Migration files stored in `src/db/migrations/`
- Naming convention: `0001_create_stores.sql`, `0002_create_products.sql`, etc.
- Seed data loaded from `src/catalog/products.json` via a seed script
- Schema changes require a new migration — never modify existing migration files

---

## References

- [Technical Spec](./02_technical_spec.md)
- [API Spec](./03_api_spec.md)
- [Architecture Overview](../03_architecture/01_overview.md)
