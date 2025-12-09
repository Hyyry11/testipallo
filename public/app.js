// Global variables
let products = [];
let editingProductId = null;

// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

// Load all products from API
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        
        products = await response.json();
        renderProducts(products);
        updateStats();
    } catch (error) {
        console.error('Error loading products:', error);
        showError('Failed to load products');
    }
}

// Render products in the grid
function renderProducts(productsToRender) {
    const container = document.getElementById('productsContainer');
    
    if (productsToRender.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>📦 No Products Found</h2>
                <p>Add your first product to get started</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = productsToRender.map(product => `
        <div class="product-card">
            <div class="product-header">
                <div>
                    <div class="product-name">${escapeHtml(product.name)}</div>
                    <div class="product-sku">${escapeHtml(product.sku)}</div>
                </div>
                <span class="category-badge">${escapeHtml(product.category)}</span>
            </div>
            
            <div class="product-details">
                <div class="product-detail-row">
                    <span class="detail-label">Price:</span>
                    <span class="detail-value price-value">$${product.price.toFixed(2)}</span>
                </div>
                <div class="product-detail-row">
                    <span class="detail-label">Quantity:</span>
                    <span class="detail-value quantity-value ${product.quantity < 10 ? 'low-stock' : ''}">
                        ${product.quantity} ${product.quantity < 10 ? '⚠️' : ''}
                    </span>
                </div>
            </div>
            
            <div class="product-description">
                ${escapeHtml(product.description || 'No description available')}
            </div>
            
            <div class="product-actions">
                <button class="btn btn-quantity" onclick="showQuantityModal(${product.id}, ${product.quantity})">
                    📊 Update Qty
                </button>
                <button class="btn btn-edit" onclick="editProduct(${product.id})">
                    ✏️ Edit
                </button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id}, '${escapeHtml(product.name)}')">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Update statistics
function updateStats() {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
}

// Filter products based on search
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm) ||
        (product.description && product.description.toLowerCase().includes(searchTerm))
    );
    
    renderProducts(filtered);
}

// Show add product modal
function showAddModal() {
    editingProductId = null;
    document.getElementById('modalTitle').textContent = 'Add New Product';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModal').style.display = 'block';
}

// Edit product
async function editProduct(id) {
    try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        
        const product = await response.json();
        editingProductId = id;
        
        document.getElementById('modalTitle').textContent = 'Edit Product';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productSku').value = product.sku;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productQuantity').value = product.quantity;
        document.getElementById('productDescription').value = product.description || '';
        
        document.getElementById('productModal').style.display = 'block';
    } catch (error) {
        console.error('Error loading product:', error);
        showError('Failed to load product details');
    }
}

// Save product (create or update)
async function saveProduct(event) {
    event.preventDefault();
    
    const product = {
        name: document.getElementById('productName').value,
        sku: document.getElementById('productSku').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        quantity: parseInt(document.getElementById('productQuantity').value),
        description: document.getElementById('productDescription').value
    };
    
    try {
        let response;
        if (editingProductId) {
            // Update existing product
            response = await fetch(`/api/products/${editingProductId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
        } else {
            // Create new product
            response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
        }
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to save product');
        }
        
        closeModal();
        await loadProducts();
        showSuccess(editingProductId ? 'Product updated successfully' : 'Product added successfully');
    } catch (error) {
        console.error('Error saving product:', error);
        showError(error.message);
    }
}

// Show quantity update modal
function showQuantityModal(id, currentQuantity) {
    document.getElementById('quantityProductId').value = id;
    document.getElementById('newQuantity').value = currentQuantity;
    document.getElementById('quantityModal').style.display = 'block';
}

// Update product quantity
async function updateQuantity(event) {
    event.preventDefault();
    
    const id = document.getElementById('quantityProductId').value;
    const quantity = parseInt(document.getElementById('newQuantity').value);
    
    try {
        const response = await fetch(`/api/products/${id}/quantity`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity })
        });
        
        if (!response.ok) throw new Error('Failed to update quantity');
        
        closeQuantityModal();
        await loadProducts();
        showSuccess('Quantity updated successfully');
    } catch (error) {
        console.error('Error updating quantity:', error);
        showError('Failed to update quantity');
    }
}

// Delete product
async function deleteProduct(id, name) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete product');
        
        await loadProducts();
        showSuccess('Product deleted successfully');
    } catch (error) {
        console.error('Error deleting product:', error);
        showError('Failed to delete product');
    }
}

// Close modals
function closeModal() {
    document.getElementById('productModal').style.display = 'none';
    editingProductId = null;
}

function closeQuantityModal() {
    document.getElementById('quantityModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const productModal = document.getElementById('productModal');
    const quantityModal = document.getElementById('quantityModal');
    
    if (event.target === productModal) {
        closeModal();
    }
    if (event.target === quantityModal) {
        closeQuantityModal();
    }
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showSuccess(message) {
    // Simple alert for now - could be replaced with a toast notification
    alert('✅ ' + message);
}

function showError(message) {
    alert('❌ ' + message);
}
