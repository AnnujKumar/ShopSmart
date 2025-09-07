# E-Commerce Application Setup

## Database Setup

Before running the application, you need to set up the database with test data:

1. Make sure MongoDB is running on your local machine
2. Run the seeding script to populate the database:

```bash
node seed.js
```

This will create:

- A test user (email: test@example.com, password: password123)
- Product data that matches the UI

## Running the Application

### Backend

```bash
cd backend
npm install
npm start
```

The backend will run on http://localhost:5000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:5173

## Using the Application

1. Log in with the test user:

   - Email: test@example.com
   - Password: password123

2. Browse products and add them to your cart

3. View your cart and update quantities or remove items

## Troubleshooting

If you encounter any issues with the cart functionality:

1. Check the browser console for errors
2. Make sure MongoDB is running
3. Verify that the test user and products were successfully seeded
4. Check that you're logged in (the user ID is stored in localStorage)

## API Endpoints

### Products

- GET /api/products - Get all products
- GET /api/products/:id - Get a single product

### Cart

- GET /api/cart?userId=:userId - Get user's cart
- POST /api/cart/add - Add item to cart
- POST /api/cart/remove - Remove item from cart
- POST /api/cart/update - Update item quantity
