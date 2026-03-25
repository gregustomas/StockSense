# StockSense

Real-time inventory management system built with Next.js, TypeScript and Firebase.

🔗 **[Live Demo](https://stock-sense-tau.vercel.app/)**

---

## Features

### Dashboard

- Real-time stats — total products, low stock alerts, movements today
- Recent movements table with 7-day filter and pagination
- Low stock products list with pagination
- Movements chart — last 7 days (in/out)
- Quick actions — add product or movement directly from dashboard

### Products

- Full product management — add, edit, delete
- Product detail modal with movement history
- Search by name or SKU
- Filter by category and stock status
- Sort by newest/oldest/name
- Low stock badge when quantity falls below minimum
- Category assignment

### Stock Movements

- Record stock in/out with quantity and note
- Product combobox with search and category grouping
- Atomic batch writes — movement + product quantity updated together
- Stock validation — prevents out movement when quantity is 0
- Movement history per product in product detail

### Categories

- Add, edit, delete categories
- Products assigned to categories

### Users

- User list with roles
- Role assignment — Admin, Manager, Viewer
- Role-based access control throughout the app

### Auth

- Email/Password registration and login
- Zod + React Hook Form validation
- Route protection via layout guards

---

## Role Permissions

| Feature                  | Admin | Manager | Viewer |
| ------------------------ | ----- | ------- | ------ |
| View dashboard           | ✅    | ✅      | ✅     |
| View products            | ✅    | ✅      | ✅     |
| Add/Edit/Delete products | ✅    | ✅      | ❌     |
| View movements           | ✅    | ✅      | ✅     |
| Add movements            | ✅    | ✅      | ❌     |
| Manage categories        | ✅    | ❌      | ❌     |
| Manage users             | ✅    | ❌      | ❌     |

---

## Tech Stack

- **Framework** — Next.js 15 (App Router)
- **Language** — TypeScript (strict mode)
- **Database** — Firebase Firestore (real-time)
- **Auth** — Firebase Authentication
- **Styling** — Tailwind CSS + shadcn/ui
- **Validation** — Zod + React Hook Form
- **Animations** — Framer Motion
- **Charts** — Recharts

---

## Local Development

```bash
git clone https://github.com/gregustomas/StockSense.git
cd stock-sense
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

```bash
npm run dev
```

---

Built by [Tomáš Greguš](https://github.com/gregustomas)
