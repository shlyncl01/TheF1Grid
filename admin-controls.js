// Check if user is admin
if (!localStorage.getItem("isAdmin")) {
    window.location.href = "shop.html";
}

// Logout button
document.getElementById('logout-btn')?.addEventListener('click', function() {
    localStorage.removeItem("isAdmin");
    window.location.href = "shop.html";
});

// Initialize products in localStorage if not exists
if (!localStorage.getItem('products')) {
    const initialProducts = [
        {
            id: "ferrari1",
            title: "Scuderia Ferrari Puma Team Knitted Polo - Red",
            price: 5650.00,
            oldPrice: 7150.00,
            image: "images/shop/ferrari-items/item1.png",
            stocks: 12,
            orders: 48,
            published: "12 Oct 2023",
            badge: "Almost Gone!",
            team: "ferrari"
        },
        {
            id: "ferrari2",
            title: "Scuderia Ferrari Race Lifestyle Colour Block T-Shirt",
            price: 3400.00,
            image: "images/shop/ferrari-items/item2.png",
            stocks: 24,
            orders: 32,
            published: "05 Nov 2023",
            team: "ferrari"
        },
        {
            id: "williams1",
            title: "Williams Racing 2025 Team Polo - Navy",
            price: 4650.00,
            oldPrice: 5500.00,
            image: "images/shop/williams-items/item1.png",
            stocks: 8,
            orders: 15,
            published: "20 Sep 2023",
            team: "williams"
        }
    ];
    localStorage.setItem('products', JSON.stringify(initialProducts));
}

// Get products from localStorage
function getProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
}

// Save products to localStorage
function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

// Render products
function renderProducts() {
    const products = getProducts();
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'admin-product-card';
        card.innerHTML = `
            <div class="admin-product-img-wrap">
                <img src="${product.image}" alt="${product.title}">
                ${product.badge ? `<span class="product-badge badge-orange">${product.badge}</span>` : ''}
            </div>
            <div class="admin-product-info">
                <h3>${product.title}</h3>
                <div class="admin-price-row">
                    <span class="admin-price">₱${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="admin-old-price">₱${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <div class="admin-stats">
                    <div class="admin-stat">
                        <i class="bi bi-box-seam"></i>
                        <span>${product.stocks} Stocks</span>
                    </div>
                    <div class="admin-stat">
                        <i class="bi bi-cart-check"></i>
                        <span>${product.orders} Orders</span>
                    </div>
                    <div class="admin-stat">
                        <i class="bi bi-calendar"></i>
                        <span>${product.published}</span>
                    </div>
                </div>
                <div class="admin-actions">
                    <button class="admin-edit-btn" data-id="${product.id}"><i class="bi bi-pencil"></i> Edit</button>
                    <button class="admin-delete-btn" data-id="${product.id}"><i class="bi bi-trash"></i> Delete</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.admin-edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            editProduct(productId);
        });
    });

    document.querySelectorAll('.admin-delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            deleteProduct(productId);
        });
    });
}

// Edit product
function editProduct(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // Simple edit - in a real app you'd have a proper form
        const newStocks = prompt("Enter new stock quantity:", product.stocks);
        if (newStocks !== null) {
            product.stocks = parseInt(newStocks) || 0;
            saveProducts(products);
            renderProducts();
        }
    }
}

// Delete product
function deleteProduct(productId) {
    if (confirm("Are you sure you want to delete this product?")) {
        const products = getProducts().filter(p => p.id !== productId);
        saveProducts(products);
        renderProducts();
    }
}

// Add new product
document.getElementById('add-product-btn')?.addEventListener('click', function() {
    // Simple add - in a real app you'd have a proper form
    const title = prompt("Enter product title:");
    if (title) {
        const price = parseFloat(prompt("Enter product price:") || 0);
        const stocks = parseInt(prompt("Enter stock quantity:") || 0);
        
        const newProduct = {
            id: 'prod-' + Math.random().toString(36).substr(2, 9),
            title,
            price,
            stocks,
            orders: 0,
            published: new Date().toLocaleDateString(),
            image: "images/logo (2).png", // Default image
            team: "f1" // Default team
        };
        
        const products = getProducts();
        products.push(newProduct);
        saveProducts(products);
        renderProducts();
    }
});

// Initial render
renderProducts();