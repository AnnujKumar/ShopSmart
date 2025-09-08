# ShopSmart API & Features

Base URL: `/api` (e.g., http://localhost:5000/api)

Health: `GET /api/health` → `{ status: 'ok' }`

Auth: Bearer JWT (Authorization: `Bearer <token>`) for protected routes.

Environment variables:
- `MONGODB_URI` MongoDB connection string
- `JWT_SECRET` Secret used to sign JWTs
- `PORT` Server port (default 5000)

## Features
- User auth: signup, login, token verification, profile
- Products: list with filters (category, maxPrice, search), detail, create/update/delete (protected)
- Cart: add, list, remove, update quantity, replace entire cart (all protected)
- CORS enabled, detailed error handler, health check

---

## Users
Route prefix: `/api/users`

- POST `/signup` — Register
	- Body: `{ name, email, password, address }`
	- 201: `{ message }`
	- 400: `{ error }` (email already registered, validation)

- POST `/login` — Authenticate
	- Body: `{ email, password }`
	- 200: `{ token, userId, name, email }`
	- 401: `{ error: 'Invalid credentials' }`

- GET `/profile` — Get current user (protected)
	- Headers: `Authorization: Bearer <token>`
	- 200: `{ _id, name, email, address, createdAt }`

- GET `/orders` — User orders (protected, placeholder)
	- 200: `{ message, orders: [] }`

- GET `/verify-token` — Validate token (protected)
	- 200: `{ message: 'Token is valid', user: { id } }`

---

## Products
Route prefix: `/api/products`

- GET `/` — List products (public)
	- Query params (optional):
		- `category` (string, 'All' ignored)
		- `maxPrice` (number)
		- `search` (string; matches name/description, case-insensitive)
	- 200: `Product[]`

- GET `/:id` — Product detail (public)
	- 200: `Product`
	- 400/404 on invalid/not found

- POST `/` — Create product (protected)
	- Body: `{ name, description, price, category, image, stock }`
	- 201: `Product`

- PUT `/:id` — Update product (protected)
	- Body: partial product fields
	- 200: `Product`

- DELETE `/:id` — Delete product (protected)
	- 200: `{ message: 'Product deleted' }`

Product schema (relevant): `{ _id, name, description, price, category, image, stock }`

---

## Cart
Route prefix: `/api/cart` (all routes protected)

All routes require header: `Authorization: Bearer <token>`

Cart shape: `{ user, items: [{ product: Product | productId, quantity }], ... }`

- GET `/` — Get current cart
	- 200: `{ user, items: [{ product: Product, quantity }] }` (products populated)

- POST `/add` — Add item
	- Body: `{ productId, quantity }`
	- 200: full cart with populated products
	- 400: missing/invalid ids; 404: product not found

- POST `/remove` — Remove item
	- Body: `{ productId }`
	- 200: full cart with populated products
	- 404: product not in cart

- POST `/update` — Update quantity
	- Body: `{ productId, quantity >= 1 }`
	- 200: full cart with populated products

- PUT `/` — Replace entire cart
	- Body: `{ items: [{ product: productId, quantity >= 1 }] }`
	- 200: full cart with populated products

Errors handled centrally with consistent JSON:
```
{
	"error": {
		"message": string,
		"status": number,
		"timestamp": iso,
		"stack?": string,
		"details?": any
	}
}
```

---

## Quick start
1) Install deps
```
cd backend
npm install
```

2) Configure env (.env.development)
```
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=replace_with_secure_secret
PORT=5000
```

3) Run locally
```
npm start
# or
node server.js
```

You should see: `ShopSmart API is running!` at `/` and `GET /api/health` → `{ status: 'ok' }`.

---

## Frontend (overview)
- Routes: `/welcome`, `/` (products), `/cart`, `/signup`, `/login`
- Uses Axios instance (`Frontend/src/api/axios.js`) with `VITE_API_URL`
- Auth token stored in localStorage and sent via Authorization header

Troubleshooting
- 401: ensure Authorization header is present and token is valid (`/api/users/verify-token`).
- CORS: backend sets permissive CORS; verify `VITE_API_URL` points to backend `/api`.
- Mongo: confirm `MONGODB_URI` and DB is running.
