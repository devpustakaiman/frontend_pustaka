# Pustaka Iman — AI Agent Design & UI Implementation Specification

## 0. Document Purpose

This document is the design source of truth for AI agents, designers, and frontend developers working on the Pustaka Iman public website.

The agent must use this document to:

1. understand the product and its technical constraints;
2. translate approved visual references into a consistent UI system;
3. generate wireframes before high-fidelity UI;
4. map UI sections to reusable components;
5. implement the approved design in Next.js + Tailwind CSS;
6. preserve the existing functional architecture while changing the presentation layer.

This document describes **design intent and UI behavior**. It does not replace the backend/database implementation specification.

---

# 1. Product Context

Pustaka Iman is a public-facing publishing/book website with a separate admin area.

The current project architecture specifies:

- Public frontend: Next.js + Tailwind CSS.
- Public deployment target: the client's existing cPanel hosting.
- Static export / SSG is required.
- Cloud backend: Supabase.
- Main public content: books and articles.
- Admin operations: book, article, author, and manuscript-submission management.
- Book purchasing: external MMU/Mizanstore URL, not an internal shopping-cart checkout.
- Book preview: Chapter 1 PDF.
- Manuscript submission: browser upload directly to Supabase Storage.

The project document defines the main database entities as `books`, `articles`, `authors`, and `submissions`. The `books` entity includes `coverUrl`, `pdfPreviewUrl`, `mizanstoreUrl`, and `category`. The `submissions` entity stores manuscript-related information and status. [Source: project plan]

**Confirmed (client, 2026-08-28):** the legacy site's Cart/Checkout menu items are not part of the actual purchase flow — all book purchases go through the external Mizanstore link. Cart and Checkout are therefore excluded from this redesign. See §3.1.

---

# 2. Design Goal

Create a website that feels like a **modern editorial bookstore / publishing house**.

The desired personality is:

- warm;
- trustworthy;
- literary;
- calm;
- premium but not luxurious;
- readable;
- content-focused;
- contemporary without looking like a SaaS dashboard.

The provided visual reference should be treated as **inspiration for visual language, hierarchy, spacing, and composition**, not as a page to clone.

---

# 3. Design Reference Interpretation

The supplied reference image suggests these visual characteristics:

- warm off-white page background;
- large editorial serif headlines;
- neutral sans-serif UI/body typography;
- muted earthy accent color;
- large whitespace;
- book covers as dominant visual objects;
- restrained borders and shadows;
- compact navigation;
- clear CTA hierarchy;
- horizontally organized recommendation/category content.

Use these characteristics as the starting point.

Do NOT copy the exact brand name, text, proportions, imagery, or layout one-to-one from the reference.

## 3.1 Legacy Site Alignment

A screenshot audit of the current live Pustaka Iman site shows a navbar with:

```txt
BERANDA  SHOP▾  PRE ORDER  NAVIGASI BUKU▾  WARTA BUKU▾  KIRIM NASKAH  TENTANG KAMI  KONTAK
```

The legacy SHOP dropdown includes `SEMUA PRODUK`, `MY ACCOUNT`, `CHECKOUT`, `CART`.

**Resolved:** the client confirmed Cart/Checkout are not actual features in use — purchases happen via the external Mizanstore link (`book.mizanstoreUrl`), consistent with the project plan (§14). This redesign therefore:

- keeps `SEMUA PRODUK` (maps to the book catalog page, §13) and `MY ACCOUNT` inside the Shop menu;
- drops `CHECKOUT` and `CART` entirely, from both desktop and mobile navigation;
- keeps all other legacy top-level items (`PRE ORDER`, `NAVIGASI BUKU`, `WARTA BUKU`, `KIRIM NASKAH`, `TENTANG KAMI`, `KONTAK`) as-is, since these are content-driven and don't conflict with the purchase-flow rule.

**Still open — please confirm:** is `MY ACCOUNT` actually used (e.g. for saved/wishlist books, order history from Mizanstore, or manuscript-submission status), or is it also legacy cruft from the same plugin as Cart/Checkout? If it's unused, it should be removed too rather than carried forward as dead UI.

---

# 4. Design Priority

When design decisions conflict, use this priority order:

1. Functional correctness
2. Content readability
3. Information hierarchy
4. Responsive behavior
5. Brand consistency
6. Visual polish
7. Decorative effects

Avoid sacrificing navigation or readability for visual novelty.

---

# 5. Proposed Design System

These values are **initial design proposals**, not immutable brand guidelines. They must be refined once the actual Pustaka Iman logo, banner, imagery, and brand assets are available.

## 5.1 Color Tokens

```txt
background        #FAF8F3
surface           #FFFFFF
text-primary      #272522
text-secondary    #76716A
border            #E7E1D8
accent            #B67A2D
accent-dark       #8D5D20
accent-soft       #F1E8D8
```

Rules:

- Prefer warm neutrals over pure black/white.
- Accent color is primarily for CTA, active state, links, and small highlights.
- Do not introduce multiple unrelated accent colors.
- Use contrast intentionally for accessibility.

## 5.2 Typography

### Display / Editorial

Preferred characteristics:

- serif;
- elegant;
- high readability at large sizes;
- not excessively decorative.

Candidate families:

```txt
DM Serif Display
Cormorant Garamond
Playfair Display
```

### UI / Body

Preferred characteristics:

- neutral sans-serif;
- high readability;
- compact metadata rendering.

Candidate families:

```txt
Inter
Manrope
DM Sans
```

These are candidates only. The final font must be confirmed during visual design.

## 5.3 Typography Scale

```txt
Hero display      64px desktop / 42px mobile
H1                48px desktop / 36px mobile
H2                32px desktop / 26px mobile
H3                22px desktop / 20px mobile
Body              16px
Small             14px
Caption           12px
```

Use generous line-height for editorial headings.

## 5.4 Spacing Scale

Use a predictable spacing system:

```txt
8 / 12 / 16 / 24 / 32 / 40 / 48 / 64 / 80 / 96
```

Do not use arbitrary one-off spacing values unless a specific visual reason exists.

## 5.5 Container

```txt
Desktop max width: 1200–1280px
Desktop side padding: 32px
Mobile side padding: 20px
```

---

# 6. Global Layout Rules

## Desktop

The default page structure should be:

```txt
Navbar
↓
Page content
↓
Section spacing
↓
Footer
```

Use a centered max-width content container.

## Mobile

Prioritize:

- readable typography;
- one-column editorial sections;
- two-column book grids where card content remains legible;
- compact navigation;
- comfortable touch targets;
- no horizontal page overflow.

---

# 7. Information Architecture

```txt
Home (Beranda)
├── Shop
│   ├── Semua Produk (All Products / Catalog)
│   └── My Account (pending confirmation, see §3.1)
├── Pre Order
├── Navigasi Buku
│   ├── Buku Baru (New Books)
│   ├── Best Seller
│   └── Buku Rekomendasi (Recommended Books)
├── Warta Buku (Book News)
│   ├── Liputan (Coverage)
│   ├── Wawancara (Interview)
│   ├── Resensi (Review)
│   └── Event
├── Kirim Naskah (Submit Manuscript)
├── Tentang Kami (About)
└── Kontak (Contact)
```

Notes:

- No Cart/Checkout route exists in this IA — all purchase actions route externally to Mizanstore (§14).
- "Navigasi Buku" and "Warta Buku" are kept in Bahasa Indonesia to preserve continuity with returning visitors and existing brand recognition.
- "Shop" as a top-level label may be renamed to something more editorial (e.g. "Buku" / "Katalog") during visual design — function stays the same regardless of label.

Do not expose internal admin functionality in the public navigation.

---

# 8. Homepage Wireframe Specification

## 8.1 Navbar

### Desktop

```txt
┌────────────────────────────────────────────────────────────────────────────────┐
│ [LOGO]   BERANDA   SHOP▾   PRE ORDER   NAVIGASI BUKU▾   WARTA BUKU▾            │
│                                          KIRIM NASKAH   TENTANG KAMI   KONTAK   │
└────────────────────────────────────────────────────────────────────────────────┘
```

Dropdown — SHOP:

```txt
┌──────────────────┐
│ SEMUA PRODUK      │
│ MY ACCOUNT        │
└──────────────────┘
```

Dropdown — NAVIGASI BUKU:

```txt
┌──────────────────┐
│ BUKU BARU         │
│ BEST SELLER       │
│ BUKU REKOMENDASI  │
└──────────────────┘
```

Dropdown — WARTA BUKU:

```txt
┌──────────────────┐
│ LIPUTAN           │
│ WAWANCARA         │
│ RESENSI           │
│ EVENT             │
└──────────────────┘
```

### Design intent

- Keep navbar visually quiet despite 7 top-level items — use restrained typography and generous spacing rather than shrinking labels illegibly.
- Logo is a strong brand anchor, left-aligned as in the legacy site.
- No cart icon, no cart count badge — purchase CTA lives only on the Book Detail page (§14), linking out to Mizanstore.
- Dropdown chevrons must be visually consistent across all three dropdown menus.
- A dedicated search bar was **not observed** in the legacy navbar screenshots. §13 (Book Catalog) still specifies an in-page search — confirm whether a navbar-level search is actually wanted or whether in-page search under "Semua Produk" is sufficient.

### Mobile

```txt
┌────────────────────────────────────────┐
│ [LOGO]                    [Search] [≡] │
└────────────────────────────────────────┘
```

Mobile menu (expanded, stacked accordions for Shop / Navigasi Buku / Warta Buku):

```txt
BERANDA
SHOP                              ⌄
  Semua Produk
  My Account
PRE ORDER
NAVIGASI BUKU                     ⌄
  Buku Baru
  Best Seller
  Buku Rekomendasi
WARTA BUKU                        ⌄
  Liputan
  Wawancara
  Resensi
  Event
KIRIM NASKAH
TENTANG KAMI
KONTAK
```

---

# 9. Hero Section

## Goal

Immediately communicate that Pustaka Iman is a place to discover books.

## Desktop Wireframe

```txt
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  [Eyebrow / optional]                                         │
│                                                               │
│  Discover Your Next                ┌──────────┐ ┌──────────┐  │
│  Great Read                        │          │ │          │  │
│                                   │  COVER   │ │  COVER   │  │
│  Short supporting copy explaining │          │ │          │  │
│  the collection.                  └──────────┘ └──────────┘  │
│                                                               │
│  [ Explore Books → ]                                          │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Requirements

- Heading: max 2–3 lines.
- Supporting copy: max approximately 2–3 lines.
- One clear primary CTA.
- Book imagery should create visual balance.
- Do not overcrowd the hero with multiple competing actions.

The project plan explicitly identifies the hero/banner as a main public frontend component and notes that banner assets should be obtained from the client.

---

# 10. Featured / Recommended Books

```txt
Recommended for You                             See all →

┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  COVER   │ │  COVER   │ │  COVER   │ │  COVER   │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
Title        Title        Title        Title
Author       Author       Author       Author
Metadata     Metadata     Metadata     Metadata
[Action]     [Action]     [Action]     [Action]
```

## Book Card hierarchy

1. Cover
2. Title
3. Author
4. Supporting metadata
5. CTA

The cover must dominate the card visually.

Avoid placing excessive text beneath a cover.

`[Action]` here should link to the Book Detail page (§14), **not** an "Add to Cart" action.

---

# 11. Category Navigation

```txt
Categories                                    See all →

[ icon ] History
[ icon ] Children
[ icon ] Fiction
[ icon ] Self Improvement
[ icon ] Comics
```

The actual categories must come from product data.

The `books` database entity includes a `category` field, so category UI should be data-driven rather than hard-coded wherever practical.

Note: this may overlap conceptually with "Navigasi Buku" (Buku Baru / Best Seller / Buku Rekomendasi) in the navbar — these are two different taxonomies (genre/category vs. curation status) and should not be visually confused with each other on the homepage.

---

# 12. Articles / News

Preferred visual approach: editorial listing.

```txt
Articles & News                               See all →

┌──────────────────────────────────────────────────────┐
│ [IMAGE]  Article title                               │
│          Short excerpt                               │
│          Author · Date                               │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ [IMAGE]  Article title                               │
│          Short excerpt                               │
│          Author · Date                               │
└──────────────────────────────────────────────────────┘
```

On large screens, this may become an editorial grid.

On mobile, default to stacked cards.

The project defines article fields including title, content, date, author, and image URL.

Note: this section corresponds to "Warta Buku" in the navbar (Liputan / Wawancara / Resensi / Event) — these four labels should map to article categories/tags rather than separate content types, unless the client confirms otherwise.

---

# 13. Book Catalog Page

```txt
Books

[ Search books................................ ] [Category ▼]

[BOOK] [BOOK] [BOOK] [BOOK]
[BOOK] [BOOK] [BOOK] [BOOK]
[BOOK] [BOOK] [BOOK] [BOOK]
```

## Catalog requirements

- Search must be visually obvious.
- Category filtering should not overwhelm the page.
- Keep the book-grid visual language consistent with the homepage.
- The page must support empty and loading states.
- This page is the "Semua Produk" destination from the Shop dropdown (§7, §8.1) — same route, not a separate page.
- No "Add to Cart" button anywhere on this grid — each card routes to Book Detail (§14), where the external purchase link lives.

---

# 14. Book Detail Page

```txt
┌────────────────┬─────────────────────────────────────────────┐
│                │ Category                                    │
│                │                                             │
│    BOOK COVER  │ Book title                                  │
│                │ Author                                      │
│                │                                             │
│                │ Synopsis                                    │
│                │                                             │
│                │ [ Buy Book ] [ Preview Chapter 1 ]          │
└────────────────┴─────────────────────────────────────────────┘

About this book
───────────────────────────────────────────────────────────────

Related books
───────────────────────────────────────────────────────────────
[Book] [Book] [Book] [Book]
```

## Functional rules

### Buy Book

This is the **only** purchase touchpoint on the entire site. It links externally using the stored book URL:

```html
<a href={book.mizanstoreUrl}>
```

No internal checkout/cart path exists anywhere in this design — confirmed aligned with actual site behavior (§3.1).

### Preview Chapter 1

Use the stored PDF preview URL.

The project plan explicitly requires the main purchase CTA to go directly to MMU/Mizanstore and the Chapter 1 preview to open the PDF viewer.

---

# 15. Wishlist Page

```txt
My Wishlist

[Book] [Book] [Book] [Book]

Empty state:

No saved books yet.

[ Explore Books ]
```

Wishlist UI should remain lightweight and content-first.

Note: Wishlist was not observed as a navbar item in the legacy site. Confirm whether this is a new feature being introduced in this redesign, or whether it should be dropped along with Cart — the same "does this actually exist in the current system" question applies here as it did for Cart/Checkout.

---

# 16. Submit Manuscript Page

## Goal

Make manuscript submission feel trustworthy and simple.

```txt
Submit Your Manuscript

Have a manuscript you would like to submit?

[ Full name                         ]

[ Email                             ]

[ Synopsis                          ]
[                                   ]
[                                   ]

[ Upload PDF                        ]

[ Submit Manuscript ]
```

## UX rules

- Keep the form straightforward.
- Explain accepted file type/size near upload control.
- Show upload progress.
- Show success state.
- Show validation errors close to the relevant input.
- Never expose Supabase implementation details to the visitor.

The architecture specifies direct browser upload to Supabase Storage and recording submission information in the `submissions` table.

This maps directly to the "KIRIM NASKAH" navbar item, which is a confirmed top-level item in the legacy site.

---

# 17. Footer

```txt
┌───────────────────────────────────────────────────────────────┐
│ Pustaka Iman                                                  │
│ Short brand statement                                         │
│                                                               │
│ Navigation         Support          Social                    │
│ Beranda            Kontak          Instagram                  │
│ Navigasi Buku       Kirim Naskah    Other links                │
│ Warta Buku          Tentang Kami                               │
│                                                               │
│───────────────────────────────────────────────────────────────│
│ © Pustaka Iman                                                │
└───────────────────────────────────────────────────────────────┘
```

Footer navigation labels updated to match the confirmed IA in §7 (previously used generic "Home / Books / Articles / FAQ" placeholders that didn't match the actual site).

---

# 18. Component System

The implementation should favor reusable components.

Recommended components:

```txt
Navbar
NavDropdown
HeroBanner
BookCard
BookGrid
CategoryItem
CategoryList
ArticleCard
NewsTimeline
SearchBar
FilterBar
PrimaryButton
SecondaryButton
Input
Textarea
FileUpload
EmptyState
LoadingState
ErrorState
PdfPreview
Footer
```

Do not create multiple visually different versions of the same component unless a genuine variant is needed.

`NavDropdown` supports the three dropdown menus (Shop, Navigasi Buku, Warta Buku). No `CartIcon` or `CheckoutFlow` component exists in this system — deliberately, per §3.1/§14.

---

# 19. Component State Requirements

Every interactive component must consider at least:

```txt
Default
Hover
Focus
Active
Disabled
Loading
Error
Empty
```

For data-driven content:

```txt
Loading
Loaded
No data
Request error
```

For forms:

```txt
Empty
Typing
Invalid
Uploading
Submitting
Success
Failure
```

For `NavDropdown` specifically:

```txt
Closed
Open
Open (keyboard-focused item)
```

---

# 20. Responsive Rules

## Desktop ≥ 1024px

- full navbar with all top-level items and dropdowns visible;
- multi-column book grid;
- two-column hero;
- spacious section spacing.

## Tablet 768–1023px

- reduce grid density;
- reduce hero typography;
- simplify navbar spacing — with 7 top-level items, test whether all fit without wrapping at this breakpoint; collapse into a menu earlier if needed;
- preserve hierarchy.

## Mobile < 768px

- compact navbar with hamburger menu;
- dropdowns become stacked accordions inside the mobile menu (§8.1);
- stacked hero;
- 2-column book cards when readable;
- single-column editorial content where necessary;
- minimum comfortable touch target;
- no horizontal page overflow.

---

# 21. Accessibility Requirements

The UI should:

- maintain sufficient color contrast;
- provide meaningful alt text for content images;
- provide visible keyboard focus;
- use semantic headings;
- make button/link labels explicit;
- associate form labels with inputs;
- communicate validation errors clearly;
- communicate upload status;
- avoid relying on color alone to communicate state;
- ensure dropdown menus (Shop, Navigasi Buku, Warta Buku) are operable via keyboard (Enter/Space to open, Arrow keys to navigate items, Escape to close) and expose correct ARIA attributes (`aria-expanded`, `aria-haspopup`).

---

# 22. Motion Guidelines

Motion should communicate interaction, not decoration.

Preferred duration:

```txt
150–250ms
```

Allowed:

- button hover transition;
- subtle book-card hover;
- dropdown open/close transition;
- drawer animation;
- modal/overlay transition;
- subtle section reveal.

Avoid:

- continuous decorative animation;
- excessive parallax;
- bouncing UI;
- animation that delays access to content.

---

# 23. Figma Structure

Create the Figma file using these pages:

```txt
00 — Cover
01 — Foundations
02 — Components
03 — Homepage
04 — Catalog
05 — Book Detail
06 — Articles
07 — Submit Manuscript
08 — Wishlist
09 — Responsive
10 — Prototype
```

## Foundations

```txt
Colors
Typography
Spacing
Grid
Icons
Buttons
Forms
Radius
Shadows
```

## Components

Create reusable variants for:

```txt
Buttons
Book cards
Article cards
Inputs
File upload
Navigation (including dropdown states)
Category item
States
```

---

# 24. Design-to-Code Workflow

The agent must follow this order:

```txt
1. Understand product requirements
2. Extract UI requirements from source documents
3. Review visual references AND legacy site (if one exists)
4. Create information architecture
5. Create low-fidelity wireframe
6. Review and revise wireframe
7. Define design tokens
8. Create high-fidelity UI
9. Map UI to reusable components
10. Implement with Next.js + Tailwind
11. Connect Supabase data
12. Test responsive states
13. Test functional CTA/routing
14. Perform visual QA
```

Do not jump directly from screenshot → production code.

---

# 25. AI Agent Rules

## The agent MUST

- preserve product functionality while changing UI;
- use reusable components;
- use semantic HTML;
- keep mobile behavior explicit;
- preserve the external purchase flow (Mizanstore only, no cart);
- preserve PDF preview behavior;
- preserve manuscript upload flow;
- keep all data-driven UI compatible with Supabase;
- check empty/loading/error states;
- avoid unnecessary dependencies;
- avoid visual inconsistencies between pages;
- flag any remaining ambiguity about legacy features (e.g. "My Account", Wishlist — see §3.1, §15) rather than silently assuming.

## The agent MUST NOT

- invent a shopping checkout system;
- add a cart icon, cart state, or cart route anywhere;
- hard-code book/article data when the feature is intended to be data-driven;
- redesign the database schema as part of a UI task;
- introduce unrelated brand colors;
- copy the reference screenshot literally;
- create different visual rules for every page;
- sacrifice accessibility for aesthetics.

---

# 26. Definition of Done

A public page is considered design-ready when:

- its purpose is clear;
- its hierarchy is documented;
- desktop wireframe exists;
- mobile structure exists;
- required states are defined;
- reusable components are identified;
- data dependencies are known;
- CTA behavior is defined;
- accessibility considerations are covered.

A page is implementation-ready when the above is approved and:

- typography is defined;
- color tokens are defined;
- spacing is defined;
- responsive behavior is defined;
- component variants are defined;
- no critical interaction remains ambiguous;
- open questions in §3.1 and §15 ("My Account", Wishlist) are resolved with the client.

---

# 27. Source-of-Truth Boundary

## Project requirements taken from the provided project plan

The project plan establishes the backend entities, Supabase usage, public Next.js/Tailwind frontend, SSG/static export constraint, main components, book detail behavior, external MMU/Mizanstore purchase link, PDF preview, and manuscript submission flow.

## Legacy site alignment (confirmed)

§3.1, §7, and §8 reflect the actual navigation structure of the current live site, with Cart/Checkout explicitly excluded per client confirmation (2026-08-28). This is now treated as a settled requirement, not an open design proposal.

## Design proposals in this document

The proposed colors, font candidates, spacing scale, component composition, and visual hierarchy are design recommendations derived from the supplied visual reference and should be validated against the client's actual brand assets.

When there is a conflict:

**Client-approved requirements > functional requirements > technical constraints > this design proposal > decorative preference.**
