# 📦 Inventory Management System

A modern, easy-to-use web application for managing retail store inventory. Built with Node.js, Express, and SQLite.

## Features

- 📋 **Browse Products** - View all products in an organized, responsive grid
- ➕ **Add Products** - Easily add new products with all details
- ✏️ **Edit Products** - Update product information
- 🗑️ **Delete Products** - Remove products from inventory
- 📊 **Update Quantity** - Quick quantity updates for stock management
- 🔍 **Search** - Search products by name, category, SKU, or description
- 💰 **Statistics** - View total products and inventory value
- ⚠️ **Low Stock Alerts** - Visual warnings for products with quantity < 10
- 🎨 **Modern UI** - Clean, responsive design that works on all devices

## Pre-populated Data

The application comes with 20 sample products across various categories:
- Electronics (monitors, keyboards, mice, webcams, headphones)
- Accessories (cables, stands, organizers)
- Furniture (chairs, lamps, desks)
- Stationery (notebooks, pens, sticky notes)
- Office Supplies (whiteboards, shredders)

## Installation

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Setup Steps

1. **Clone the repository** (if not already done)
   ```bash
   git clone <repository-url>
   cd testipallo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to: `http://localhost:3000`

## Usage

### Adding a New Product
1. Click the "➕ Add Product" button
2. Fill in all required fields:
   - Product Name
   - SKU (Stock Keeping Unit - must be unique)
   - Category
   - Price
   - Quantity
   - Description (optional)
3. Click "Save Product"

### Editing a Product
1. Click the "✏️ Edit" button on any product card
2. Modify the desired fields
3. Click "Save Product"

### Updating Quantity
1. Click the "📊 Update Qty" button on any product card
2. Enter the new quantity
3. Click "Update"

### Deleting a Product
1. Click the "🗑️ Delete" button on any product card
2. Confirm the deletion

### Searching Products
- Use the search box to filter products by name, category, SKU, or description
- Results update in real-time as you type

## Technical Details

### Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: SQLite (better-sqlite3)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3

### API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `PATCH /api/products/:id/quantity` - Update only quantity
- `DELETE /api/products/:id` - Delete a product

### Database Schema

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  price REAL NOT NULL,
  description TEXT,
  sku TEXT UNIQUE NOT NULL
)
```

## File Structure

```
testipallo/
├── server.js           # Express server and API endpoints
├── package.json        # Project dependencies
├── inventory.db        # SQLite database (auto-generated)
├── public/
│   ├── index.html      # Main HTML page
│   ├── styles.css      # Styling
│   └── app.js          # Frontend JavaScript
└── README.md           # This file
```

## Development

To run the application in development mode:

```bash
npm run dev
```

The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## Notes

- The database file (`inventory.db`) is automatically created on first run
- The database is seeded with 20 sample products if it's empty
- All product SKUs must be unique
- Quantities below 10 are highlighted as low stock

## License

MIT
