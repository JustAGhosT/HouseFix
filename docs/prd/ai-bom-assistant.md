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

### Limitations of the Current Approach

- **Requires domain knowledge:** Users must know which template to pick before they start. A homeowner who says "my bathroom has damp and the paint is peeling" doesn't know if they need "Paint Interior Walls", "Waterproofing", or both.
- **No guidance on measurements:** The form asks for "Total Area of Wall to be Tiled (m²)" but doesn't help users measure or estimate. No room-size calculator, no guidance on waste allowance.
- **No conversational context:** Can't ask "what kind of surface is this?" or "do you need primer for new plaster vs repainting?"
- **No application guidance:** Generates a product list but doesn't tell you what order to apply things, drying times, or surface prep steps.
- **No iterative refinement through dialogue:** Swapping products requires navigating back through the template form, not a natural "actually, make the first coat white instead of grey."

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

| # | Cashbuild (Current) | AI Assistant (Proposed) |
|---|---------------------|------------------------|
| 1 | Browse template categories, pick one | Describe your project in plain language |
| 2 | Fill in measurement form fields | AI asks what it needs; renders interactive sliders |
| 3 | System generates static product list | AI generates live-updating cost breakdown artifact |
| 4 | Navigate back to form to change values | Adjust via conversation or slider interaction |
| 5 | Download PDF, add items to cart | AI outputs final shopping list; links to nearest store |

### Key Difference

The AI collapses steps 1-2 into a single conversation. Users don't need to know the right template — they describe their problem, and the AI figures out the scope (painting + waterproofing + surface prep).

---

## "Show Me" Artifact Specification

The interactive artifact follows the same pattern as Claude's "show me how compound interest works" — a self-contained, interactive visualization with inputs and live-calculated outputs.

### Input Controls (Sliders/Dropdowns)

| Control | Type | Range | Default |
|---------|------|-------|---------|
| Wall area to paint | Slider | 5-200 m² | 50 m² |
| Number of coats | Dropdown | 1, 2, 3 | 2 |
| Ceiling area | Slider | 0-100 m² | 20 m² |
| Number of rooms | Stepper | 1-10 | 3 |
| Surface type | Dropdown | New plaster, Repaint, Face brick | Repaint |
| Paint type (walls) | Dropdown | PVA, Acrylic, Enamel | PVA |
| First coat color | Color picker | White, Light Grey, Custom | White |
| Top coat color | Color picker | Winters Grey, Charcoal, Custom | Winters Grey |
| Include waterproofing | Toggle | Yes/No | No |
| Store location | Dropdown | Cashbuild branches | Kwa Thema |

### Calculated Outputs (Live-Updating)

| Output | Calculation |
|--------|-------------|
| Paint volume (first coat) | Wall area × coverage rate (8-10 m²/L for PVA) |
| Paint volume (top coat) | Wall area × coats × coverage rate |
| Number of tubs needed | Volume ÷ tub size (20L), rounded up |
| Primer/sealer needed | Based on surface type |
| Prep materials | Sugar soap, filler, sandpaper — based on surface condition |
| Total cost | Sum of all products at Cashbuild prices |

### Visual Elements

- **Product table:** Each product with quantity, unit price, line total
- **Summary cards:** Subtotal | Delivery | Total (mirroring Cashbuild cart layout)
- **Color preview:** Swatch strip showing first coat → top coat → trim colors
- **Application timeline:** Visual step-by-step order with icons (prep → prime → coat → finish)
- **Coverage diagram:** Simple wall graphic showing painted vs unpainted area as slider moves

---

## Key Features

### 1. Conversational Intake
No template selection needed. The AI identifies the project scope from natural language and maps it to the right product categories.

### 2. Interactive Artifacts
Claude's "show me" capability renders rich, interactive UIs — sliders for measurements, live-updating cost tables, visual checklists. This replaces Cashbuild's static form-based input.

### 3. Product Matching
Requirements map to actual Cashbuild SKUs with real prices from the catalog. The AI knows product specifications (coverage rates, drying times, compatibility).

### 4. Application Guidance
Sequenced step-by-step instructions that Cashbuild's BOM tool doesn't provide:
1. Sugar soap wash all surfaces
2. Fill cracks, dry, sand smooth
3. Apply waterproofing where needed
4. First coat (sealer) on all walls + ceilings
5. Top coat × 2 on walls only
6. Enamel on metalwork (burglar bars, window frames)
7. Cleanup with thinners

### 5. Store Awareness
Knows which Cashbuild store to target, what's in stock, delivery costs, and opening hours.

### 6. Iterative Refinement
Change anything through conversation:
- "Swap the grey first coat for white"
- "Add tiling materials for the bathroom"
- "Remove the roof repair items, I'll do that later"
- "What if I do 3 coats instead of 2?"

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

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Project scoping accuracy | AI identifies all needed product categories from description | Compare AI output to expert assessment |
| Product matching accuracy | Correct Cashbuild SKUs selected for the job | Validate against store catalog |
| Cost estimation accuracy | Within 10% of manual BOM calculation | Compare to Cashbuild's BOM tool output |
| User satisfaction | Users prefer AI flow to template-based flow | A/B test or survey |
| Time to complete BOM | Faster than 5-step template workflow | Measure conversation time vs form completion time |

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

### Integration Points
- Cashbuild product API (or catalog scraping)
- Store location/inventory lookup
- Shopping cart export (PDF or direct cart link)

---

## References

- [Exterior Paint Colors Plan](../01_product/exterior-paint-colors.md)
- [Materials Shopping List](../01_product/materials-shopping-list.md)
- Cashbuild Bill of Materials Tool (GoBuild360)
- Claude "Show Me" Artifacts (interactive visualization capability)
