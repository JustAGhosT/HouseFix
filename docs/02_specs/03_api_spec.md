# API Specification — HouseFix AI BOM Assistant

## Overview

REST API for the HouseFix AI BOM Assistant. Provides product catalog access, BOM calculations, and AI-powered conversational project planning.

**Base URL:** `http://localhost:3000/api/v1`
**Version:** 1.0.0
**Format:** JSON

---

## Authentication

Phase 1: No authentication (public API, local use only).
Phase 2+: JWT Bearer tokens for saved projects and user accounts.

---

## Conventions

| Convention    | Value                    |
| ------------- | ------------------------ |
| Date format   | ISO 8601                 |
| Pagination    | Cursor-based             |
| Error format  | RFC 7807 Problem Details |
| Rate limiting | 100 req/min per IP       |
| Currency      | ZAR (South African Rand) |
| Prices        | VAT inclusive            |

---

## Endpoints Summary

### Products

| Method | Path                          | Description              |
| ------ | ----------------------------- | ------------------------ |
| `GET`  | `/products`                   | List/search products     |
| `GET`  | `/products/:id`               | Get a single product     |
| `GET`  | `/products/categories`        | List all categories      |
| `GET`  | `/products/:id/price-history` | Get price change history |

### BOM

| Method | Path                  | Description                     |
| ------ | --------------------- | ------------------------------- |
| `POST` | `/bom/calculate`      | Calculate a BOM from parameters |
| `GET`  | `/bom/coverage-rates` | Get coverage rate constants     |

### Chat (AI)

| Method | Path          | Description                              |
| ------ | ------------- | ---------------------------------------- |
| `POST` | `/chat`       | Send a message, get AI response with BOM |
| `POST` | `/chat/reset` | Reset conversation context               |

### Projects (Phase 2)

| Method | Path                          | Description                  |
| ------ | ----------------------------- | ---------------------------- |
| `GET`  | `/projects`                   | List saved projects          |
| `POST` | `/projects`                   | Create a new project         |
| `GET`  | `/projects/:id`               | Get project with BOMs        |
| `GET`  | `/projects/:id/shopping-list` | Get aggregated shopping list |
| `POST` | `/projects/:id/export`        | Export as PDF                |

### Stores

| Method | Path          | Description       |
| ------ | ------------- | ----------------- |
| `GET`  | `/stores`     | List all stores   |
| `GET`  | `/stores/:id` | Get store details |

### System

| Method | Path      | Description  |
| ------ | --------- | ------------ |
| `GET`  | `/health` | Health check |

---

## Endpoint Details

### GET /products

Search and filter the product catalog.

**Query Parameters:**

| Param         | Type    | Default | Description                |
| ------------- | ------- | ------- | -------------------------- |
| `q`           | string  | —       | Full-text search query     |
| `category`    | string  | —       | Filter by category         |
| `subcategory` | string  | —       | Filter by subcategory      |
| `min_price`   | number  | —       | Minimum price (ZAR)        |
| `max_price`   | number  | —       | Maximum price (ZAR)        |
| `store_id`    | number  | —       | Filter by store            |
| `in_stock`    | boolean | true    | Only show in-stock items   |
| `limit`       | number  | 20      | Results per page (max 100) |
| `cursor`      | string  | —       | Pagination cursor          |

**Response: 200 OK**

```json
{
  "data": [
    {
      "id": 4,
      "name": "Champion Extra Thick PVA 20L Winters Boy",
      "category": "paint",
      "subcategory": "pva",
      "price": 429.95,
      "unit": "each",
      "volume": "20L",
      "coverage": "Top coat — exterior + interior walls",
      "inStock": true,
      "store": {
        "id": 1,
        "name": "Cashbuild Kwa Thema"
      },
      "updatedAt": "2026-03-20T00:00:00Z"
    }
  ],
  "pagination": {
    "nextCursor": "eyJpZCI6MTB9",
    "hasMore": true,
    "total": 15
  }
}
```

### POST /bom/calculate

Calculate a Bill of Materials from structured parameters.

**Request Body:**

```json
{
  "projectType": "paint",
  "params": {
    "wallAreaM2": 80,
    "ceilingAreaM2": 20,
    "coats": 2,
    "surfaceType": "repaint",
    "includeWaterproofing": true,
    "workers": 1
  },
  "storeId": 1
}
```

**Response: 200 OK**

```json
{
  "sections": [
    {
      "name": "Materials",
      "items": [
        {
          "productId": 5,
          "name": "Mackay Contractor PVA 20L White",
          "quantity": 1,
          "unitPrice": 257.95,
          "lineTotal": 257.95,
          "notes": "80m² ÷ 10 m²/L = 8L → 1× 20L tub (covers first coat)"
        },
        {
          "productId": 4,
          "name": "Champion Extra Thick PVA 20L Winters Grey",
          "quantity": 2,
          "unitPrice": 429.95,
          "lineTotal": 859.9,
          "notes": "80m² × 2 coats ÷ 12 m²/L = 13.3L → 2× 20L tubs"
        }
      ],
      "subtotal": 1117.85
    },
    {
      "name": "Tools",
      "items": [],
      "subtotal": 0
    },
    {
      "name": "Labour",
      "items": [],
      "subtotal": 0
    }
  ],
  "summary": {
    "materialsTotal": 1117.85,
    "toolsTotal": 0,
    "labourTotal": 0,
    "deliveryCost": 200.0,
    "grandTotal": 1317.85
  },
  "applicationOrder": [
    "Sugar soap wash all surfaces",
    "Fill cracks with filler, dry, sand smooth",
    "Apply first coat (Mackay PVA White) to all walls",
    "Apply top coat (Champion Winters Grey) × 2 to walls",
    "Clean brushes/rollers with thinners"
  ]
}
```

### POST /chat

Send a message to the AI assistant and receive a response with optional BOM artifacts.

**Request Body:**

```json
{
  "message": "I need to paint my exterior walls, about 80 square metres",
  "sessionId": "abc123"
}
```

**Response: 200 OK**

```json
{
  "reply": "I can help with that! A few questions first...",
  "artifact": null,
  "toolCalls": [],
  "sessionId": "abc123"
}
```

When the AI generates a BOM, the `artifact` field contains HTML for the interactive visualization:

```json
{
  "reply": "Here's your Bill of Materials for the exterior painting project:",
  "artifact": "<div class=\"bom-artifact\">...</div>",
  "toolCalls": ["search_products", "calculate_bom"],
  "sessionId": "abc123"
}
```

---

## Error Codes

| Code | Meaning          | Resolution                            |
| ---- | ---------------- | ------------------------------------- |
| 400  | Bad Request      | Check request body against schema     |
| 401  | Unauthorised     | Provide valid JWT token (Phase 2)     |
| 404  | Not Found        | Verify resource ID                    |
| 422  | Validation Error | Check field-level error messages      |
| 429  | Rate Limited     | Back off and retry after header value |
| 500  | Internal Error   | Check server logs                     |
| 503  | AI Unavailable   | Claude API is down, retry later       |

**Error Response Format (RFC 7807):**

```json
{
  "type": "https://housefix.co.za/errors/validation",
  "title": "Validation Error",
  "status": 422,
  "detail": "wallAreaM2 must be a positive number",
  "instance": "/api/v1/bom/calculate"
}
```

---

## References

- [API Overview](../04_api/01_overview.md)
- [Endpoint Reference](../04_api/02_endpoints.md)
- [Data Models](./04_data_models.md)
- [Technical Spec](./02_technical_spec.md)
