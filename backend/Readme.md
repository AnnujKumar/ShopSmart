# E-Commerce Backend API

## User APIs

### POST /api/users/signup

Registers a new user. Requires name, email, password, and address in the request body. Returns success message on registration.

### POST /api/users/login

Authenticates a user. Requires email and password in the request body. Returns a JWT token if credentials are valid.

### GET /api/users/profile

Returns the profile information of the authenticated user. Requires JWT token in the Authorization header.

## Product APIs

### POST /api/products/

Creates a new product. Requires product details (name, description, price, category, image, stock) in the request body. Returns the created product object.

### GET /api/products/

Lists all products. Supports optional filters via query parameters: price and category. Returns an array of products.

### GET /api/products/:id

Fetches details of a single product by its ID. Returns the product object.

### PUT /api/products/:id

Updates an existing product by its ID. Requires updated product details in the request body. Returns the updated product object.

### DELETE /api/products/:id

Deletes a product by its ID. Returns a success message on deletion.

## Cart APIs

### POST /api/cart/add

Adds a product to the user's cart. Requires userId, productId, and quantity in the request body. Returns the updated cart object.

### GET /api/cart/

Fetches the cart for a user. Requires userId as a query parameter. Returns the cart with populated product details.

### POST /api/cart/remove

Removes a product from the user's cart. Requires userId and productId in the request body. Returns the updated cart object.

## Authentication

All protected routes require a valid JWT token in the Authorization header. The token is issued on successful login and must be included in requests to access user profile and other protected resources.

## Usage

Start server: `node server.js`

---

# E-Commerce Frontend

## Frontend Routes

### /signup

Signup page for new users. Allows registration with name, email, password, and address.

### /login

Login page for existing users. Authenticates and stores JWT token for session.

### /

Product listing page. Displays all products with filters for price and category. Allows adding products to cart.

### /cart

Cart page. Shows all items added to the cart, with options to remove items. Cart items persist after logout.

## Components

- Navbar: Navigation bar for switching between pages
- Signup: Registration form
- Login: Login form
- ProductList: Product display and filtering
- Cart: Cart management

## Styling

Professional, modern UI using CSS in `styles.css`.

## Usage

- Install dependencies: `npm install` in the `frontend` folder
- Start frontend: `npm start` in the `frontend` folder
