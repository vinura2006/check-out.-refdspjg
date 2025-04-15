// Common functions used across all checkout pages
const CART_STORAGE_KEY = 'shoppingCart'; // Must match the key used in the cart.js

// Function to update the order summary with cart data
function updateOrderSummary() {
    // Get elements for subtotal, total, and tax
    const subtotalElem = document.getElementById('subtotal');
    const totalElem = document.getElementById('total');
    const taxElem = document.getElementById('tax');
    const shippingElem = document.getElementById('shipping');
    const orderItemsContainer = document.getElementById('order-items');
    
    // Exit if any required elements don't exist
    if (!subtotalElem || !totalElem || !taxElem || !orderItemsContainer || !shippingElem) return;
    
    // Get cart data from localStorage
    const cartItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    
    // Add some dummy data if cart is empty (for testing purposes)
    if (cartItems.length === 0) {
        cartItems.push({
            id: 1,
            name: "Sample Product",
            price: 29.99,
            quantity: 1,
            image: "/api/placeholder/60/60"
        });
        // Save the test data to localStorage
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
    
    // Clear current items
    orderItemsContainer.innerHTML = '';
    
    // Display message if cart is empty
    if (cartItems.length === 0) {
        orderItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <p>Your cart is empty.</p>
                <a href="index.html">Continue Shopping</a>
            </div>
        `;
        subtotalElem.textContent = '$0.00';
        taxElem.textContent = '$0.00';
        totalElem.textContent = '$0.00';
        return;
    }
    
    // Calculate subtotal and display cart items
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const quantity = item.quantity || 1;
        const itemTotal = item.price * quantity;
        subtotal += itemTotal;
        
        // Create and append item element
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <div class="item-image">
                <img src="${item.image || '/api/placeholder/60/60'}" alt="${item.name}">
            </div>
            <div class="item-details">
                <p class="item-name">${item.name}</p>
                <p class="item-price">$${item.price.toFixed(2)} × ${quantity}</p>
            </div>
            <div class="item-total">
                $${itemTotal.toFixed(2)}
            </div>
        `;
        orderItemsContainer.appendChild(itemElement);
    });
    
    // Set shipping cost (fixed for now)
    const shippingCost = 5.99;
    
    // Calculate tax (8%)
    const taxRate = 0.08;
    const taxAmount = subtotal * taxRate;
    
    // Calculate total
    const total = subtotal + shippingCost + taxAmount;
    
    // Update display
    subtotalElem.textContent = `$${subtotal.toFixed(2)}`;
    shippingElem.textContent = `$${shippingCost.toFixed(2)}`;
    taxElem.textContent = `$${taxAmount.toFixed(2)}`;
    totalElem.textContent = `$${total.toFixed(2)}`;
}

// Function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Function to handle form field validation with error display
function validateField(fieldId, errorId, validationFn) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(errorId);
    
    if (!field || !errorElement) return true; // Skip if elements don't exist
    
    const isValid = validationFn(field.value);
    
    if (!isValid) {
        field.classList.add('invalid');
        errorElement.style.display = 'block';
    } else {
        field.classList.remove('invalid');
        errorElement.style.display = 'none';
    }
    
    return isValid;
}

// Common validation functions
const validators = {
    // Validates that a field is not empty
    notEmpty: (value) => value.trim().length > 0,
    
    // Validates email format
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    
    // Validates phone number (at least 10 digits)
    phone: (value) => value.replace(/\D/g, '').length >= 10,
    
    // Validates zip code (basic validation)
    zipCode: (value) => value.trim().length >= 5,
    
    // Validates credit card number (checks length after stripping non-digits)
    creditCard: (value) => {
        const digits = value.replace(/\D/g, '');
        return digits.length >= 13 && digits.length <= 19;
    },
    
    // Validates expiry date format (MM/YY)
    expiryDate: (value) => /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value),
    
    // Validates CVV (3-4 digits)
    cvv: (value) => /^\d{3,4}$/.test(value)
};

// Function to redirect to a page with history
function navigateTo(url) {
    window.location.href = url;
}