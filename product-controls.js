let cart = [];

const cartDrawer = document.getElementById('cart-drawer');
const cartDrawerOpen = document.getElementById('cart-drawer-open');
const cartDrawerClose = document.getElementById('cart-drawer-close');
const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
const cartDrawerItems = document.getElementById('cart-drawer-items');
const cartDrawerCount = document.getElementById('cart-drawer-count');
const cartDrawerItemsCount = document.getElementById('cart-drawer-items-count');
const cartDrawerSubtotal = document.getElementById('cart-drawer-subtotal');

// Open cart drawer
cartDrawerOpen.addEventListener('click', () => {
    cartDrawer.classList.add('open');
    cartDrawerOverlay.classList.add('open');
    renderCartDrawer();
});
// Close cart drawer
cartDrawerClose.addEventListener('click', closeCartDrawer);
cartDrawerOverlay.addEventListener('click', closeCartDrawer);
function closeCartDrawer() {
    cartDrawer.classList.remove('open');
    cartDrawerOverlay.classList.remove('open');
}

// Add to cart function
function addToCart(product) {
    // Check if the same product (with same size) already exists
    const existing = cart.find(item =>
        item.id === product.id &&
        item.size === product.size
    );
    if (existing) {
        existing.quantity += product.quantity;
    } else {
        cart.push({ ...product });
    }
    renderCartDrawer();
}

// Render cart drawer
function renderCartDrawer() {
    cartDrawerCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartDrawerItemsCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartDrawerItems.innerHTML = '';
    if (cart.length === 0) {
        cartDrawerItems.innerHTML = `<div style="color:#888;text-align:center;font-size:17px;margin-top:50px;">Your cart is empty.</div>`;
        cartDrawerSubtotal.textContent = '₱0.00';
        return;
    }

    let subtotal = 0;
    cart.forEach((item, i) => {
        subtotal += item.price * item.quantity;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-drawer-item';

        // Image
        const img = document.createElement('img');
        img.className = 'cart-drawer-item-img';
        img.src = item.image;
        img.alt = item.title;

        // Info
        const infoDiv = document.createElement('div');
        infoDiv.className = 'cart-drawer-item-info';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'cart-drawer-item-title';
        titleDiv.textContent = item.title;

        const priceDiv = document.createElement('div');
        priceDiv.className = 'cart-drawer-item-price';
        priceDiv.textContent = `₱${item.price.toFixed(2)}`;

        // Size (only show if not null and not undefined)
        if (item.size !== undefined && item.size !== null) {
            const sizeDiv = document.createElement('div');
            sizeDiv.style.fontSize = '13px';
            sizeDiv.style.color = '#888';
            sizeDiv.textContent = 'Size: ' + (item.size || 'N/A');
            infoDiv.appendChild(sizeDiv);
        }

        // Controls
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'cart-drawer-item-controls';

        const minusBtn = document.createElement('button');
        minusBtn.className = 'cart-drawer-qty-btn';
        minusBtn.textContent = '−';
        minusBtn.onclick = () => {
            if (item.quantity > 1) {
                item.quantity--;
                renderCartDrawer();
            }
        };

        const qtyInput = document.createElement('input');
        qtyInput.className = 'cart-drawer-item-qty';
        qtyInput.type = 'text';
        qtyInput.value = item.quantity;
        qtyInput.readOnly = true;

        const plusBtn = document.createElement('button');
        plusBtn.className = 'cart-drawer-qty-btn';
        plusBtn.textContent = '+';
        plusBtn.onclick = () => {
            item.quantity++;
            renderCartDrawer();
        };

        controlsDiv.appendChild(minusBtn);
        controlsDiv.appendChild(qtyInput);
        controlsDiv.appendChild(plusBtn);

        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'cart-drawer-remove';
        removeBtn.innerHTML = '×';
        removeBtn.title = 'Remove';
        removeBtn.onclick = () => {
            cart.splice(i, 1);
            renderCartDrawer();
        };

        infoDiv.appendChild(titleDiv);
        infoDiv.appendChild(priceDiv);
        infoDiv.appendChild(controlsDiv);

        itemDiv.appendChild(img);
        itemDiv.appendChild(infoDiv);
        itemDiv.appendChild(removeBtn);

        cartDrawerItems.appendChild(itemDiv);
    });

    cartDrawerSubtotal.textContent = '₱' + subtotal.toFixed(2);
}

// PRODUCT CARD LOGIC
document.querySelectorAll('.product-card').forEach(function (card) {
    const controls = card.querySelector('.product-controls');
    const hasSize = card.dataset.hasSize !== "false";
    const sizes = (card.dataset.sizes || "S,M,L,XL").split(',');

    // Create Sizes ONLY if hasSize is true or not present
    let sizesDiv = null;
    if (hasSize) {
        sizesDiv = document.createElement('div');
        sizesDiv.className = 'product-sizes';
        const sizeLabel = document.createElement('label');
        sizeLabel.textContent = 'Size';
        sizesDiv.appendChild(sizeLabel);
        sizes.forEach(size => {
            const btn = document.createElement('button');
            btn.className = 'size-btn';
            btn.textContent = size;
            btn.type = 'button';
            btn.onclick = function () {
                sizesDiv.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            };
            sizesDiv.appendChild(btn);
        });
    }

    // Create Quantity
    const qtyDiv = document.createElement('div');
    qtyDiv.className = 'product-qty';
    const qtyLabel = document.createElement('label');
    qtyLabel.textContent = 'Quantity';
    qtyDiv.appendChild(qtyLabel);
    const select = document.createElement('select');
    for (let i = 1; i <= 5; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        select.appendChild(option);
    }
    qtyDiv.appendChild(select);

    // Insert before the Add to Cart button
    const addToCartBtn = controls.querySelector('.add-to-cart-btn');
    if (hasSize && sizesDiv) controls.insertBefore(sizesDiv, addToCartBtn);
    controls.insertBefore(qtyDiv, addToCartBtn);

    // Add to cart logic
    addToCartBtn.addEventListener('click', function () {
        let selectedSize = null;
        if (hasSize && sizesDiv) {
            const selectedSizeBtn = sizesDiv.querySelector('.size-btn.active');
            selectedSize = selectedSizeBtn ? selectedSizeBtn.textContent : null;
            if (!selectedSize) {
                alert('Please select a size.');
                return;
            }
        }
        const quantity = parseInt(select.value, 10);
        // Collect product data
        const product = {
            id: card.dataset.productId,
            title: card.querySelector('.product-title').textContent,
            price: parseFloat(card.querySelector('.product-price').textContent.replace(/[^\d.]/g, '')),
            image: card.querySelector('img').src,
            size: hasSize ? selectedSize : undefined,
            quantity: quantity
        };
        addToCart(product);
        // Open cart after adding
        cartDrawer.classList.add('open');
        cartDrawerOverlay.classList.add('open');
    });
});

// PRODUCT SEARCH LOGIC

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('product-search');
    const searchBtn = document.getElementById('product-search-btn');
    const productCards = document.querySelectorAll('.product-card');

    function getSearchableText(card) {
        let title = card.querySelector('.product-title')?.textContent ?? '';
        let price = '';
        card.querySelectorAll('.product-price').forEach(span => {
            price += ' ' + span.textContent;
        });
        let team = '';
        let section = card.closest('section');
        if (section) {
            let h1 = section.querySelector('h1');
            if (h1) team = h1.textContent;
        }
        let badge = card.querySelector('.product-badge')?.textContent ?? '';
        let prodid = card.dataset.productId ?? '';
        let sizes = '';
        if (card.dataset.sizes) sizes = card.dataset.sizes;
        return [title, price, team, badge, prodid, sizes].join(' ').toLowerCase();
    }

    function filterProducts() {
        const term = searchInput.value.trim().toLowerCase();
        let anyShown = false;
        productCards.forEach(card => {
            const searchable = getSearchableText(card);
            if (!term || searchable.includes(term)) {
                card.style.display = '';
                anyShown = true;
            } else {
                card.style.display = 'none';
            }
        });
        if (!anyShown && term) {
            alert("The item you searched is not available.");
        }
    }

    searchBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const term = searchInput.value.trim();
        if (term === "") {
            alert("Please put item first.");
            return;
        }
        filterProducts();
    });
    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const term = searchInput.value.trim();
            if (term === "") {
                alert("Please put item first.");
                return;
            }
            filterProducts();
        }
    });
    searchInput.addEventListener('input', filterProducts);
    searchInput.addEventListener('search', filterProducts);
});
// Place after your main JS

// Show checkout overlay after login
function showCheckoutOverlay() {
    // Fill order items
    const orderItemsDiv = document.getElementById('order-items');
    orderItemsDiv.innerHTML = '';
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        const div = document.createElement('div');
        div.className = 'order-item';
        div.innerHTML = `
      <img src="${item.image}" class="order-item-img" alt="">
      <div class="order-item-details">
        <div class="order-item-title">${item.title}</div>
        <div class="order-item-meta">Size: ${item.size || 'N/A'} &nbsp; Qty: ${item.quantity}</div>
      </div>
      <div class="order-item-price">₱${(item.price * item.quantity).toLocaleString()}</div>
    `;
        orderItemsDiv.appendChild(div);
    });

    // For demo: Show no discount, free shipping
    document.getElementById('order-subtotal').textContent = '₱' + subtotal.toLocaleString();
    document.getElementById('order-discount').textContent = '-₱0.00';
    document.getElementById('order-shipping').textContent = 'Free';
    document.getElementById('order-total').textContent = '₱' + subtotal.toLocaleString();

    document.getElementById('checkout-overlay').style.display = 'flex';
}

// Close checkout overlay
document.addEventListener('DOMContentLoaded', function () {
    const overlay = document.getElementById('checkout-overlay');
    overlay?.querySelector('.checkout-close')?.addEventListener('click', function () {
        overlay.style.display = 'none';
    });
    overlay?.addEventListener('click', function (e) {
        if (e.target === overlay) overlay.style.display = 'none';
    });
    // Payment button style selection
    document.querySelectorAll('.pay-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.pay-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });
    // Final checkout submit
    document.getElementById('order-checkout-final')?.addEventListener('click', function () {
        if (!document.getElementById('agree').checked) {
            alert("You must accept the agreement to continue.");
            return;
        }
        alert("Order placed! ");
        // Clear the cart
        cart = [];
        renderCartDrawer();
        document.getElementById('checkout-overlay').style.display = 'none';
    });
});

// --- Show overlay after login ---
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('modal-login-form');
    loginForm?.querySelector('form')?.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Login successfully! ');
        document.getElementById('login-signup-modal').style.display = 'none';
        showCheckoutOverlay();
    });
});
document.addEventListener('DOMContentLoaded', function() {
  // Open login/signup modal
  document.querySelectorAll('.account-nav-link').forEach(function(link){
    link.addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('cart-drawer-overlay').style.display = 'block';
      document.getElementById('login-signup-modal').style.display = 'flex';
      // Always show login on open
      document.getElementById('modal-login-form').style.display = '';
      document.getElementById('modal-signup-form').style.display = 'none';
    });
  });

  // Close modal on clicking close button or overlay
  document.querySelectorAll('.modal-close').forEach(function(btn) {
    btn.addEventListener('click', closeModal);
  });
  document.getElementById('cart-drawer-overlay').addEventListener('click', closeModal);

  function closeModal() {
    document.getElementById('cart-drawer-overlay').style.display = 'none';
    document.getElementById('login-signup-modal').style.display = 'none';
  }

  // Switch between login and signup forms
  document.getElementById('show-signup').addEventListener('click', function() {
    document.getElementById('modal-login-form').style.display = 'none';
    document.getElementById('modal-signup-form').style.display = '';
  });
  document.getElementById('show-login').addEventListener('click', function() {
    document.getElementById('modal-login-form').style.display = '';
    document.getElementById('modal-signup-form').style.display = 'none';
  });
});