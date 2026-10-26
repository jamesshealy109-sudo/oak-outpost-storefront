---
name: Oak & Outpost
description: Southern travel journal typography and open, practical apparel shopping.
colors:
  cream: "#f7f3e9"
  paper: "#efeadf"
  forest: "#193c2e"
  deep: "#102b21"
  muted: "#656b5a"
  tan: "#d7c4a2"
  rust: "#ab4c2d"
  line: "#d9d9c9"
  product-neutral: "#eae6dc"
  product-sage: "#e5e8df"
  product-sand: "#ede4d7"
  product-stone: "#e7e6df"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(3.5rem, 6vw, 5.75rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2.8rem, 5vw, 5rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.035em"
  section-title:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2rem, 3.1vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.035em"
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  product-title:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.5
  control:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.015em"
rounded:
  square: "0"
  circle: "50%"
spacing:
  compact: "8px"
  control-gap: "12px"
  content-gap: "24px"
  mobile-gutter: "22px"
  section-block: "82px"
  mobile-section-block: "55px"
components:
  button-primary:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.cream}"
    typography: "{typography.control}"
    rounded: "{rounded.square}"
    padding: "17px 25px"
    height: "54px"
  button-primary-hover:
    backgroundColor: "{colors.rust}"
    textColor: "{colors.cream}"
  button-cream:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.forest}"
    typography: "{typography.control}"
    rounded: "{rounded.square}"
    padding: "17px 25px"
    height: "54px"
  button-cream-hover:
    backgroundColor: "{colors.tan}"
    textColor: "{colors.deep}"
  contact-input:
    backgroundColor: "#ffffff99"
    textColor: "{colors.forest}"
    rounded: "{rounded.square}"
    padding: "13px"
    width: "100%"
  product-tag:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.forest}"
    rounded: "{rounded.square}"
    padding: "6px 10px"
  size-option:
    backgroundColor: "transparent"
    textColor: "{colors.forest}"
    rounded: "{rounded.square}"
    padding: "8px 13px"
  size-option-selected:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.cream}"
  product-card:
    backgroundColor: "transparent"
    textColor: "{colors.forest}"
    rounded: "{rounded.square}"
  navigation:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.forest}"
---

# Design System: Oak & Outpost

## Overview

**Creative North Star: "The Southern Travel Journal"**

Warm paper, forest ink, expressive serif headlines, and generously framed apparel photography give Oak & Outpost the character of a Southern travel journal. Supplied oak, heron, and backroad artwork anchors the vintage outdoors identity. Controls remain direct and readable within that editorial world.

The implementation alternates broad photographic passages with quiet cream shopping surfaces. Product images have their own pale grounds and open captions; border rules organize choices and support content. Motion is restrained and removed for reduced-motion preferences. This system describes the built CSS in `app/globals.css`, the local fonts in `app/layout.tsx`, and the shared storefront components.

**Key Characteristics:**
- Warm cream surfaces and dark forest text.
- Fraunces headings paired with DM Sans commerce controls.
- Open product grids with contained merchandise images.
- Square buttons and fields, with circular swatches and bag counters.
- Shaded photography, subtle image movement, and one sliding bag drawer.

## Colors

The palette combines woodland greens, warm paper neutrals, and a restrained burnt-orange accent; frontmatter values are normative.

### Primary
- **Forest:** Main ink, primary action fill, announcement strip, selected variants, and active navigation.
- **Deep Forest:** Footer ground and the cream-button hover text.

### Secondary
- **Burnt Orange:** Action hover, focus outlines, selected text, italic emphasis on cream pages, and selection feedback.
- **Warm Tan:** Cream-button hover and warm supporting details.

### Neutral
- **Cream:** Page ground, light buttons, product tags, and inverse primary-button text.
- **Paper:** Secondary content panels, thumbnails, and bag image grounds.
- **Muted Olive:** Supporting copy and product metadata.
- **Rule:** Dividers, fields, quantity controls, and unselected variant outlines.
- **Product Neutral / Sage / Sand / Stone:** Repeated pale merchandise image grounds. These are presentation tones, not product color swatches; actual swatches come from merchandise data.

### Named Rules
**The Forest Ink Rule.** Main reading and purchasing surfaces use forest ink on cream; burnt orange marks emphasis and interaction rather than replacing the reading color.

## Typography

**Display Font:** Self-hosted Fraunces semibold, with Georgia and serif fallbacks.
**Body Font:** Self-hosted DM Sans regular and semibold, with sans-serif fallback.

Fraunces supplies the warm, slightly nostalgic editorial voice. DM Sans keeps product names, prices, navigation, and variant choices compact and practical. Headings balance their wraps; paragraph measure is capped at 72ch, with some support answers at 75ch.

### Hierarchy
- **Display:** Hero-only large scale, tight tracking and line height as defined above. At the mobile breakpoint it uses `clamp(3rem, 11.9vw, 4.7rem)` and a 1.08 line height.
- **Headline:** General page h1 baseline. Shop, product, story, and contact pages adjust the scale for their content.
- **Section title:** Repeated h2 baseline; mobile section headings settle around 32–35px.
- **Body:** The global reading baseline is reduced to 14px on mobile. Authored paragraphs commonly use 12–14px with more generous 1.8–1.95 line height.
- **Product title:** Compact semibold sans-serif caption paired with tabular prices; mobile product captions use 11px.
- **Control:** Button label role; navigation is also semibold sans-serif. Uppercase is reserved for existing identity artwork and the masthead lockup rather than a universal label treatment.

### Named Rules
**The Two Voices Rule.** Use Fraunces for editorial headings and DM Sans for purchase decisions, product metadata, and controls.

## Layout

The desktop section rhythm is 82px vertically with `max(5.3vw, 24px)` horizontal gutters. At widths above 1700px, gutters constrain ordinary section content to approximately 1560px. The header uses its own 4.5vw gutters. Hero copy has a separate 6.5vw inset and an 860px maximum width.

Product grids have four equal columns and 24px gaps. The 1100px breakpoint tightens gaps and navigation, and stacks each product name above its price. At 760px and below the grid becomes two columns with 32px row gaps and 14px column gaps; section padding becomes 55px by 22px. Collection stories, product detail, contact, and brand-story layouts collapse to one column. Do not infer extra intermediate breakpoints.

Desktop product detail uses `1.15fr 1fr` columns separated by 7vw. Main product images and product tiles use contained images, so garments retain their full silhouette. Gallery thumbnails scroll horizontally. Category tabs can scroll horizontally rather than squeezing labels. The bag drawer is at most 490px wide and fills the viewport height.

## Elevation & Depth

Ordinary content and product cards are flat. Tonal image grounds, thin rules, image crops, and photographic shading create most depth. The hero intentionally uses dark directional gradients over the photograph for cream foreground text; this photographic shading is native to the world.

### Shadow Vocabulary
- **Bag edge:** `-10px 0 40px #0a201b26`, applied only to the drawer shell.
- **Mobile menu:** `0 14px 20px #102b2112`, separating the expanded cream navigation from the page below.
- **Swatch check:** `drop-shadow(0 1px 2px #000)`, supporting the white selected-state check over variable merchandise colors.

### Named Rules
**The Quiet Surface Rule.** Keep normal shopping surfaces flat; reserve ambient edge shadows for overlays and selected-state legibility.

## Shapes

Buttons, images, fields, tags, supporting panels, and drawer edges are square. Fine straight rules organize sections and selections. Circles are functional exceptions: product swatches, the bag quantity badge, and the product-image arrow affordance. Supplied round badge artwork retains its own silhouette.

## Components

### Buttons
Confident, square blocks with generous inner space. Primary buttons use forest and cream; the cream variant inverts those colors over photography. Minimum height is 54px, with 17px by 25px padding and a 22px content gap. Hover changes the fill to burnt orange, or warm tan for cream buttons, over 0.25s. Disabled buttons retain the same geometry with reduced opacity and a blocked cursor. Underlined text links provide a quieter secondary action.

### Tags and variant choices
Product tags are square cream labels over image grounds; they communicate bundle or availability information. Size controls use thin rule-colored outlines, with a forest fill and cream text when selected. Unavailable sizes are crossed out and dimmed. Circular color swatches show real merchandise colors and a selected forest outline with a white check. Mobile size and swatch controls expand relative to desktop.

### Cards / Containers
Product cards have no enclosing shell, border, or shadow. Their image grounds use the product neutral family; captions sit below with 18px top space, reduced to 13px on mobile. Images enlarge to 1.045 on hover over 0.7s using the shared easing curve. The arrow circle switches from cream to forest. Artwork-led collection links use broad flat tonal rectangles and a small image rotation on hover.

### Inputs / Fields
Contact fields have a square thin border, translucent white fill, and 13px padding. The catalog search is an open underline field; filters use compact native selects with thin outlines. Newsletter signup, when configured, uses a single underlined email field. Preserve these distinctions rather than imposing a single boxed form treatment.

All interactive elements receive a burnt-orange 2px keyboard focus outline offset by 5px. The skip link becomes visible when focused. Cart errors use a separate warm error strip; errors are text as well as color.

### Navigation
The cream masthead pairs the serif wordmark with semibold sans-serif links and real SVG utility icons. A 1px underline grows from the left on hover and remains for the current page. Below 760px, a menu button reveals a vertical cream navigation panel below the 80px masthead. The bag count remains visible; the desktop search icon and bag word are omitted in this compact layout.

### Bag drawer and accordions
The cream bag drawer slides from the right over 0.35s, with a translucent deep-green backdrop. A fixed heading and checkout area frame a scrolling item list; quantity controls remain outlined and use tabular numbers. Native detail disclosures structure product information and FAQ answers; chevrons rotate 180 degrees when open. Reduced-motion preference removes animations, transitions, and smooth scrolling throughout.

## Do's and Don'ts

### Do:
- **Do** preserve supplied identity artwork and give actual apparel images open, contained space.
- **Do** use Fraunces for editorial headings and DM Sans for shopping and support controls.
- **Do** maintain visible keyboard focus, meaningful selected states, and reduced-motion behavior.
- **Do** use thin rules and pale tonal grounds to structure flat shopping surfaces.

### Don't:
- **Don't** wrap ordinary product cards in extra rounded, shadowed panels.
- **Don't** crop contained merchandise images merely to fill their image ground.
- **Don't** use decorative glyphs in place of the existing SVG utility icons.
- **Don't** extend the tiny masthead and footer lockup text into a general-purpose reading or control scale.

Not canonized: existing masthead lockup and dense footer/metadata text can fall below 11px, especially on mobile. Those local density choices are not a reusable typography role or a legibility target; this documentation pass does not repair UI styling.
