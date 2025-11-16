const BACKEND_URL = 'http://localhost:5000';

let products = [];
let cart = JSON.parse(localStorage.getItem('luxeCart')) || [];
let currentModalProduct = null;

// Dark Mode Functions
function initDarkMode() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
    } else {
        updateThemeIcon(false);
    }
}

function toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-mode');

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);

    // Add a smooth transition effect
    body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
}

function updateThemeIcon(isDark) {
    const icon = document.getElementById('themeIcon');
    if (icon) {
        if (isDark) {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }
}

function saveCart() {
    localStorage.setItem('luxeCart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) cartCountElement.textContent = count;
}

function getCartItemsForAPI() {
    return cart.map(item => ({
        productId: item._id.toString(),
        name: item.name,
        quantity: item.quantity,
        price: item.price
    }));
}

function getCurrentCartTotal() {
    return cart.reduce((total, item) => total + (item.quantity * (item.price || 0)), 0);
}

function showSection(sectionId) {
    document.querySelectorAll('.content-section, .hero').forEach(section => {
        section.classList.remove('active-section');
    });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active-section');
        const headerHeight = document.querySelector('.header').offsetHeight;
        window.scrollTo({ top: targetSection.offsetTop - headerHeight, behavior: 'smooth' });
    }
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    if (!modal) return;
    if (modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { modal.style.display = 'none'; }, 400);
    } else {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        setTimeout(() => modal.classList.add('active'), 10);
        hideCheckout();
    }
}

function showCheckout() {
    if (cart.length === 0) return;
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutForm = document.getElementById('checkoutForm');
    if (cartItems) cartItems.style.display = 'none';
    if (cartTotal) cartTotal.style.display = 'none';
    if (checkoutForm) {
        checkoutForm.classList.add('active');
        const placeOrderBtn = checkoutForm.querySelector('.place-order-btn');
        if (placeOrderBtn) placeOrderBtn.textContent = 'Submit Quote Request';
        const paymentSection = checkoutForm.querySelector('.payment-section');
        if (paymentSection) paymentSection.style.display = 'none';
    }
}

function hideCheckout() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutForm = document.getElementById('checkoutForm');
    if (cartItems) cartItems.style.display = 'block';
    if (cartTotal) cartTotal.style.display = 'block';
    if (checkoutForm) checkoutForm.classList.remove('active');
}

async function fetchProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    grid.innerHTML = '<p style="text-align: center; padding: 50px;">Loading products...</p>';

    try {
        const response = await fetch(`${BACKEND_URL}/api/products`);
        products = await response.json();
        renderProducts(products);
    } catch {
        grid.innerHTML = '<p style="text-align: center; padding: 50px; color: red;">Error loading products.</p>';
    }
}

function renderProducts(productsToRender = products) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    if (productsToRender.length === 0) {
        grid.innerHTML = '<p style="text-align: center; padding: 50px;">No products found.</p>';
        return;
    }

    grid.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-category="${product.category}" onclick="openProductModal('${product._id}')">
            <img src="${product.imageUrl}" class="product-image">
            <div class="product-actions">
                <button class="action-btn like-btn" onclick="toggleLike('${product._id}', event)">
                    <i class="fa-regular fa-heart"></i>
                </button>
                <button class="action-btn cart-action-btn" onclick="addToCart('${product._id}', event)">
                    <i class="fa-solid fa-cart-shopping"></i>
                </button>
            </div>
            <div class="product-info">
                <p class="product-title">${product.name}</p>
                <p class="product-category">${product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : ''}</p>
            </div>
        </div>
    `).join('');
}

function filterProducts(category, event) {
    if (event) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
    }
    const filtered = category === 'all' ? products : products.filter(p => p.category === category);
    renderProducts(filtered);
}

function toggleLike(productId, event) {
    event.stopPropagation();
    const icon = event.currentTarget.querySelector('i');
    if (icon.classList.contains('fa-regular')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
        event.currentTarget.style.color = '#FF3B30';
    } else {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
        event.currentTarget.style.color = '#000';
    }
}

function addToCart(productId, event) {
    event.stopPropagation();
    const product = products.find(p => p._id === productId);
    const existingItem = cart.find(item => item._id === productId);

    if (existingItem) existingItem.quantity += 1;
    else cart.push({...product, quantity: 1 });

    saveCart();
    updateCartCount();
    renderCart();

    const button = event.currentTarget;
    const icon = button.querySelector('i');
    const old = icon.className;
    const bg = button.style.background;
    icon.className = 'fa-solid fa-check';
    button.style.background = '#34C759';

    setTimeout(() => {
        icon.className = old;
        button.style.background = bg;
    }, 1000);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item._id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item._id === productId);
    if (!item) return;
    item.quantity += change;
    if (item.quantity <= 0) removeFromCart(productId);
    else {
        saveCart();
        updateCartCount();
        renderCart();
    }
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutForm = document.getElementById('checkoutForm');
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <p>Your cart is empty</p>
                <p>Add items to request a quote.</p>
            </div>
        `;
        if (cartTotal) cartTotal.style.display = 'none';
        if (checkoutForm) checkoutForm.classList.remove('active');
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.imageUrl}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item._id}', -1)">−</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item._id}', 1)">+</button>
                </div>
            </div>
        </div>
    `).join('');

    if (cartTotal) {
        cartTotal.style.display = 'block';
        const checkoutBtn = cartTotal.querySelector('.checkout-btn');
        if (checkoutBtn) checkoutBtn.textContent = 'Request Quote';
    }

    hideCheckout();
}

// Product Modal Functions
function openProductModal(productId) {
    const product = products.find(p => p._id === productId);
    if (!product) return;

    currentModalProduct = product;
    const modal = document.getElementById('productModal');

    // Populate modal with product details
    document.getElementById('modalProductImage').src = product.imageUrl;
    document.getElementById('modalCategory').textContent = product.category ? product.category.toUpperCase() : '';
    document.getElementById('modalTitle').textContent = product.name;

    // Create a description (you can add this field to your products)
    const description = product.description || 'Premium quality apparel crafted with authentic African fabrics. Each piece tells a story of heritage, culture, and modern style. Perfect for those who want to make a bold statement while celebrating African artistry.';
    document.getElementById('modalDescription').textContent = description;

    // Create features list (you can add this field to your products)
    const features = product.features || [
        'Authentic African fabric',
        'Ethically sourced materials',
        'Handcrafted by local artisans',
        'Modern contemporary fit',
        'Limited edition piece'
    ];

    const featuresList = document.getElementById('modalFeatures');
    featuresList.innerHTML = features.map(feature => `<li>${feature}</li>`).join('');

    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
        modal.style.display = 'none';
        currentModalProduct = null;
    }, 300);
}

function toggleModalLike() {
    const btn = document.getElementById('modalLikeBtn');
    const icon = btn.querySelector('i');

    if (icon.classList.contains('fa-regular')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
        btn.classList.add('liked');
        btn.innerHTML = '<i class="fa-solid fa-heart"></i> Added to Wishlist';
    } else {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
        btn.classList.remove('liked');
        btn.innerHTML = '<i class="fa-regular fa-heart"></i> Add to Wishlist';
    }
}

function addToCartFromModal() {
    if (!currentModalProduct) return;

    const existingItem = cart.find(item => item._id === currentModalProduct._id);

    if (existingItem) existingItem.quantity += 1;
    else cart.push({...currentModalProduct, quantity: 1 });

    saveCart();
    updateCartCount();
    renderCart();

    // Visual feedback
    const btn = document.getElementById('modalAddCartBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Added to Cart!';
    btn.style.background = '#34C759';
    btn.style.borderColor = '#34C759';

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
    }, 2000);
}

async function processOrder(event) {
    event.preventDefault();
    const form = document.getElementById('checkoutForm');

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    if (cart.length === 0) {
        alert('Your quote request is empty!');
        return;
    }

    const btn = document.querySelector('.place-order-btn');
    const txt = btn.textContent;
    btn.textContent = 'Submitting...';
    btn.disabled = true;

    const quoteData = {
        fullName: document.getElementById('fullName').value,
        emailAddress: document.getElementById('emailAddress').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        shippingAddress: document.getElementById('shippingAddress').value,
        city: document.getElementById('city').value,
        country: document.getElementById('country').value,
        items: getCartItemsForAPI(),
        totalAmount: getCurrentCartTotal()
    };

    try {
        const response = await fetch(`${BACKEND_URL}/api/quotes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quoteData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(`Quote Submitted!\nQuote ID: ${result.quoteId}`);
            cart = [];
            saveCart();
            updateCartCount();
            renderCart();
            form.reset();
            toggleCart();
        } else {
            alert(`Submission failed: ${result.message}`);
        }
    } finally {
        btn.textContent = txt;
        btn.disabled = false;
        hideCheckout();
    }
}

async function submitContactForm(event) {
    event.preventDefault();
    const btn = document.getElementById('contactSubmitBtn');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    const contactName = document.getElementById('contactName').value;
    const contactEmail = document.getElementById('contactEmail').value;
    const contactSubject = document.getElementById('contactSubject').value;
    const contactMessage = document.getElementById('contactMessage').value;

    if (!contactName || !contactEmail || !contactMessage) {
        alert('Please fill in all required fields.');
        btn.disabled = false;
        btn.textContent = 'Send Message';
        return;
    }

    const data = {
        contactName,
        contactEmail,
        contactSubject,
        contactMessage
    };

    try {
        const response = await fetch(`${BACKEND_URL}/api/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Message sent successfully!');
            document.getElementById('contactForm').reset();
        } else {
            alert(`Failed: ${result.message}`);
        }
    } catch {
        alert('Failed to send message.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Send Message';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode
    initDarkMode();

    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            if (e.target === this) toggleCart();
        });
    }

    // Close product modal when clicking outside
    const productModal = document.getElementById('productModal');
    if (productModal) {
        productModal.addEventListener('click', function(e) {
            if (e.target === this) closeProductModal();
        });
    }

    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) checkoutForm.addEventListener('submit', processOrder);

    updateCartCount();
    fetchProducts();

    const currentHash = window.location.hash.substring(1) || 'hero';
    showSection(currentHash);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const id = this.getAttribute('href').substring(1);
            if (['products', 'about', 'contact', 'hero'].includes(id)) {
                e.preventDefault();
                showSection(id);
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeProductModal();
            if (document.getElementById('cartModal').classList.contains('active')) {
                toggleCart();
            }
        }
    });
});