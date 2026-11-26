# Torado Frontend

Torado is a responsive fashion storefront built with React and Vite. It includes the home page, men's and women's collections, product browsing, cart and wishlist views, account pages, checkout screens, order tracking, and an admin interface at `/admin`.

## Requirements

- Node.js 18 or newer
- npm
- The Torado API and MySQL database for account, catalogue, coupon, checkout, payment, and admin features

## Run locally

The npm scripts and dependencies are defined in the repository root. From the project root:

```bash
npm install
npm run dev
```

Vite serves the frontend at `http://localhost:3001` and opens it in a browser. The backend API uses `http://localhost:3000` by default. To use API-backed features, configure and start the backend as described in [README_BACKEND.md](README_BACKEND.md).

To point the frontend at a different API, create a root `.env` file (you can copy `backend/.env.example`) and set:

```dotenv
VITE_API_URL=http://localhost:3000/api
```

For Google sign-in, set `VITE_GOOGLE_CLIENT_ID` to the Google OAuth Web Client ID used by the backend. Restart Vite after changing environment variables.

## Build and preview

```bash
npm run build
npm run preview
```

The production build is written to the root `dist/` directory. Preview serves that build locally; deploy the contents of `dist/` to a static web host. Set production `VITE_API_URL` and `VITE_GOOGLE_CLIENT_ID` before building.

## Project layout

- `frontend/src/App.jsx` â€” storefront and admin route selection
- `frontend/src/components/` â€” page sections, account, cart, wishlist, checkout, and other UI components
- `frontend/src/context/ShopContext.jsx` â€” shared storefront state and navigation
- `frontend/src/admin/` â€” admin panel UI
- `frontend/src/index.css` and component CSS files â€” global and component styling
- `frontend/public/assets/` â€” static images, fonts, and vendor scripts served from `/assets/`
- `frontend/vite.config.js` â€” Vite settings; build output goes to root `dist/`

## Notes

- The admin screen is available at `/admin`; it requires the API and an admin account.
- Some storefront state and demo products are held in the frontend. Live account, payment, coupon, catalogue, and admin actions need the backend services configured.
- See [README_BACKEND.md](README_BACKEND.md) for database setup, API configuration, and external service requirements.

# Torado backend and admin setup

The Vite storefront source and assets live in `frontend/src` and `frontend/public`; root `dist/` is the production build output. The admin interface is available at `/admin` and talks to the Express API at `http://localhost:3000/api` by default.

## Local setup

1. Install Node.js 18+ and MySQL 8+.
2. Copy `backend/.env.example` to the repository root as `.env`; set a long random `JWT_SECRET` and your MySQL credentials. The server loads `.env` from the repository root when started with `npm run server`.
3. Run `database/schema.sql` in MySQL.
4. Run `npm install` and then `npm run admin:create` to create the admin account from `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
5. Start the API with `npm run server` and the storefront with `npm run dev` in another terminal.

The API health check is `GET /api/health`. Public catalogue endpoints are `GET /api/store/products` and `/api/store/categories`. Admin API paths use a JWT bearer token and include `/api/admin/summary`, `/api/products`, `/api/orders`, `/api/customers`, `/api/inventory`, `/api/coupons`, `/api/banners`, `/api/payments`, `/api/returns`, `/api/reviews`, `/api/reports`, `/api/notifications`, and `/api/settings`.

## External services

- Customer email OTP requires SMTP settings. OTPs are hashed in MySQL and expire after ten minutes.
- Google login needs a Google OAuth Web Client ID configured as both `GOOGLE_CLIENT_ID` on the API and `VITE_GOOGLE_CLIENT_ID` in the frontend environment. Add the site origins to the Google OAuth client.
- Razorpay needs API keys and a webhook secret. Use test keys during setup and configure `/api/payments/razorpay/webhook` in Razorpay.
- Set `CLIENT_ORIGIN` to the deployed storefront URL(s), and `VITE_API_URL` to the deployed API URL before building for production. Use HTTPS in production.

Product/category catalogue SQL is in `database/products/queries.sql`. Schema creation is explicit; the API does not auto-create tables or insert demo catalogue data. Product images upload to `backend/uploads/products`; use persistent disk or object storage for deployment and set `PUBLIC_API_URL` to the public API origin.

