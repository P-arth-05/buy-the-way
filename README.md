# 🛍️ Buy The Way

**A full-stack multi-vendor e-commerce platform** where customers can browse and buy products, vendors can list and manage inventory, and admins oversee the entire marketplace.

---

## 📸 User Roles

| Role | Capabilities |
|---|---|
| 🛒 **Customer** | Browse products, manage cart, checkout with Razorpay, track orders |
| 🏪 **Vendor** | List products, manage inventory, track orders on their products |
| 🔑 **Admin** | Approve/reject products, manage users, view reports, create discounts |

---

## 🧰 Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool |
| React Router DOM v6 | Client-side routing |
| Tailwind CSS + shadcn/ui | Styling and UI components |
| Supabase JS SDK | Authentication (login/register) |
| Axios | HTTP client for API calls |
| React Hook Form + Zod | Form handling and validation |
| Recharts | Data visualisation (admin reports) |
| Framer Motion | Animations |

### Backend
| Tech | Purpose |
|---|---|
| Spring Boot 3.3.2 (Java 17) | REST API framework |
| Spring Data JPA + Hibernate | ORM and database access |
| PostgreSQL | Relational database |
| Spring Security + OAuth2 Resource Server | JWT validation |
| Supabase | Auth provider (JWKS endpoint) |
| Razorpay Java SDK | Payment processing |
| Spring Mail (Gmail SMTP) | Email notifications |
| Lombok | Boilerplate reduction |
| Selenium | E2E smoke tests |

---

## 🗂️ Project Structure

```
buy-the-way/
├── frontend/                        # React + Vite SPA
│   └── src/
│       ├── pages/
│       │   ├── LandingPage/         # Hero, About, CTA sections
│       │   ├── customer/            # Shop, Cart, Checkout, Orders, Profile
│       │   ├── vendor/              # Dashboard, Products, Inventory
│       │   └── admin/               # Dashboard, Approvals, Reports, Discounts
│       ├── components/
│       │   ├── layout/              # CustomerLayout, DashboardLayout, Navbars
│       │   ├── product/             # ProductCard
│       │   ├── shared/              # StatCard
│       │   └── ui/                  # shadcn/ui component library
│       ├── contexts/                # AuthContext, CartContext, VendorContext
│       ├── lib/                     # apiClient, productApi, orderApi, userApi
│       └── hooks/                   # useLogout, use-mobile, use-toast
│
└── backend/                         # Spring Boot REST API
    └── src/main/java/com/buytheway/
        ├── modules/
        │   ├── auth/                # TestController
        │   ├── cart/                # Cart CRUD
        │   ├── discount/            # Promo codes
        │   ├── notification/        # Email service
        │   ├── order/               # Order lifecycle
        │   ├── payment/             # Razorpay integration
        │   ├── product/             # Product catalog + approvals
        │   └── user/                # User profiles
        ├── security/                # SecurityConfig, JWT utilities
        ├── config/                  # CORS, WebClient
        └── common/                  # ApiResponse, GlobalExceptionHandler
```

---

## 🔐 Authentication Flow

Authentication is handled entirely by **Supabase**. The backend never issues or stores tokens — it only validates them.

```
User logs in → Supabase issues JWT
→ Frontend stores JWT in AuthContext
→ Every API request sends: Authorization: Bearer <jwt>
→ Spring Security validates JWT against Supabase JWKS endpoint
→ userId (UUID) is extracted from the token's "sub" claim
```

The backend is configured as an **OAuth2 Resource Server** with Supabase's public key set:
```
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=
  https://<project>.supabase.co/auth/v1/.well-known/jwks.json
```

---

## 🔌 API Reference

### Products — `/api/products`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | Public | All products |
| GET | `/api/products/approved` | Public | Only approved products |
| GET | `/api/products/{id}` | Public | Single product by ID |
| GET | `/api/products/count` | — | Total product count |
| GET | `/api/products/category/{cat}` | — | Approved products by category |
| GET | `/api/products/vendor/{vendor}` | Auth | Products by vendor |
| GET | `/api/products/search?keyword=` | — | Search approved products by name |
| POST | `/api/products` | Auth | Create product (vendor) |
| PUT | `/api/products/{id}` | Auth | Update product |
| DELETE | `/api/products/{id}` | Auth | Delete product |
| PATCH | `/api/products/{id}/approve` | Auth | Admin: approve product |
| PATCH | `/api/products/{id}/reject` | Auth | Admin: reject product |

### Orders — `/api/orders`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/orders` | Auth | Place a new order |
| GET | `/api/orders` | Auth | All orders (admin) |
| GET | `/api/orders/count` | Auth | Total order count |
| GET | `/api/orders/reports` | Auth | Order data for charts |
| GET | `/api/orders/user` | Auth | Logged-in user's orders |
| GET | `/api/orders/vendor/{name}` | Auth | Orders for a vendor's products |
| GET | `/api/orders/{id}` | — | Single order by ID |
| PUT | `/api/orders/{id}/cancel` | Auth | Cancel an order |
| PUT | `/api/orders/{id}/return` | Auth | Return a delivered order |
| PUT | `/api/orders/{id}/status?status=` | Auth | Admin: update order status |

### Cart — `/api/cart`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cart?userId=` | Get cart for a user |
| POST | `/api/cart` | Add item (or increment qty if exists) |
| PUT | `/api/cart` | Update item quantity |
| DELETE | `/api/cart` | Remove a single item |
| DELETE | `/api/cart/clear` | Clear the entire cart |

### Users — `/api/users`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users` | Create user profile |
| GET | `/api/users` | All users (admin) |
| GET | `/api/users/{id}` | User by ID |
| GET | `/api/users/by-email?email=` | User by email |
| PUT | `/api/users/{id}` | Update profile |
| PATCH | `/api/users/{id}/active?active=` | Enable or disable user |
| GET | `/api/users/{id}/validate-checkout` | Check profile is complete for checkout |

### Discounts — `/api/discounts`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/discounts` | All promo codes |
| POST | `/api/discounts` | Create promo code |
| DELETE | `/api/discounts/{id}` | Delete promo code |

### Payments — `/api/payments`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments/create-razorpay-order` | Create a Razorpay payment order |

---

## 🗄️ Database Entities

| Table | Key Fields |
|---|---|
| `products` | id, name, price, image, category, description, stock, status (`PENDING/APPROVED/REJECTED`), vendor, rating, reviews |
| `orders` | id, productId, userId, quantity, totalPrice, status (`CREATED/SHIPPED/OUT_FOR_DELIVERY/DELIVERED/CANCELLED/RETURNED`), email, fullName, address, city, pincode |
| `cart_items` | id, userId, productId, productName, quantity — unique on `(userId, productId)` |
| `users` | id, name, email, phone, address, city, state, pincode, active |
| `discounts` | id, code (unique, uppercase), percentage, startDate, endDate |

---

## ⚡ Order Lifecycle

```
CREATED → SHIPPED → OUT_FOR_DELIVERY → DELIVERED
                                            │
                                        RETURNED

CREATED / SHIPPED → CANCELLED
```

- A **cancel** is blocked if the order is already `SHIPPED` or `DELIVERED`
- A **return** is only allowed when the order is `DELIVERED`
- Each status change triggers an **email notification** to the customer
- When an order is placed and stock drops below 10, a **low-stock alert email** is sent to the vendor

---

## 📧 Email Notifications

Three automated emails are sent via Gmail SMTP:

| Trigger | Email type |
|---|---|
| Order placed | Order confirmation to customer with order ID, product, and total |
| Order cancelled or returned | Status update email to customer |
| Stock drops below 10 after an order | Low stock alert to the vendor |

---

## 🖥️ Frontend Pages

### Public (no login required)
- `/` — Landing page
- `/login` — Login
- `/register` — Customer registration
- `/vendor-register` — Vendor registration
- `/shop` — Product listing with filters
- `/product/:id` — Product detail page
- `/about`, `/faq`, `/returns`, `/terms`, `/privacy` — Info pages

### Protected (redirect to `/login` if unauthenticated)
- `/profile` — Edit user profile
- `/cart` — Shopping cart
- `/checkout` — Address + payment
- `/order-tracking` — Track order by ID
- `/order-history` — Customer's past orders
- `/vendor` — Vendor dashboard
- `/vendor/add-product` — List a new product
- `/vendor/products` — Manage listed products
- `/vendor/inventory` — Stock management
- `/vendor/orders` — Orders on vendor's products
- `/admin` — Admin dashboard with stats
- `/admin/approvals` — Approve or reject pending products
- `/admin/reports` — Revenue charts
- `/admin/categories` — Category management
- `/admin/vendors` — All vendors
- `/admin/discounts` — Promo code management
- `/admin/products` — All products view

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL database
- Supabase project
- Razorpay account (test keys are fine)
- Gmail account with an app password

### Backend Setup

1. Clone the repo and navigate to the backend:
   ```bash
   cd backend
   ```

2. Create a `.env` file (see `.env.example`):
   ```env
   DB_URL=jdbc:postgresql://<host>/<dbname>
   DB_USER=your_db_user
   DB_PASS=your_db_password
   PORT=8080
   ```

3. Update `application.properties` with your Supabase JWKS URL, Razorpay keys, and Gmail credentials.

4. Run the backend:
   ```bash
   ./mvnw spring-boot:run
   ```
   The server starts on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   VITE_SUPABASE_URL=https://<project>.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_API_BASE_URL=http://localhost:8080
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```
   The app runs on `http://localhost:8081`

---

## 🧪 Running Tests

### Frontend unit tests (Vitest)
```bash
cd frontend
npm run test
```

### Backend E2E smoke tests (Selenium)
```bash
cd backend
./mvnw test -De2e=true -Dfrontend.baseUrl=http://localhost:8081
```
> Selenium tests require the frontend to be running. Pass `-De2e.email` and `-De2e.password` to also run the login flow test.

---

## 🌐 Deployment

| Part | Platform |
|---|---|
| Frontend | Vercel (auto-deploys on push to `main`) |
| Backend | Any Java-capable host (Railway, Render, EC2, etc.) |
| Database | Supabase PostgreSQL or any hosted Postgres |

Set all environment variables in your hosting platform's dashboard. The backend reads `$PORT`, `$DB_URL`, `$DB_USER`, and `$DB_PASS` at runtime.

---

