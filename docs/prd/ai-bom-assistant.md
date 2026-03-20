# PRD: AI-Powered Bill of Materials Assistant

**Product Name:** HouseFix AI BOM Assistant
**Version:** 0.1 (Proof of Concept)
**Last Updated:** 2026-03-20
**Status:** Concept validated through HouseFix project

---

## Problem Statement

Cashbuild's existing Bill of Materials tool (powered by GoBuild360) follows a rigid 5-step workflow:

1. **Choose a Template** — user must already know what category their project falls into (Paint Exterior Walls, Tiling a Wall, Paving, etc.)
2. **Enter Your Measurements** — precise numeric inputs required upfront (area in m², number of installers)
3. **Get Your Bill of Materials** — auto-calculated product list with quantities
4. **Refine Your List** — adjust products, swap alternatives
5. **Download PDF or Buy Products** — add to cart, arrange delivery

### What the Current Tool Produces

Using the "Tiling a Wall (Area)" template with 10 m² input and 2 installers, the BOM tool generates a three-section output:

**Section 1 — Wall Tiling Materials (R3,096.40):**

| Product                                 | Calculated Qty  | Unit Price | Total     |
| --------------------------------------- | --------------- | ---------- | --------- |
| Wall Tile Meteor 250x400 1.7m² Bone     | 8 packs (14 m²) | R190.95    | R1,527.60 |
| Saza Ceramic 24 Hour Tile Adhesive 20kg | 3 bags (48 kg)  | R37.95     | R113.85   |
| Ezee Tile Grout 5kg                     | 1 bag (4 kg)    | R64.95     | R64.95    |
| Tile Spacers 2mm                        | 1 pack (30 pcs) | R27.95     | R27.95    |
| Fokox Tile Edge Trim Ivory 2mm          | 9 packs (32 m)  | R29.95     | R269.55   |
| Labour: Tiling                          | 10 m²           | R109.25    | R1,092.50 |

**Section 2 — Tiling Tools (R2,381.10):**

| Product                                   | Qty (×2 installers) | Unit Price | Total     |
| ----------------------------------------- | ------------------- | ---------- | --------- |
| Wheelbarrow Economy Economy64             | 2                   | R519.95    | R1,039.90 |
| Tape Measure 3 Meter                      | 2                   | R47.95     | R95.90    |
| Academy Lines Protective Household Gloves | 2                   | R32.95     | R65.90    |
| Fokox Grout Squeegee                      | 2                   | R62.95     | R125.90   |
| Fokox Floor Applicator Plastic            | 2                   | R8.50      | R17.00    |
| Fokox Cutting Wheel 450/500mm             | 2                   | R84.95     | R169.90   |
| Fokox Tile Nipper                         | 2                   | R174.95    | R349.90   |
| Fokox Floor Applicator Plastic (adhesive) | 2                   | R8.50      | R17.00    |
| Fokox Wall Trowel Steel                   | 2                   | R69.95     | R139.90   |
| Fokox Knee Pads                           | 2                   | R154.95    | R309.90   |
| Fokox Cleaning Sponge                     | 2                   | R24.95     | R49.90    |

**Grand Total Breakdown:**

| Category        | Amount        |
| --------------- | ------------- |
| Tools           | R2,381.10     |
| Labour          | R1,042.50     |
| Materials       | R2,053.98     |
| **Grand total** | **R5,477.58** |

Actions available: **Download PDF** | **Select products to order** | **Save project**

### Limitations of the Current Approach

- **Requires domain knowledge:** Users must know which template to pick before they start. A homeowner who says "my bathroom has damp and the paint is peeling" doesn't know if they need "Paint Interior Walls", "Waterproofing", or both.
- **No guidance on measurements:** The form asks for "Total Area of Wall to be Tiled (m²)" but doesn't help users measure or estimate. No room-size calculator, no guidance on waste allowance.
- **No conversational context:** Can't ask "what kind of surface is this?" or "do you need primer for new plaster vs repainting?"
- **No application guidance:** Generates a product list but doesn't tell you what order to apply things, drying times, or surface prep steps.
- **No iterative refinement through dialogue:** Swapping products requires navigating back through the template form, not a natural "actually, make the first coat white instead of grey."
- **Tool duplication:** The BOM assumes every installer needs their own full set of tools (2 wheelbarrows for 2 tilers?). No intelligence about which tools are shared vs individual.
- **No product alternatives:** Each line item has a "Manage products" button, but no proactive suggestions for cheaper alternatives or better-rated options.
- **Single-template scope:** If your project spans painting + tiling + waterproofing, you must run three separate templates and manually combine the results. No cross-template awareness.

---

## Product Vision

An AI assistant (Claude-powered) that acts like a knowledgeable hardware store assistant — the kind of person you'd find at the paint counter who asks the right questions and builds you a complete plan.

### How It Works

1. **User describes their project in plain language:**

   > "I need to paint the outside of my house and fix a leaky roof. The house has face brick and plastered sections. I also want to redo the bathroom."

2. **AI asks clarifying questions:**
   - What's the approximate wall area? (or: how many rooms? what size?)
   - What surface type? (new plaster, previously painted, face brick?)
   - Any moisture/damp issues?
   - What color scheme are you going for?
   - Which Cashbuild store are you near?

3. **AI generates an interactive "show me" artifact** — the same kind of rich, interactive visualization Claude produces when you say "show me how compound interest works" (with sliders, live charts, and calculated outputs):
   - Sliders for wall area (m²), number of coats, ceiling height
   - Real-time cost breakdown that updates as sliders move
   - Visual material list with quantities auto-calculated
   - Color swatches for selected paint colors
   - Step-by-step application timeline

4. **User refines via conversation:**

   > "Can I use a white first coat instead? And the more expensive grey for the top coat."

5. **AI outputs a final shopping list** matched to actual Cashbuild product catalog with real prices.

---

## User Flow: Cashbuild vs AI

| #   | Cashbuild (Current)                    | AI Assistant (Proposed)                                |
| --- | -------------------------------------- | ------------------------------------------------------ |
| 1   | Browse template categories, pick one   | Describe your project in plain language                |
| 2   | Fill in measurement form fields        | AI asks what it needs; renders interactive sliders     |
| 3   | System generates static product list   | AI generates live-updating cost breakdown artifact     |
| 4   | Navigate back to form to change values | Adjust via conversation or slider interaction          |
| 5   | Download PDF, add items to cart        | AI outputs final shopping list; links to nearest store |

### Key Difference

The AI collapses steps 1-2 into a single conversation. Users don't need to know the right template — they describe their problem, and the AI figures out the scope (painting + waterproofing + surface prep).

---

## "Show Me" Artifact Specification

The interactive artifact follows the same pattern as Claude's "show me how compound interest works" — a self-contained, interactive visualization with inputs and live-calculated outputs. The user says "show me what I need to tile my bathroom wall" and gets a fully interactive BOM calculator.

### Input Controls (Sliders/Dropdowns)

The artifact renders context-appropriate inputs based on the project type. Examples:

**For painting projects:**

| Control               | Type         | Range                            | Default      |
| --------------------- | ------------ | -------------------------------- | ------------ |
| Wall area             | Slider       | 5-200 m²                         | 50 m²        |
| Number of coats       | Dropdown     | 1, 2, 3                          | 2            |
| Ceiling area          | Slider       | 0-100 m²                         | 20 m²        |
| Surface type          | Dropdown     | New plaster, Repaint, Face brick | Repaint      |
| First coat color      | Color picker | White, Light Grey, Custom        | White        |
| Top coat color        | Color picker | Winters Grey, Charcoal, Custom   | Winters Grey |
| Include waterproofing | Toggle       | Yes/No                           | No           |
| Number of workers     | Stepper      | 1-5                              | 1            |

**For tiling projects:**

| Control              | Type     | Range                     | Default |
| -------------------- | -------- | ------------------------- | ------- |
| Wall/floor area      | Slider   | 1-100 m²                  | 10 m²   |
| Tile size            | Dropdown | 250×400, 300×300, 600×600 | 250×400 |
| Spacer width         | Dropdown | 1mm, 2mm, 3mm, 5mm        | 2mm     |
| Include edge trim    | Toggle   | Yes/No                    | Yes     |
| Number of installers | Stepper  | 1-5                       | 2       |
| Own tools already    | Toggle   | Yes/No                    | No      |

### Three-Section Output (Matching Cashbuild Structure)

The AI artifact mirrors Cashbuild's proven three-section breakdown but adds intelligence:

**Section 1 — Materials** (with progress bar)

- Product name, calculated quantity, unit price, line total
- Each product has a "swap" action (AI suggests alternatives on click)
- Waste allowance shown as separate line item (e.g., "+15% for cuts")

**Section 2 — Tools** (with intelligence)

- Separates **shared tools** (1 wheelbarrow for the team) from **per-worker tools** (gloves, knee pads)
- "Already own" toggle per tool to exclude from cost
- Tool quality tier selector: Economy | Standard | Professional

**Section 3 — Labour**

- Rate per m² based on project type
- Adjustable installer count
- Estimated days to complete

**Grand Total Summary** (live-updating cards):

| Category        | Amount      |
| --------------- | ----------- |
| Materials       | R\_\_\_     |
| Tools           | R\_\_\_     |
| Labour          | R\_\_\_     |
| Delivery        | R\_\_\_     |
| **Grand total** | **R\_\_\_** |

### Calculated Outputs (Live-Updating)

| Output                     | Calculation                                   |
| -------------------------- | --------------------------------------------- |
| Paint volume (first coat)  | Wall area × coverage rate (8-10 m²/L for PVA) |
| Paint volume (top coat)    | Wall area × coats × coverage rate             |
| Number of tubs/bags needed | Volume ÷ product size, rounded up             |
| Tile quantity              | Area ÷ tile coverage per pack, + waste %      |
| Adhesive quantity          | Area × kg per m², rounded to bag size         |
| Grout quantity             | Based on tile size, gap width, area           |
| Total cost                 | Sum of all sections at Cashbuild prices       |

### Visual Elements

- **Product table:** Three collapsible sections (Materials, Tools, Labour) — each with its own subtotal and progress bar, matching Cashbuild's layout
- **Summary cards:** Materials | Tools | Labour | Delivery | Grand Total
- **Color preview:** Swatch strip showing first coat → top coat → trim (painting projects)
- **Tile preview:** Grid pattern showing tile layout with grout lines (tiling projects)
- **Application timeline:** Visual step-by-step order with icons and estimated time
- **Cost pie chart:** Visual breakdown of where the money goes (materials vs tools vs labour)
- **Smart alerts:** "Did you know? You probably only need 1 wheelbarrow for 2 tilers" / "Edge trim seems high — do all walls need it?"

### Improvement Over Cashbuild's Static Output

| Cashbuild BOM                                      | AI Artifact                                   |
| -------------------------------------------------- | --------------------------------------------- |
| Static table, recalculates only on page reload     | Live-updating as sliders move                 |
| "Manage products" button per item — opens new view | Inline swap suggestions with price comparison |
| 2 wheelbarrows for 2 tilers (no shared tool logic) | Distinguishes shared vs per-worker tools      |
| Separate templates for painting + tiling           | Single artifact handles multi-scope projects  |
| No application guidance                            | Built-in step-by-step timeline                |
| PDF download only                                  | PDF + shareable link + direct cart export     |
| No cost optimization suggestions                   | "Save R519.95 by sharing one wheelbarrow"     |

---

## Key Features

### 1. Conversational Intake

No template selection needed. The AI identifies the project scope from natural language and maps it to the right product categories. A single conversation can span what would require running "Paint Exterior Walls", "Paint Interior Walls", "Waterproofing", and "Tiling a Wall" as four separate Cashbuild templates.

### 2. Interactive Artifacts

Claude's "show me" capability renders rich, interactive UIs — sliders for measurements, live-updating cost tables, visual checklists. This replaces Cashbuild's static form-based input while keeping the proven three-section output structure (Materials, Tools, Labour) that users already understand.

### 3. Product Matching

Requirements map to actual Cashbuild SKUs with real prices. Examples from validated projects:

- Wall Tile Meteor 250x400 1.7m² Bone @ R190.95/pack
- Saza Ceramic 24 Hour Tile Adhesive 20kg @ R37.95/bag
- Mackay Contractor PVA 20L White @ R257.95
- Champion Extra Thick PVA 20L Winters Grey @ R432.95

### 4. Smart Tool Logic

Cashbuild's BOM multiplies every tool by number of installers (2 tilers = 2 wheelbarrows = R1,039.90). The AI distinguishes:

- **Shared tools** (1 wheelbarrow, 1 tile cutter, 1 tile nipper) — buy once
- **Per-worker tools** (gloves, knee pads, trowels) — buy per installer
- **Already owned** — toggle off tools you have, reduces total

Estimated savings on the 10 m² tiling example: ~R900 on tools alone.

### 5. Application Guidance

Sequenced step-by-step instructions that Cashbuild's BOM tool doesn't provide:

**Painting project:**

1. Sugar soap wash all surfaces
2. Fill cracks, dry, sand smooth
3. Apply waterproofing where needed
4. First coat (sealer) on all walls + ceilings
5. Top coat × 2 on walls only
6. Enamel on metalwork (burglar bars, window frames)
7. Cleanup with thinners

**Tiling project:**

1. Prepare substrate (level, clean, prime if needed)
2. Dry-lay tiles to plan cuts and layout
3. Mix adhesive, apply with notched trowel
4. Set tiles with spacers, check level frequently
5. Allow 24 hours cure time
6. Grout joints, clean excess with sponge
7. Apply edge trim at exposed edges
8. Final cleanup

### 6. Store Awareness

Knows which Cashbuild store to target, delivery costs (R200 for Kwa Thema), and groups the shopping list by store aisle/section.

### 7. Iterative Refinement

Change anything through conversation:

- "Can I use a white first coat? And the more expensive grey for the top coat."
- "Add tiling materials for the bathroom"
- "Remove the roof repair items, I'll do that later"
- "What if I do 3 coats instead of 2?"
- "I already own a wheelbarrow and tile cutter"
- "What's a cheaper tile option?"

### 8. Cross-Template Intelligence

The AI handles multi-scope projects as a single conversation. For the HouseFix project, this meant combining:

- Exterior painting (would be "Paint Exterior Walls" template)
- Bathroom painting (would be "Paint Interior Walls" template)
- Shower waterproofing (would be "Waterproofing" template)
- Roof leak repair (no matching template exists)
- Surface prep (not a template — assumed knowledge)

Result: One unified shopping list of 10 items at R2,992.45 instead of running 3-4 separate templates and manually de-duplicating.

---

## Proof of Concept: This Project

The HouseFix project validates this approach. Through conversation, the AI:

1. **Identified the full scope** from a description + house photo — exterior painting, roof leak repair, bathroom renovation, waterproofing
2. **Asked the right questions** — surface types, color preferences, existing interior palette
3. **Selected specific products** from Cashbuild's catalog with real prices
4. **Built a sequenced application plan** (10-step painting order)
5. **Iterated on choices** — removed redundant products (Rubberflex), swapped first coat from Light Grey to White, adjusted bathroom ceiling approach
6. **Produced deliverables:**
   - `docs/01_product/exterior-paint-colors.md` — full paint specification
   - `docs/01_product/materials-shopping-list.md` — costed shopping cart (R2,992.45 total)

### Updated Specifications (from conversation)

- **First coat:** Mackay Contractor PVA 20L **White** (sealer) — changed from Light Grey
- **Top coat:** Champion Extra Thick PVA 20L **Winters Grey** (the more expensive option)
- **Bathroom ceiling:** White (matches rest of house) — simplified from Light Grey

### Comparison: Cashbuild BOM vs AI for Same Project

**Cashbuild approach** (for just the tiling portion, 10 m²):

- Must select "Tiling a Wall (Area)" template
- Enter 10 m² and 2 installers
- Gets R5,477.58 total (Materials R2,053.98 + Tools R2,381.10 + Labour R1,042.50)
- Includes 2 wheelbarrows (R1,039.90) — one per installer
- No guidance on prep, application order, or what to do with leftover adhesive
- Would need to run separate templates for painting and waterproofing

**AI approach** (for the full project — painting + waterproofing + roof + prep):

- Described the project in natural language over a conversation
- Got a unified plan covering 5+ categories that would require separate Cashbuild templates
- Total: R2,992.45 for all painting, waterproofing, and prep materials
- Included application order, product compatibility advice, and iterative refinement
- Changed first coat color mid-conversation — no need to restart

The AI doesn't just replicate the BOM — it acts as a knowledgeable advisor who catches issues (like buying 2 wheelbarrows) and connects tasks that Cashbuild's templates treat as separate projects.

---

## Scope

### In Scope (v1)

- Paint projects (interior + exterior walls, ceilings, trim)
- Waterproofing and sealing (roof leaks, shower wet zones)
- Basic tiling (wall and floor)
- Surface preparation (cleaning, filling, priming)
- Product matching to Cashbuild catalog with real prices
- Interactive "show me" artifact generation
- Application order guidance
- Single-store shopping list

### Out of Scope (v1)

- Structural work (foundations, roofing structure, load-bearing walls)
- Electrical and plumbing
- Automated purchasing/checkout integration
- Multi-store price comparison
- Contractor matching/hiring
- Building permit/compliance checking

---

## Success Metrics

| Metric                    | Target                                                       | How to Measure                                    |
| ------------------------- | ------------------------------------------------------------ | ------------------------------------------------- |
| Project scoping accuracy  | AI identifies all needed product categories from description | Compare AI output to expert assessment            |
| Product matching accuracy | Correct Cashbuild SKUs selected for the job                  | Validate against store catalog                    |
| Cost estimation accuracy  | Within 10% of manual BOM calculation                         | Compare to Cashbuild's BOM tool output            |
| User satisfaction         | Users prefer AI flow to template-based flow                  | A/B test or survey                                |
| Time to complete BOM      | Faster than 5-step template workflow                         | Measure conversation time vs form completion time |

---

## Technical Requirements

### AI Model

- Claude (Sonnet 4.6 or higher) with "show me" artifact capability
- Extended thinking for complex multi-room calculations
- Tool use for product catalog lookups

### Data Sources

- Cashbuild product catalog (prices, SKUs, specifications)
- Paint coverage rates and application guidelines
- Store locations and delivery zones

### Integration Points — Phased Approach

**Phase 1 — Local Product Catalog (Immediate)**

- JSON product catalog seeded from existing Cashbuild cart data (`src/catalog/products.json`)
- Top-level catalog object with `store`, `lastUpdated`, `currency`, and a `products` array
- Per-product model: `{ id, name, category, price, unit }`
- Powers the AI BOM assistant without external dependencies
- Prices manually updated from store visits or website checks

**Phase 2 — Web Scraping (Short-term)**

- Playwright/Cheerio scraper for cashbuild.co.za product pages
- Cashbuild runs on PrestaShop — categories at `/{id}-{slug}` pattern
- Schedule periodic price updates (weekly)
- Add builders.co.za as second source for price comparison

**Phase 3 — API Partnership (Medium-term)**

- Cashbuild PrestaShop Web Services API (B2B key) — `GET /api/products?output_format=JSON`
- Or GoBuild360 BOM API integration (Cashbuild's BOM tool provider)
- Enables: real-time pricing, stock availability, direct cart/order creation
- See [API Research](../07_integrations/01_external_apis.md) for full details

---

## References

- [Exterior Paint Colors Plan](../01_product/exterior-paint-colors.md)
- [Materials Shopping List](../01_product/materials-shopping-list.md)
- Cashbuild Bill of Materials Tool (GoBuild360)
- Claude "Show Me" Artifacts (interactive visualization capability)
