---
version: alpha
name: Mingze Architectural Engineering
description: Swiss architectural editorial system for Mingze Waterproof Material's B2B manufacturing and global export platform.
colors:
  primary: "#101820"
  secondary: "#46515B"
  tertiary: "#1F5FBF"
  signal: "#B54716"
  surface: "#FAF9F5"
  surface-warm: "#F3F0E9"
  surface-dark: "#0B1117"
  on-surface: "#17212B"
  on-primary: "#F3F0E9"
  on-dark: "#F3F0E9"
  on-tertiary: "#FFFFFF"
  border: "#B9C0C5"
  border-dark: "#52606A"
  success: "#176B45"
  danger: "#A52828"
typography:
  display-xl:
    fontFamily: "IBM Plex Sans, Arial, sans-serif"
    fontSize: 4.5rem
    fontWeight: 650
    lineHeight: 0.98
    letterSpacing: -0.03em
  display-lg:
    fontFamily: "IBM Plex Sans, Arial, sans-serif"
    fontSize: 3.25rem
    fontWeight: 650
    lineHeight: 1.02
    letterSpacing: -0.025em
  headline-md:
    fontFamily: "IBM Plex Sans, Arial, sans-serif"
    fontSize: 2rem
    fontWeight: 650
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: "IBM Plex Sans, Arial, sans-serif"
    fontSize: 1.25rem
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: -0.01em
  body-lg:
    fontFamily: "IBM Plex Sans, Arial, sans-serif"
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  body-md:
    fontFamily: "IBM Plex Sans, Arial, sans-serif"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  body-sm:
    fontFamily: "IBM Plex Sans, Arial, sans-serif"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.01em
  label-md:
    fontFamily: "IBM Plex Mono, ui-monospace, Menlo, monospace"
    fontSize: 0.8125rem
    fontWeight: 550
    lineHeight: 1.35
    letterSpacing: 0.08em
  label-sm:
    fontFamily: "IBM Plex Mono, ui-monospace, Menlo, monospace"
    fontSize: 0.6875rem
    fontWeight: 550
    lineHeight: 1.4
    letterSpacing: 0.1em
  metric:
    fontFamily: "IBM Plex Mono, ui-monospace, Menlo, monospace"
    fontSize: 1.75rem
    fontWeight: 550
    lineHeight: 1.05
    letterSpacing: -0.02em
rounded:
  none: 0px
  sm: 2px
  md: 4px
  full: 9999px
spacing:
  hairline: 1px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  section: 88px
  section-compact: 64px
  page-gutter: 32px
  grid-gutter: 24px
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: 12px
    height: 48px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: 12px
    height: 48px
  button-dark:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: 12px
    height: 48px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 12px
    height: 48px
  technical-label:
    textColor: "{colors.secondary}"
    typography: "{typography.label-sm}"
---

# Mingze Architectural Engineering Design System

## Overview

Mingze's single-page B2B export platform should feel like a stamped engineering dossier: exact, durable, and ready for a procurement conversation. The visual direction is **Swiss architectural / modern industrial engineering editorial**. It uses a strict grid, warm paper-like surfaces, deep slate structure, tabular technical data, and cobalt as a controlled signal for action. It should evoke a factory plan, a standards matrix, and a well-edited product catalogue rather than a generic SaaS dashboard.

The experience is English-first and serves overseas contractors, roofing engineers, distributors, infrastructure project managers, and procurement directors. The page is a sequence of deliberate editorial plates: a utility strip and sticky header, an asymmetric proof-led hero, numbered material systems, a dense catalogue, build-up assemblies, standards, factory capability, the direct trade desk, and an architectural footer. The requested `/` route remains one continuous document; navigation anchors should feel like drawing references, not app tabs.

The first viewport must establish trust immediately. Show the compact utility strip, the 64–68px sticky header, a large left-aligned headline, a right-side architectural showcase frame, and the first row of proof metrics. Avoid a full-bleed decorative hero image, gradient, floating dashboard, or symmetrical three-card introduction. The hero's strongest visual move is the offset relationship between headline block, vertical rule, and technical showcase frame.

Use a restrained two-family type system: IBM Plex Sans for narrative and headings, IBM Plex Mono for labels, SKU identifiers, dimensions, standards, metrics, and coordinates. Use only the declared colors and tokens; visual authority comes from scale, alignment, and rule weight rather than effects.

## Colors

The palette is built from deep slate and obsidian, a warm architectural off-white, quiet gray structural lines, and one precise cobalt action color. Signal orange is reserved for a small number of physical or process annotations; it is not a second CTA color.

- **Primary Obsidian Slate (`#101820`):** Main headline ink, sticky header, dark technical plates, and primary text on warm surfaces.
- **Surface Warm (`#F3F0E9`):** Architectural paper ground and the hero canvas. It prevents the page from reading as a sterile white SaaS interface.
- **Surface (`#FAF9F5`):** Product rows, input fields, modal interiors, and quiet reading surfaces.
- **Surface Dark (`#0B1117`):** Footer and selected engineering plates; use with `on-dark` text.
- **Secondary Slate (`#46515B`):** Supporting copy, metadata, inactive navigation, and explanatory text. Keep it on light surfaces only.
- **Tertiary Cobalt (`#1F5FBF`):** The primary interaction signal: Request FOB Quote, active catalogue filters, focused links, and one key hero marker. On cobalt, use white text.
- **Signal Orange (`#B54716`):** Sparse process annotation, active laboratory step marker, or a small “FOB / Qingdao” locator. On warm surfaces it remains readable; never use it for long paragraphs.
- **Border (`#B9C0C5`) and Border Dark (`#52606A`):** 1px structural hairlines, table rules, frame boundaries, and dark-surface dividers. These are non-text structure, not body copy.
- **Success (`#176B45`) and Danger (`#A52828`):** Form and system states only. Pair every state with a text label, never color alone.

Normal text must maintain at least 4.5:1 contrast with its surface. Use `primary` or `on-surface` for body text, not the border colors. Cobalt fills use `on-tertiary`; dark plates use `on-dark`. Do not introduce gradients, glows, glass, or additional decorative colors.

## Typography

Typography is technical editorial rather than corporate-soft. Headlines have a tight, slightly compressed rhythm; metadata is monospaced, uppercase, and visibly tracked. Use no more than three visible weights in a region: 400 for reading, 550 for labels and metrics, and 650 for headings and key actions.

- **Display XL:** `display-xl`, 72px desktop, is reserved for the hero headline or one equivalent page-level statement. It is the dominant entry point and uses negative tracking with tight leading.
- **Display LG:** `display-lg`, 52px, introduces major section plates such as Product Systems or Engineering Solutions. On narrow screens it may reduce to 36px.
- **Headline MD / SM:** `headline-md` and `headline-sm` structure solution names, catalogue categories, modal titles, and factory capability items.
- **Body:** `body-lg` is used for the hero deck or a short section introduction; `body-md` is the default paragraph and form copy; `body-sm` is supporting detail. Keep prose around 50–75 characters per line and cap narrative blocks near 65ch.
- **Technical labels:** `label-md` is uppercase mono for section indices, navigation, actions, standards, and filters. `label-sm` is for table headers, SKU metadata, and fine print. All uppercase labels must retain positive tracking of at least 0.06em.
- **Metrics:** `metric` is tabular mono with lining numerals. Metrics must be accompanied by a plain-language label, such as `68,000 m² / FACILITY AREA`, never displayed as isolated decoration.

Keep the DOM reading order meaningful: eyebrow, heading, deck, action, then proof or supporting frame. Do not use display scale for multiple competing elements in the hero. Headings may be visually large while their semantic levels remain a normal `h1` → `h2` → `h3` hierarchy.

## Layout

Use a fluid 12-column architectural grid with a maximum content width of 1280px. At 1280–1440px, use 32px outer gutters and 24px column gutters. Expose 1px rules at meaningful column boundaries; do not outline every element. Major sections alternate between a light paper plate and a deep slate engineering plate so density has a measured cadence.

The desktop hero uses an asymmetric `7 / 5` split: the headline and primary action occupy the larger left field; the showcase frame occupies the right field and aligns to a vertical rule. The proof metrics sit as a four-cell strip under the deck or cross the lower edge of the frame, with rules between cells. Let the hero breathe before the numbered `01` material systems plate. The first viewport should be dense enough to establish industrial credibility, but not crowded.

Use section padding of `section` on desktop and `section-compact` at tablet widths. A typical section rhythm is 8–16px inside a component, 24px between related groups, 40px between blocks, and 64–88px between editorial plates. Vary vertical spacing intentionally: compact catalogue rows should contrast with the open hero and factory section.

Specific composition guidance for the requested page:

- The utility strip is a narrow dark band with export context and contact availability. The sticky header below it contains the monogram, wordmark, six anchor links, and one right-aligned Request FOB Quote action. On mobile, replace links with a disclosure menu; keep the CTA visible or first in the drawer.
- Material Systems is a numbered 01–05 index, not five equal promotional cards. Use a vertical list or staggered two-column ledger with a dominant number, system name, short use case, and a hairline rule. One cobalt rule or marker is enough.
- The 37-SKU catalogue is a data surface. Place category filters and search above a multi-column table-like list. Show SKU code, execution standards, dimensions, and actions in stable columns. On mobile, each row becomes a stacked technical record with code and product name first; never force a wide table or horizontal page scroll.
- Engineering Solutions should read as four assembly diagrams. Use numbered layer bands and a shared vertical datum; label layers with technical names and material systems. Keep explanatory copy outside the drawing so the cross-section remains legible.
- The QA and standards section uses a three-step horizontal lab pathway on desktop and a vertical sequence on mobile. Follow it with an ASTM / EN/CE / GB matrix whose row and column headers remain visible or are repeated in stacked records.
- Factory Base is a measured capability plate: one strong facility statement, four advantages, and a specification rail. Use hairlines and large numerals instead of icon cards.
- The Direct Trade Desk is the conversion endpoint. Use an asymmetric split: official contact channels and sample-box promise on the left; the structured RFQ form on the right. Place `zhao@mzwaterproof.com`, `zhao@mingzewaterproof.com`, and `+86 16658506707` as copyable, clearly labelled contact rows.
- TDS, RFQ, and Sample Swatch Box modals should be rectangular, sharply framed, and aligned to the same grid. A modal is a focused engineering document, not a floating card with a shadow.

Responsive behavior is intentional rather than a scaled desktop. At 1024px, move to a 6-column grid and reduce the hero frame width. At 768px, collapse the header navigation, turn multi-column catalogue rows into readable stacks, and preserve section indices. From 375px upward, use 16px page gutters, 24px section gutters, no fixed-width children, and `overflow-wrap:anywhere` for long email addresses and SKU strings. Images and technical frames must be fluid with a declared aspect ratio. Never create horizontal overflow.

Every interactive target, including filter tabs, menu buttons, modal close controls, table actions, and form controls, must be at least 44x44 CSS pixels. Keep touch targets separated by at least 8px where possible. Use native buttons and links, keyboard-reachable controls, visible `:focus-visible` treatment, and a logical focus trap with Escape dismissal inside modals.

## Elevation & Depth

Depth is structural and flat. Do not use drop shadows, blurred panels, glossy overlays, or floating glass surfaces. Establish hierarchy through surface changes, negative space, rule weight, and controlled inversion.

- Level 0 is text on `surface-warm` or `surface`, with no border when proximity is enough.
- Level 1 is a 1px `border` hairline for a quiet section or table separation.
- Level 2 is a 1px `border-dark` rule on dark plates or a stronger frame boundary around the showcase and engineering diagrams.
- Level 3 is a 2px `primary` or `tertiary` rule for the active action, input focus, or modal frame.
- Level 4 is a full `surface-dark` plate with `on-dark` type for the utility strip, selected technical panels, and footer.

Cobalt should appear no more than twice as a high-salience signal in one viewport: typically the main CTA and one active navigation/filter state. Hover may invert a rule or shift text to cobalt, but should not make every link blue. Motion is restrained: 120–180ms color, border, or opacity changes; no bounce, parallax, infinite marquee, or decorative count animation. Respect `prefers-reduced-motion`.

## Shapes

The shape language is architectural sharpness. Rectangular controls, frames, rows, diagrams, inputs, and modals use `none` or the very small `sm` radius only where a technical edge needs a slight anti-aliasing cushion. Do not mix rounded cards with sharp cards. Reserve `full` for a tiny status dot or a genuinely circular icon control; it is not a general pill treatment.

Buttons are squared with a minimum 48px height. Inputs are squared and clearly labelled above the field, not labelled only by placeholder text. Product rows are open ledger entries, not rounded cards. Images, factory photography, and showcase frames use square corners and hard crop boundaries. If a monogram is circular, it should be a deliberate brand mark rather than a default avatar pattern.

## Components

**Header and utility strip.** Use a 64–68px sticky header on `surface` with a 1px bottom rule. The utility strip is compact, dark, and mono-labelled. The wordmark and monogram sit at the left edge; anchor navigation uses `label-md`; the Request FOB Quote button uses `button-primary`. Active anchors use a short cobalt rule or a text inversion, not a filled pill. The mobile menu is a native button with an accessible name, a 44px target, and a full-width disclosure panel.

**Buttons and links.** The primary action uses `button-primary`: cobalt fill, white mono label, square corners, and an understated 1–2px pressed translation. The secondary action uses `button-secondary`: warm surface, dark text, and a 1px slate boundary. Dark-section actions use `button-dark` or a white-outline equivalent. Hover and focus must remain visibly different from the resting state. Inline links are underlined or use a short rule so they remain identifiable without color.

**Section labels and indices.** Use `technical-label` for `01 / MATERIAL SYSTEMS`, `04 / QA & STANDARDS`, and similar anchors. Numbered indices should be large, tabular, and aligned to a shared baseline. The index is a navigational aid and should not be mistaken for a metric.

**Metrics.** Render the four hero proofs as a ruled metric grid: value in `metric`, label in `label-sm`, and a short supporting qualifier only when supplied by the product content. Keep units attached to the value (`m²`, `M m²`, `km`) and use tabular numerals for fast comparison. Do not add unsourced performance claims or invented percentages.

**Catalogue filters and search.** Filters are rectangular segmented controls with an active cobalt rule and a text label. Search uses `input`, an explicit label, and a persistent clear action. Populated, loading, empty-result, request-error, and long-SKU states must all have designed treatments. A no-results message should echo the query and offer “Clear filters”; it must not be a blank table.

**Technical catalogue row.** On desktop, align SKU, product name, standard, dimensions, and actions into stable columns separated by hairlines. On mobile, use a stacked row with labels repeated above values. The Open TDS action is secondary; Inquire is the higher-priority action when a procurement decision is needed. Keep actions at 44px or larger.

**Assembly diagram.** Use a ruled rectangular drawing area with layer bands, numeric layer markers, and a small legend. Distinguish substrate, membrane, adhesive, protection, and finish by tonal surfaces and labels, not color alone. Keep diagrams accessible with a nearby text list describing each layer in order.

**Standards matrix and QA pathway.** Use table headers with `label-sm`, strong row labels, and one visible active step at a time. On mobile, convert matrix rows to labelled records with the standard family repeated. Loading uses a quiet shell; an error names the failed data source and provides Retry; partial standards data remains usable rather than collapsing the whole section.

**RFQ form.** Use explicit labels for company, work email, country or region, project type, product interest, annual or project quantity, target delivery port, and project notes. Include the Free Sample Box request as a clearly labelled checkbox or choice. Use native constraints and validate on blur after editing, then revalidate on input while recovering. On submit, show a top error summary and focus the first invalid field; preserve all entered values on failure. The submitting state disables repeat submission and announces progress in a polite status region. Success should state what happens next and keep the direct contact channels visible.

**Modals.** TDS, RFQ, and Sample Swatch Box modals use a full-screen or near-full-screen mobile sheet with a darkened but non-decorative backdrop, a 2px frame, labelled heading, close button, Escape handling, and focus restoration. The TDS modal prioritizes SKU, standards, dimensions, intended use, and the Technical Data Sheet action. The RFQ modal uses the same field rules as the direct desk. The sample modal states the request action and required project context; it must not imply shipment or availability before confirmation.

**Footer.** End with a dark architectural plate: monogram and wordmark, contact channels, anchor links, export note, and a final Request FOB Quote action. Use a strong top rule and a compact technical closing line. The footer should feel like the title block of a drawing set, not a dense sitemap.

Across all data and interactive surfaces, cover loading, empty, error, populated, and edge states. Long product names, missing optional dimensions, 37-item results, special-character search queries, long email strings, and narrow 375px layouts must remain readable. Use `role="status"` for non-urgent request updates, `role="alert"` for inline validation errors, and a focusable heading-led error summary rather than an alerting modal for ordinary form failures.

## Do's and Don'ts

- Do use the strict grid, exposed hairlines, asymmetric hero, numbered editorial indices, and ruled technical tables as the identity.
- Do keep the first viewport focused on one promise: engineered waterproofing systems with export-ready proof.
- Do use cobalt sparingly for the action that advances procurement; let slate and warm paper carry most of the page.
- Do use tabular mono numerals for facility metrics, SKU codes, dimensions, standards, and coordinates.
- Do keep normal text at a minimum 4.5:1 contrast and provide a visible focus indicator with at least 3:1 contrast against adjacent states.
- Do provide 44x44 CSS-pixel targets for every interactive control, including compact header and table actions.
- Do use native semantic landmarks, one clear `h1`, descriptive headings, labelled inputs, keyboard-operable controls, and meaningful text alternatives for diagrams and images.
- Do preserve RFQ input on errors, show specific field guidance, and provide recovery actions for failed catalogue or standards requests.
- Do allow content to wrap on mobile. At 375px, zero horizontal overflow is a hard requirement.
- Do use real factory or material imagery when assets are available; crop it as a square-cornered architectural frame with a descriptive alt text. Do not substitute gradients or CSS-drawn fake photographs.
- Don't use default purple or indigo gradients, glassmorphism, glow, animated blobs, or generic “trusted by” logo walls.
- Don't build a page of interchangeable rounded cards, floating SaaS tiles, or equal-weight feature boxes.
- Don't invent certifications, performance percentages, delivery promises, test results, or customer logos beyond the supplied content.
- Don't use color alone to communicate active, error, success, or selected states.
- Don't use placeholder-only labels, generic “Submit” copy where a task-specific action is possible, or filler copy.
- Don't hide the 37-SKU catalogue inside a decorative carousel or force a desktop table to scroll horizontally on mobile.
- Don't remove focus outlines, trap focus without Escape and a close action, or make modal content unreachable by keyboard.
- Don't add more than two high-salience cobalt uses in one viewport or introduce a new accent without a product reason.
- Don't use shadows to simulate hierarchy; use surface, rule, spacing, and typography instead.
