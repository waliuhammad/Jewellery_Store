# Admin Panel Build Prompt for Antigravity

**Project:** Aurelle Jewels (placeholder brand name) — Admin Panel
**Companion files:** `PRD_Jewelry_Ecommerce.md`, `Design.md`
**Stack:** React (Vite) + Tailwind CSS + Framer Motion, Node.js (Express), Firebase (Auth, Firestore, Storage)

---

## How to use this file

1. Put `PRD_Jewelry_Ecommerce.md` and `Design.md` in your project root, next to this file.
2. Open Antigravity and paste **everything below the line "START OF PROMPT"** as your first message.
3. If Antigravity produces a plan first, approve it, then let it build phase by phase (Section 14).
4. If the output drifts from the design, paste Section 3 (Design Tokens) and Section 4 (Layout) again and ask it to fix the specific page.

---

## START OF PROMPT

You are a senior full-stack engineer and product designer. Build a complete, production-quality **Admin Panel** for a **jewelry e-commerce store** that already has a storefront specified in `PRD_Jewelry_Ecommerce.md` and `Design.md`. Read both files first, then follow this prompt.

I am attaching reference screenshots of an admin panel I like. **Copy the structure, pages, features and information layout from the screenshots, but do NOT copy their colors, content or products.** The screenshots are from a home-decor store with an olive-green and tan palette. Mine is a **jewelry store** and must use the **Champagne and Rose palette** defined in Section 3. Replace all home-decor sample data with jewelry data.

### 1. Goal

Create a private, secure, beautiful back-office where store staff can manage products, categories, orders, payments, customers, coupons, reviews, messages, site content, settings and team members. It must feel like it belongs to the same brand as the storefront: warm, calm, editorial, refined. It must **not** look like a generic dashboard template.

### 2. Hard Requirements

- **Route:** admin lives under `/admin` (login at `/admin/login`). It is **not linked anywhere on the public storefront** (no footer link, no header link). Add `<meta name="robots" content="noindex, nofollow">` on all admin pages.
- **Auth:** Firebase Authentication (email and password). Only users listed in the `staff` collection with an active role may enter. Everyone else is signed out and shown a polite "Access denied" screen.
- **Roles:** Administrator, Store Manager, Support Agent, enforced **both** in the UI and on the server (Section 8).
- **Currency:** display as `Rs.` with thousands separators (for example `Rs.7,250`). Keep the currency symbol in one config constant.
- **Responsive:** fully usable on desktop, tablet and phone. The sidebar becomes a slide-in drawer below 1024px.
- **No clipped content.** In the screenshots, some stat numbers overflow their cards and some table columns are cut off at the right edge (for example action buttons and status columns). Avoid that completely: tables scroll horizontally inside their own container with a sticky first column on small screens, and numbers use fluid font sizing so they never overflow.
- **Sidebar navigation must scroll independently** if the screen is short, while the user card (name, role, Back to Store, Sign Out) stays pinned at the bottom. In the screenshots the nav items get cut off behind the user card. Do not repeat that bug.
- Use **real data from Firestore through the Node API**, with a seed script for realistic jewelry sample data so every screen looks complete during development.
- Every screen needs designed **loading (skeleton), empty, error and success** states.

### 3. Design Tokens (Use These Exactly)

#### 3.1 Colors — "Champagne and Rose"

| Token | Hex | Use in admin |
|---|---|---|
| `ivory` | `#FBF8F3` | Page background |
| `paper` | `#FFFDFA` | Cards and panels (very slightly warmer than pure white) |
| `cream` | `#F5EEE4` | Table headers, input fills, hover rows, skeletons |
| `champagne` | `#E7D3B5` | Chips, tab highlights, soft borders on dark |
| `blush` | `#F1DDD6` | Active sidebar item background, hover fills, soft badges |
| `rose` | `#C98C7A` | Secondary accent, chart series, small highlights |
| `gold` | `#B8924A` | The accent word in page titles, chart series, progress bars, focus ring |
| `ink` | `#2B2522` | Text, primary buttons, logo tile |
| `taupe` | `#6E625A` | Secondary text, table header text, captions |
| `noir` | `#1C1917` | Dark summary card, dark ledger table |
| `hairline` | `#E4D9CB` | 1px borders and dividers |
| `sage` | `#6F8F72` | Success (Paid, Delivered, In stock, Active) |
| `garnet` | `#A33B3B` | Danger (Cancelled, Block, Sign Out, Out of stock) |

**Order and payment status chips (soft background plus readable text):**

| Status | Background | Text |
|---|---|---|
| Pending | `#F6E9CF` | `#8A6A1F` |
| Confirmed | `#F1DDD6` (blush) | `#8A4F40` |
| Packed | `#EAE2D6` | `#5A4E44` |
| Shipped | `#E4EBE3` | `#4C6A4F` |
| Out for delivery | `#E7D3B5` (champagne) | `#2B2522` |
| Delivered / Paid / Active | `#DDE9DE` | `#3F6B45` |
| Cancelled / Failed / Blocked | `#F3D9D6` | `#A33B3B` |
| Returned / Refunded | `#E4D9CB` | `#5A4E44` |

**Do not use** olive green, blue, purple, bright red or any color outside this palette. No gradients except a very soft ivory-to-cream wash. No neon.

#### 3.2 Typography

- **Page titles and card headings:** Cormorant Garamond, weight 600. Page titles follow the screenshot pattern: the word **"Store"** in `ink` followed by one accent word in `gold` (for example "Store **Orders**", "Store **Inventory**", "Store **Insights**"). Size 44px desktop, 32px mobile.
- **Subtitle under title:** Cormorant Garamond *italic*, 18px, `taupe`.
- **Body, tables, forms, buttons:** Montserrat 400 and 500, 14px.
- **Table headers and small labels:** Montserrat 500, 11-12px, uppercase, letter-spacing `0.12em`, `taupe`.
- **Numbers, order IDs, slugs:** a monospace (JetBrains Mono or IBM Plex Mono), 13px, for order numbers, transaction IDs and slugs only.
- **Big stat numbers:** Montserrat 600 (or Cormorant 600), fluid size `clamp(22px, 2.2vw, 32px)`, `white-space: nowrap`, never overflowing.

#### 3.3 Shape, spacing, elevation
- Radius: cards 8px, inputs and buttons 6px, chips and filter pills fully rounded. (Slightly softer than the storefront because this is a working tool.)
- Borders: 1px `hairline`. Shadows only on floating layers (drawer, dropdown, modal): `0 12px 40px rgba(43,37,34,0.08)`.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64. Content padding 32px desktop, 16px mobile. Card padding 24px.
- Icons: **Lucide**, stroke 1.5, 20px. One style only. No emoji.

#### 3.4 Buttons
- **Primary:** `ink` background, `ivory` text, 44px tall; hover: `gold` background with `ink` text. Used for New Product, New Category, New Coupon, Add Member, Save Changes, Sign In.
- **Secondary:** transparent, 1px `ink` border; hover `blush` fill.
- **Export CSV:** `noir` background, `ivory` text (matches the dark button in the screenshots).
- **Danger:** `garnet` text on `#F3D9D6` background; hover darker fill. Used for Block, Delete, Sign Out.
- All buttons have a visible 2px `gold` focus ring with 2px offset, loading state with a small spinner, and disabled state at 45% opacity.

### 4. Layout

#### 4.1 Admin shell

```
┌──────────────┬───────────────────────────────────────────────────────┐
│ Sidebar 280px│  Top area (mobile: hamburger + title)                 │
│ (paper, 1px  │  ┌─────────────────────────────────────────────────┐  │
│  right border│  │ Page title (Store + gold word)      [Primary btn]│  │
│              │  │ italic subtitle                                  │  │
│  Logo tile   │  └─────────────────────────────────────────────────┘  │
│  Brand       │  Page content (cards, tables) on ivory background     │
│  ADMIN PANEL │                                                       │
│  • V1.0      │                                                       │
│              │                                                       │
│  NAV (scroll)│                                                       │
│  ──────────  │                                                       │
│  User card   │                                                       │
│  Back to Store                                                       │
│  Sign Out    │                                                       │
└──────────────┴───────────────────────────────────────────────────────┘
```

**Sidebar details (copy structure from screenshots):**
- Top: rounded-square logo tile (`ink` background, `ivory` serif initial of the brand), brand name in uppercase with the second word in `gold`, small caption "ADMIN PANEL • V1.0" in `taupe`.
- Navigation items, in this order, each with a Lucide icon and label:
  1. Overview (`layout-dashboard`)
  2. Products (`gem`)
  3. Categories (`tags`)
  4. Orders (`shopping-bag`)
  5. Transactions (`credit-card`)
  6. Customers (`user`)
  7. Coupons (`ticket-percent`)
  8. Reviews (`star`)
  9. Messages (`message-square`, with a small `gold` dot or count badge for unread)
  10. Site Content (`file-text`)
  11. Settings (`settings`)
  12. Team and Roles (`users`)
- Active item: `blush` background, `ink` text, a 3px `gold` bar on the left edge. Hover: `cream` background.
- Items the current role cannot access are **hidden**, not disabled.
- Bottom (pinned): user name (bold), role label (`taupe`), then "Back to Store" (chevron icon, links to the storefront) and "Sign Out" in `garnet`.
- Collapsed mobile drawer: slides from the left with a dark scrim.

**Page header pattern (every page):** title with gold accent word on the left, italic subtitle below, and the page's primary action button aligned to the right (wraps below the title on mobile).

#### 4.2 Shared components to build once and reuse
`PageHeader`, `StatCard`, `DataTable` (sortable, searchable, pagination, sticky header, horizontal scroll container, row hover, empty state), `FilterPills` (with count badges), `SearchInput`, `SelectInput`, `StatusChip`, `ConfirmDialog`, `Drawer` (for forms, slides from right, 560px), `Modal`, `ImageUploader` (drag and drop, preview, progress), `Toast`, `Skeleton`, `EmptyState`, `Tabs` (pill style), `Toggle`, `Badge`, `Breadcrumb`, `DateRangePicker` (simple), `Pagination`.

### 5. Pages (Build Every One)

#### 5.1 Admin Login (`/admin/login`)
Mirrors the screenshot structure, restyled:
- Centered on an `ivory` page with a very soft cream wash.
- Small pill badge at top: shield icon plus "STAFF ONLY" (champagne background, uppercase, wide tracking).
- Large heading "ADMIN **PORTAL**" (Cormorant, "PORTAL" in `gold`) and a one-line subtitle: "Not a customer page. This is where the store is managed from."
- Card (`paper`, hairline border, soft shadow): lock icon in a `cream` rounded square, heading "Admin Portal", subtitle "Sign in to manage products, orders and stock."
- Email and password fields (cream fill, hairline border, gold focus), show/hide password eye, full-width **Sign In →** primary button.
- Inline error messages (wrong password, not authorized, too many attempts), rate-limit friendly copy.
- **Do not show the public storefront header and footer on this page.** (The screenshot shows them; remove them. The login page is standalone with only a small "Back to Store" text link.)
- Subtle entrance animation: card rises 16px and fades in over 600ms.

#### 5.2 Overview — "Store **Insights**"
- Header badge next to the title: green dot plus "DATABASE: CONNECTED" (shows live Firestore connectivity; turns `garnet` with "OFFLINE" if it fails).
- Top-right small card: **Revenue Received**.
- **Four stat cards**, each with an icon tile (soft tinted background from the palette, not blue/purple), a small corner tag, a label and a large number:
  1. Revenue Received (tag: PAID)
  2. Total Orders (tag: "n PENDING")
  3. Units in Stock (tag: "n PRODUCTS")
  4. Registered Users (tag: ACCOUNTS)
- **Sales chart card** "Last 7 Days Sales": combined chart with revenue (bars or line in `ink`) and order count (line in `gold`), a 7 / 30 day toggle, tooltips, and a friendly empty state. Use Recharts. Style axes lightly with `taupe` labels and hairline gridlines. (The screenshot's chart looked broken with floating dots; make a proper readable chart.)
- **Store Summary card** (dark `noir`, `ivory` text, values in `champagne`): Revenue Received, Pending Orders, Products, Low-stock count, Unread Messages.
- Below: **Recent Orders** (5 rows) and **Low Stock** list (items at or under the threshold), each with a "View all" link.
- Stat numbers animate counting up once on load (600ms).

#### 5.3 Products — "Store **Inventory**"
- Primary button: **+ New Product**.
- Toolbar inside the card: search field ("Search products…") and "All Categories" dropdown, plus a stock filter (All, In stock, Low stock, Out of stock) and a status filter (Active, Draft).
- Table columns: **Product** (56px rounded thumbnail, name, small mono ID/slug), **Category** (chip), **Price** (with struck-through compare-at price when present), **Stock** (thin progress bar plus "25 in stock", bar color: `sage` healthy, `champagne` low, `garnet` out), **Status** (Active/Draft toggle), **Actions** (edit pencil, duplicate, delete with confirm).
- Row click or pencil opens the **Product Drawer** form.
- **Product form fields:** name, slug (auto-generated from name, editable, uniqueness validated), category, short description, full description (simple rich text or textarea with line breaks), price, compare-at price, material, finish/plating, occasion (multi-select: Everyday, Gifting, Festive, Bridal), tags, **variants** (repeatable rows: label such as size/length/finish, SKU, stock, optional price override), low-stock threshold, **images** (multiple upload, drag to reorder, first image is primary, alt text per image, max 8), flags (Active, Featured, New, Bestseller). Sticky footer with Save and Cancel; unsaved-changes warning.
- Bulk actions: select rows to activate, deactivate, change category or delete.
- Pagination (20 per page) and sortable columns.

#### 5.4 Categories — "Store **Categories**"
- Primary button: **+ New Category**.
- Grid of cards (2 columns desktop, 1 mobile): rounded image thumbnail, category name (serif), "47 Products • slug" line. Hover shows edit and delete icons; drag handle to reorder.
- Category drawer: name, slug, description, image upload, active toggle.
- Deleting a category with products is blocked with a clear message, offering to reassign.
- Seed jewelry categories: Rings, Necklaces, Earrings, Bracelets and Bangles, Sets.

#### 5.5 Orders — "Store **Orders**"
- Subtitle: "Process and track customer orders".
- Filter pills with counts: **All, Pending, Confirmed, Packed, Shipped, Out for delivery, Delivered, Cancelled, Returned** (horizontally scrollable on mobile; do not clip) plus a search field ("Order #, name, phone…") that is fully visible, not cut off.
- Each order is an **expandable card**: package icon tile, mono order number, status chip, payment chip (for example "CASH ON DELIVERY · PENDING" or "PAID"), customer name, date and time, item count, **Total** aligned right, chevron to expand.
- **Expanded view:** item list with thumbnails, variant, quantity and price; customer contact (phone, email, with tap-to-call and WhatsApp buttons); shipping address; payment details (method, status, transaction ID, uploaded receipt with preview and **Approve / Reject** buttons for bank transfer and wallet payments); order notes and gift-wrap flag; status history timeline; courier name, tracking number and tracking link fields.
- **Actions:** status dropdown to advance the order (with confirmation and optional note), mark payment as Paid, cancel order (restores stock), print invoice and packing slip (print-friendly page), send status email to customer (automatic, with a toggle).
- Status changes append to `statusHistory` with the staff member's name and time.
- "Decline guest order" action for suspicious COD orders (as mentioned in the customers page footnote).

#### 5.6 Transactions — "Store **Ledger**"
- Subtitle: "Payments across Cash on Delivery, JazzCash, EasyPaisa and Bank Transfer".
- **Export CSV** button (dark).
- Four stat cards: **Total Volume**, **Received** (`sage` label), **Awaiting Payment** (`gold` label), **Avg Paid Order**.
- A **dark ledger table** (`noir` background, `ivory` text, `champagne` order numbers in mono) with search ("Order #, customer or TID…"), a method filter (All methods, Cash on Delivery, JazzCash, EasyPaisa, Bank Transfer), and a date range filter.
- Columns: Order, Customer, Method / TID, Date, Amount, Status (chip) and a row action to mark paid or open the order.
- Make sure all columns fit or scroll inside the container without clipping the Status column.

#### 5.7 Customers — "Store **Customers**"
- Subtitle: "Registered customer accounts and their order history". **Export CSV** button.
- Three stat cards: **Registered**, **With Orders**, **Guest Orders**.
- Search ("Name, email or phone…") and a table: Customer (name and email), Joined, Orders, Spent, Status (Active/Blocked chip) and a **Block / Unblock** action (danger style, always fully visible).
- Click a customer to open a drawer with profile, saved addresses, order history and lifetime spend.
- Footnote below the table (small, centered, `taupe`): "Blocking stops a signed-in account from ordering and reviewing. Someone could still check out as a guest, so decline those orders from the Orders page."

#### 5.8 Coupons — "Store **Coupons**"
- Subtitle: "Discount codes customers can enter at checkout". Primary button **+ New Coupon**.
- Table: Code (mono), Discount (percent or fixed Rs.), Min. Order, Expires, Used (count / limit), Status (Active/Expired/Disabled toggle), Actions.
- Empty state: "No coupons yet." with a small illustration or icon and a button.
- Coupon drawer: code (auto-generate option), type (percentage or fixed), value, minimum order, max discount cap (for percentage), usage limit total and per customer, start and end dates, applies to (all, selected categories), active toggle. Validate uniqueness.

#### 5.9 Reviews — "Store **Reviews**"
- Subtitle: "Moderate product reviews from verified customers".
- Summary card: average rating (big number with gold stars) and "n reviews across all products". Filter pills: **All, Pending, Approved, 1–2 stars, 3 stars, 4–5 stars**.
- Review list: product thumbnail and name, star rating, title, text, reviewer, date, photos. Actions: Approve, Hide, Delete, and **Reply** (public store reply).
- Empty state: "No reviews to show."

#### 5.10 Messages — "Store **Inbox**"
- Subtitle: "Customer messages and newsletter subscribers".
- Pill tabs: **Messages (n new)** and **Subscribers (n)**.
- Messages table: Read (circle that fills when read), Sender (name and email), Subject, Date. Click opens a side panel with the full message, a **Reply by email** button (mailto), a **WhatsApp** button if a phone is provided, mark read/unread and delete.
- Subscribers tab: email, date subscribed, status; **Export CSV** and remove action.
- Unread count syncs with the sidebar badge.

#### 5.11 Site Content — "Site **Content**"
- Subtitle: "Edit the text customers see. Changes go live when you save." Primary button **Save Changes** (disabled until something changes; shows saved toast).
- Pill tabs: **Contact and Footer, FAQ, About Page, Product Tabs**.
  - **Contact and Footer:** phone, WhatsApp (international format, helper text with example), email, address (one line per row), footer tagline, social links (Instagram, Facebook, TikTok), business hours, announcement bar text and on/off toggle.
  - **FAQ:** grouped repeatable Q and A items, drag to reorder, add and delete.
  - **About Page:** hero statement, story paragraphs, values (three numbered items), images.
  - **Product Tabs:** default content for Care Guide, Shipping and Returns, Size Guide tables (ring sizes, bangle sizes, chain lengths).
- Show a "Last saved by NAME at TIME" line. Keep a simple version history (last 10 versions with restore).

#### 5.12 Settings — "Store **Configuration**"
- Subtitle: "Manage global store settings and content".
- Two-column grid of cards, each with an icon tile, serif heading, helper text and its own Save button:
  1. **Shipping Rules:** Standard Shipping Fee (Rs.), Free Shipping Threshold (Rs.), with a live preview line ("Preview: Rs.250 shipping on every order." or "Free shipping above Rs.5,000"). Helper text as in the screenshot.
  2. **JazzCash and EasyPaisa:** for each wallet, Account Number and Account Title. Helper: "Customers see these details at checkout. Leave the number empty to hide that payment option. Cash on Delivery is always available."
  3. **Bank Transfer:** bank name, account title, account number, IBAN, branch.
  4. **Order and Stock:** low-stock threshold, order number prefix, enable guest checkout toggle, prepaid discount percentage (incentive for non-COD payments), gift-wrap fee.
  5. **Notifications:** store owner email, toggles for new order alert, new message alert, low-stock alert, and customer emails (placed, confirmed, shipped, delivered).
  6. **Store Info:** store name, logo upload, currency symbol, timezone.
- Only Administrators can change Settings.

#### 5.13 Team and Roles — "Store **Team**"
- Subtitle: "Manage your team and roles". Primary button **Add Member** (user-plus icon).
- Three role cards across the top: **Administrator** (everything including settings, team and deleting orders), **Store Manager** (products, categories, orders, transactions and messages), **Support Agent** (orders and customer messages).
- Team table: Name (with "you" tag for current user), Email, Role, Joined, Status, Actions (change role, deactivate, remove). The table must not clip the Joined column.
- Add Member drawer: name, email, role, temporary password or "send invite email". Creating a member creates a Firebase Auth user, sets custom claims and a `staff` document.
- Safety rules: you cannot remove or demote yourself; the last remaining Administrator cannot be removed.

### 6. Animations and Interaction (Subtle, Fast, Purposeful)

An admin tool should feel smooth but never slow. Use Framer Motion.
- Page transition: fade plus 8px rise, 250ms.
- Stat cards: stagger in 60ms apart, numbers count up once.
- Tables: rows fade in with 20ms stagger on first load only; row hover background transition 150ms.
- Order cards: expand and collapse with animated height (300ms) and rotating chevron.
- Drawers: slide from right 350ms with scrim fade; modals fade and scale from 0.98.
- Sidebar active indicator slides between items (shared layout animation).
- Buttons: fill sweep on hover (250ms). Toasts slide up and fade.
- Skeleton shimmer in `cream` to `champagne` while loading.
- Respect `prefers-reduced-motion` (turn off everything except simple fades).
- Do not use bouncing, spinning or flashy effects.

### 7. Data Model (Firestore)

Use the collections already defined in the PRD and add these for admin:

- `staff/{uid}`: `name, email, role ('admin' | 'manager' | 'support'), active, createdAt, lastLoginAt`
- `products`, `categories`, `orders`, `reviews`, `coupons`, `contactMessages`, `newsletter`, `users` (customers), `settings/store` (see PRD)
- `siteContent/main`: `{ contact, footer, faq[], about, productTabs, updatedAt, updatedBy }` and `siteContentVersions/{id}` for history
- `auditLogs/{id}`: `{ actorUid, actorName, action, entityType, entityId, summary, at }` written by the server for every admin write (create, update, delete, status change, role change)
- Orders keep `statusHistory[{status, at, byUid, byName, note}]`, `paymentStatus`, `paymentMethod`, `transactionId`, `receiptUrl`, `courier{}`.
- Customers have `blocked: boolean`.

Seed script (`/server/scripts/seedAdminDemo.js`): 5 jewelry categories, 24 products (rings, necklaces, earrings, bracelets, sets with realistic names, Rs. prices, material and finish, variants, stock), 12 orders across all statuses and payment methods over the last 14 days, 8 customers, 4 messages, 5 subscribers, 6 reviews, 3 coupons, one admin staff user. Use warm placeholder images (solid champagne/blush blocks with the product name) if no images exist.

### 8. Roles and Permissions (Enforce in UI and API)

| Area | Administrator | Store Manager | Support Agent |
|---|---|---|---|
| Overview | View | View | View (limited cards) |
| Products | Full | Full | No access |
| Categories | Full | Full | No access |
| Orders | Full (including delete) | Create/update, no delete | Update status, notes and tracking only |
| Transactions | Full | View and mark paid | No access |
| Customers | Full | View | View |
| Coupons | Full | Full | No access |
| Reviews | Full | Full | No access |
| Messages | Full | Full | Full |
| Site Content | Full | No access | No access |
| Settings | Full | No access | No access |
| Team and Roles | Full | No access | No access |

If someone opens a URL they are not allowed to see, show a calm "You do not have access to this page" screen with a button back to Overview.

### 9. API (Node/Express) — Admin Endpoints

All under `/api/v1/admin/*`. Every request must:
1. Verify the Firebase ID token with the Admin SDK.
2. Load the `staff` document and confirm `active === true`.
3. Check the role against a central permission map (a single `permissions.js` file used by middleware).
4. Validate input with Zod or Joi and sanitize.
5. Write an `auditLogs` entry for any change.

Endpoints (REST): `GET /overview`, `GET/POST/PUT/DELETE /products`, `POST /products/:id/images`, `GET/POST/PUT/DELETE /categories`, `PUT /categories/reorder`, `GET /orders`, `GET /orders/:id`, `PUT /orders/:id/status`, `PUT /orders/:id/payment`, `PUT /orders/:id/tracking`, `DELETE /orders/:id`, `GET /transactions` and `GET /transactions/export`, `GET /customers`, `GET /customers/:id`, `PUT /customers/:id/block`, `GET /customers/export`, `GET/POST/PUT/DELETE /coupons`, `GET /reviews`, `PUT /reviews/:id`, `DELETE /reviews/:id`, `GET /messages`, `PUT /messages/:id/read`, `DELETE /messages/:id`, `GET /subscribers` and `GET /subscribers/export`, `GET/PUT /site-content`, `GET/PUT /settings`, `GET/POST/PUT/DELETE /team`.

Response shape: `{ success, data, error: { code, message } }`. Pagination via `?page=&limit=&sort=&q=`.

### 10. Security Requirements
- Firestore security rules: deny all client reads and writes to `staff`, `auditLogs`, `orders`, `settings`, `siteContent` (admin API only, through the Admin SDK), while allowing public reads where the storefront needs them.
- Set Firebase **custom claims** for roles and re-check the `staff` document server-side on every request.
- Rate limit the login attempts and admin API; `helmet`; strict CORS allow-list; HTTPS only.
- Never expose service account keys to the client; use `.env` and provide `.env.example`.
- File uploads: images only (JPG, PNG, WebP, max 5 MB each), receipt files (JPG, PNG, PDF, max 5 MB); sanitize file names.
- Session timeout after 8 hours of inactivity with a friendly re-login prompt.
- Confirm dialogs for all destructive actions.
- Mask sensitive data (bank account numbers) with a "show" toggle.

### 11. Accessibility and Quality
- Keyboard accessible everywhere, visible gold focus rings, labelled inputs, `aria-live` for toasts and errors, focus trap in drawers and modals.
- Text contrast at WCAG AA or better using the palette. Do not use `gold` or `rose` for small text on `ivory` or `paper`; use them for large text, lines, icons and fills.
- Icon-only buttons have `aria-label`.
- Tables use proper `<th scope>` and are usable by screen readers.
- Test layouts at 360px, 768px, 1024px and 1440px; no horizontal page scroll.

### 12. Project Structure

```
/admin                      (inside the existing React app, lazy-loaded route group)
  /layouts       AdminShell, Sidebar, MobileDrawer, PageHeader
  /pages         Login, Overview, Products, Categories, Orders, Transactions,
                 Customers, Coupons, Reviews, Messages, SiteContent, Settings, Team, NoAccess
  /components    StatCard, DataTable, FilterPills, StatusChip, Drawer, Modal,
                 ConfirmDialog, ImageUploader, Toast, Skeleton, EmptyState, Tabs, Toggle
  /hooks         useAuth, usePermissions, useAdminQuery, useDebounce
  /lib           api.js, permissions.js, format.js (currency, dates), csv.js
  /styles        tokens (follow Section 3)
/server/src
  /routes/admin  one file per area
  /middleware    verifyToken, requireRole, validate, audit
  /services      orders, inventory, email, csv
/server/scripts  seedAdminDemo.js
```

Use TanStack Query for data fetching and caching, React Hook Form with Zod for forms, date-fns for dates, Recharts for charts, Lucide for icons. Load the admin code lazily so it does not slow down the storefront bundle.

### 13. What NOT to Do
- Do not copy the olive green, blue, purple or red styling from the screenshots.
- Do not keep any home-decor content (living room, bedroom, wall stickers and so on). Everything is jewelry.
- Do not show the storefront header and footer inside the admin panel or on the admin login page.
- Do not add an "Admin Panel" link to the public site.
- Do not use generic dashboard templates, glassmorphism, gradient text, or emoji icons.
- Do not leave lorem ipsum or placeholder text.
- Do not let numbers, tables or buttons clip or overflow.
- Do not trust client-side role checks alone.

### 14. Build Order (Work Phase by Phase and Confirm Each Phase Works)

1. **Foundation:** Tailwind tokens, fonts, admin route group, `AdminShell` with sidebar and mobile drawer, shared components, toast and skeleton system.
2. **Auth and roles:** admin login page, Firebase Auth, `staff` check, `usePermissions`, protected routes, No Access screen, server `verifyToken` and `requireRole` middleware, audit logging.
3. **Overview** with live stats, chart and summary.
4. **Products and Categories** with image upload and the product drawer.
5. **Orders and Transactions** including status flow, payment approval, receipts, invoice print view and CSV export.
6. **Customers, Coupons, Reviews, Messages.**
7. **Site Content and Settings** (with version history).
8. **Team and Roles.**
9. **Seed script, empty/error states, animations pass, responsive pass, accessibility pass.**
10. **Final QA** against the checklist below.

### 15. Acceptance Checklist (Verify Before Saying "Done")

- [ ] Every page in Section 5 exists, works with real API data and matches the screenshot structure
- [ ] Only the Champagne and Rose palette is used; titles use the "Store + gold accent word" pattern
- [ ] Cormorant Garamond headings and Montserrat body are loaded and applied
- [ ] Sidebar nav scrolls independently; user card and Sign Out stay visible
- [ ] No clipped stat numbers, table columns, filter pills or buttons at any width
- [ ] Role permissions work in the UI **and** the API (test each role)
- [ ] Orders: all statuses, payment approval with receipt, tracking, stock restore on cancel
- [ ] CSV export works for Transactions, Customers and Subscribers
- [ ] Settings and Site Content changes show up on the storefront
- [ ] Loading, empty, error and success states on every screen
- [ ] Animations are subtle, and `prefers-reduced-motion` is respected
- [ ] No link to the admin area exists on the public storefront
- [ ] Lighthouse accessibility 90+ on admin pages
- [ ] Seed script produces a complete, realistic jewelry dataset

Start by summarizing your plan in 10 lines or fewer, then begin Phase 1 immediately without waiting for me to answer questions. If something is ambiguous, choose the most reasonable option, note your assumption in a short list at the end, and keep going.

## END OF PROMPT
