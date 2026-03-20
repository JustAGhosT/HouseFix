# External APIs — Building Material Pricing & Ordering

## Overview

This document catalogues the external APIs and data sources investigated for integrating building material pricing, product catalog, and ordering into the HouseFix AI BOM Assistant.

**Key finding:** No major South African hardware retailer offers a public API. All integration options require either a B2B partnership or web scraping.

---

## Integration Inventory

| #   | Service                        | Purpose                         | Auth Method         | Status                    | Docs                                                                          |
| --- | ------------------------------ | ------------------------------- | ------------------- | ------------------------- | ----------------------------------------------------------------------------- |
| 1   | Cashbuild PrestaShop API       | Product catalog, prices, orders | API key (B2B)       | Requires partnership      | [PrestaShop Webservice](https://devdocs.prestashop-project.org/9/webservice/) |
| 2   | GoBuild360 BOM API             | Bill of materials generation    | License/partnership | Requires partnership      | [gobuild360.io](https://www.gobuild360.io)                                    |
| 3   | Web Scraping (cashbuild.co.za) | Product data extraction         | None (public site)  | Available now             | —                                                                             |
| 4   | PriceBuddy.co.za               | Price comparison (12 suppliers) | None / partnership  | Site partially down       | [pricebuddy.co.za](https://pricebuddy.co.za)                                  |
| 5   | yorikvanhavre/priceAPI         | Construction material pricing   | Open source         | Available (needs SA data) | [GitHub](https://github.com/yorikvanhavre/priceAPI)                           |
| 6   | building-materials-market-API  | E-commerce API framework        | Open source         | Available                 | [GitHub](https://github.com/blackmarllborooo/building-materials-market-API)   |

---

## Integration Details

### 1. Cashbuild PrestaShop Web Services API (Best Option)

Cashbuild's website (cashbuild.co.za) runs on **PrestaShop**, which has a built-in REST API for full CRUD access to the product catalog, pricing, categories, and orders.

**Base URL:** `https://www.cashbuild.co.za/api`
**Authentication:** API key (must be issued by Cashbuild)

#### Endpoints Available (if enabled)

| Method | Path                                     | Purpose                          |
| ------ | ---------------------------------------- | -------------------------------- |
| GET    | `/api/products?output_format=JSON`       | Full product catalog             |
| GET    | `/api/products/{id}`                     | Single product details           |
| GET    | `/api/products/{id}?price[x][use_tax]=1` | Product with tax-inclusive price |
| GET    | `/api/categories`                        | Product categories               |
| GET    | `/api/stock_availables`                  | Inventory/stock levels           |
| POST   | `/api/carts`                             | Create a shopping cart           |
| POST   | `/api/orders`                            | Place an order                   |

#### How to Get Access

1. Contact Cashbuild's IT/e-commerce team about B2B API access
2. They would enable PrestaShop's webservice in Admin → Advanced Parameters → Webservice
3. They issue an API key with permissions scoped to products/categories/orders
4. Alternative: PrestaShop CloudSync APIs expose 30+ tables with 300+ properties

#### Rate Limits

PrestaShop default: no built-in rate limiting, but Cashbuild may impose limits via their hosting/CDN.

---

### 2. GoBuild360 BOM API

Cashbuild's Bill of Materials tool (the "Calculate your Bill of Materials" feature on their website) is powered by **GoBuild360** (gobuildbom.io). GoBuild360 is a cloud-based e-commerce solution purpose-built for the construction industry.

**Base URL:** `https://gobuildbom.io` (login required)
**Authentication:** License/partnership agreement

#### Capabilities

- Bill of materials generation from project templates
- Product catalog with construction-specific categories
- Cost estimation with labour rates
- ERP integration (NetSuite, Command Alkon)
- Builders merchant portal with customizable cost breakdowns

#### How to Get Access

1. Contact GoBuild360 directly via [gobuild360.io](https://www.gobuild360.io)
2. Explore partnership/licensing options for API access
3. Their platform is designed for B2B integration with builders merchants

---

### 3. Web Scraping (No Partnership Required)

Scrape product data directly from retailer websites when API access is unavailable.

#### Cashbuild (cashbuild.co.za)

- **Platform:** PrestaShop
- **Category URL pattern:** `/{numeric-id}-{slug}` (e.g., `/609-steel-sections`)
- **Sitemap:** `https://www.cashbuild.co.za/sitemap` (HTML sitemap available)
- **Product data:** Name, price (ZAR), availability, images, category

#### Builders Warehouse (builders.co.za)

- **Platform:** Standard e-commerce
- **Product catalog:** Browse online with prices

#### Leroy Merlin SA (leroymerlin.co.za)

- **Note:** Cashbuild is a marketplace seller on Leroy Merlin's platform
- **Product catalog:** Full online catalog with prices

#### Recommended Tools

| Tool       | Type             | Use Case                                 |
| ---------- | ---------------- | ---------------------------------------- |
| Playwright | Headless browser | JavaScript-heavy sites, dynamic content  |
| Cheerio    | HTML parser      | Static HTML pages, lightweight           |
| ScraperAPI | Managed service  | Handles proxies, CAPTCHAs, rate limiting |
| Apify      | Platform         | Pre-built scrapers, scheduling, storage  |

#### Risks

- Terms of service may prohibit automated scraping
- Site structure changes break scrapers
- Rate limiting / IP blocking
- Prices may differ from in-store prices

---

### 4. PriceBuddy.co.za

South African building materials price comparison site.

- **Coverage:** ~1,980 products, ~5,670 prices, 12 suppliers
- **Categories:** Building materials, plumbing, fencing, bricks, electrical
- **Features:** Multiple pricelists, comparison savings, price change notifications
- **Status:** Site appears partially down (shows setup/login page)
- **API:** None documented — would need scraping or partnership
- **Disclaimer:** Prices may be outdated; site is independent of retailers

---

### 5. Open Source: yorikvanhavre/priceAPI

Python API for construction material pricing, created by FreeCAD/BIM developer Yorik van Havre.

**GitHub:** [yorikvanhavre/priceAPI](https://github.com/yorikvanhavre/priceAPI)

#### Features

- Builds price sources from CSV data files on startup
- Price data format: Code, Description, Price, Unit
- Search with AND (`space`) and OR (`|`) operators
- Web interface via `webprice.py`
- Extensible: add new data sources by subclassing the base source class

#### Limitations

- Default data sources are Brazilian (SINAPI 2016)
- Would need South African pricing data (CSV format)
- Could seed with our existing Cashbuild cart data as a starting point

---

### 6. Open Source: building-materials-market-API

Full e-commerce API framework for a building materials store.

**GitHub:** [blackmarllborooo/building-materials-market-API](https://github.com/blackmarllborooo/building-materials-market-API)

#### Features

- RESTful API for building materials e-commerce
- OpenAPI specification (YAML)
- Oracle database backend
- Docker support
- Reusable framework for different platforms

#### Considerations

- Heavy stack (Oracle DB, Java) — may be overkill for HouseFix
- Could use the OpenAPI spec as reference for our own simpler API design

---

## Recommended Phased Approach

### Phase 1 — Local Product Catalog (Immediate)

Create a local JSON product catalog seeded from existing Cashbuild cart data.

```json
{
  "sku": "CB-PVA-20L-WG",
  "name": "Champion Extra Thick PVA 20L Winters Grey",
  "category": "paint",
  "price": 432.95,
  "currency": "ZAR",
  "unit": "each",
  "store": "Cashbuild Kwa Thema",
  "lastUpdated": "2026-03-20"
}
```

- No external dependencies
- Powers the AI BOM assistant immediately
- Prices manually updated from store visits or website checks

### Phase 2 — Web Scraping (Short-term)

- Build a Playwright/Cheerio scraper for cashbuild.co.za product pages
- Schedule periodic price updates (weekly)
- Store in local catalog, flag price changes
- Add builders.co.za as a second source for price comparison

### Phase 3 — API Partnership (Medium-term)

- Approach Cashbuild about PrestaShop API access (B2B key)
- Or approach GoBuild360 for BOM API integration
- Enables: real-time pricing, stock availability, direct cart/order creation

---

## References

- [AI BOM Assistant PRD](../prd/ai-bom-assistant.md)
- [Materials Shopping List](../01_product/materials-shopping-list.md)
- [PrestaShop Webservice Docs](https://devdocs.prestashop-project.org/9/webservice/)
- [GoBuild360](https://www.gobuild360.io)
