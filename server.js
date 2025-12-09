const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Initialize database
const db = new Database('inventory.db');

// Create products table
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    price REAL NOT NULL,
    description TEXT,
    sku TEXT UNIQUE NOT NULL
  )
`);

// Seed database with 20 products if empty
const count = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (count.count === 0) {
  const insert = db.prepare(
    'INSERT INTO products (name, category, quantity, price, description, sku) VALUES (?, ?, ?, ?, ?, ?)'
  );

  const seedData = [
    ['Wireless Mouse', 'Electronics', 45, 29.99, 'Ergonomic wireless mouse with USB receiver', 'ELEC-001'],
    ['Mechanical Keyboard', 'Electronics', 30, 89.99, 'RGB mechanical gaming keyboard', 'ELEC-002'],
    ['USB-C Cable', 'Accessories', 150, 12.99, 'High-speed USB-C charging cable', 'ACC-001'],
    ['Laptop Stand', 'Accessories', 25, 39.99, 'Aluminum adjustable laptop stand', 'ACC-002'],
    ['Desk Lamp', 'Furniture', 20, 45.99, 'LED desk lamp with adjustable brightness', 'FURN-001'],
    ['Office Chair', 'Furniture', 12, 299.99, 'Ergonomic office chair with lumbar support', 'FURN-002'],
    ['Notebook A5', 'Stationery', 200, 4.99, 'Ruled notebook with 200 pages', 'STAT-001'],
    ['Pen Set', 'Stationery', 85, 15.99, 'Premium ballpoint pen set (5 pieces)', 'STAT-002'],
    ['Webcam HD', 'Electronics', 18, 79.99, '1080p HD webcam with built-in microphone', 'ELEC-003'],
    ['Headphones', 'Electronics', 35, 149.99, 'Noise-cancelling wireless headphones', 'ELEC-004'],
    ['Monitor 24"', 'Electronics', 15, 199.99, '24-inch Full HD LED monitor', 'ELEC-005'],
    ['HDMI Cable', 'Accessories', 75, 14.99, '6ft HDMI 2.0 cable', 'ACC-003'],
    ['Desk Organizer', 'Accessories', 40, 24.99, 'Wooden desk organizer with compartments', 'ACC-004'],
    ['Whiteboard', 'Office Supplies', 10, 49.99, 'Magnetic whiteboard 36x24 inches', 'OFF-001'],
    ['Markers Set', 'Stationery', 120, 9.99, 'Dry erase markers (8 colors)', 'STAT-003'],
    ['Sticky Notes', 'Stationery', 250, 3.99, 'Sticky notes pack (400 sheets)', 'STAT-004'],
    ['Paper Shredder', 'Office Supplies', 8, 89.99, 'Cross-cut paper shredder', 'OFF-002'],
    ['Desk Mat', 'Accessories', 60, 19.99, 'Large desk mat with stitched edges', 'ACC-005'],
    ['Phone Holder', 'Accessories', 95, 16.99, 'Adjustable smartphone holder', 'ACC-006'],
    ['Cable Management Box', 'Accessories', 50, 22.99, 'Cable organizer box with multiple outlets', 'ACC-007']
  ];

  const insertMany = db.transaction((products) => {
    for (const product of products) {
      insert.run(...product);
    }
  });

  insertMany(seedData);
  console.log('Database seeded with 20 products');
}

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY id').all();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new product
app.post('/api/products', (req, res) => {
  try {
    const { name, category, quantity, price, description, sku } = req.body;
    
    if (!name || !category || quantity === undefined || !price || !sku) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const insert = db.prepare(
      'INSERT INTO products (name, category, quantity, price, description, sku) VALUES (?, ?, ?, ?, ?, ?)'
    );
    
    const result = insert.run(name, category, quantity, price, description || '', sku);
    const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json(newProduct);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'SKU already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Update product
app.put('/api/products/:id', (req, res) => {
  try {
    const { name, category, quantity, price, description, sku } = req.body;
    
    const update = db.prepare(
      'UPDATE products SET name = ?, category = ?, quantity = ?, price = ?, description = ?, sku = ? WHERE id = ?'
    );
    
    const result = update.run(name, category, quantity, price, description, sku, req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(updatedProduct);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'SKU already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Update only quantity
app.patch('/api/products/:id/quantity', (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (quantity === undefined) {
      return res.status(400).json({ error: 'Quantity is required' });
    }

    const update = db.prepare('UPDATE products SET quantity = ? WHERE id = ?');
    const result = update.run(quantity, req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  try {
    const deleteStmt = db.prepare('DELETE FROM products WHERE id = ?');
    const result = deleteStmt.run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
