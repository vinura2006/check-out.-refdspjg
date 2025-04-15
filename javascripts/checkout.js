document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('checkout-form');
    const successMessage = document.getElementById('success-message');
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');
    
    // Define cart storage key to match the existing cart system
    const CART_STORAGE_KEY = 'shoppingCart';
    
    // Load cart data and populate order summary
    function loadCartData() {
        const storedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
        
        // If cart is empty, show message and disable checkout
        if (storedCart.length === 0) {
            document.getElementById('order-summary').innerHTML = `
                <div class="empty-cart-message">
                    <h2>Your cart is empty</h2>
                    <p>Please add items to your cart before checkout.</p>
                    <a href="games.html">Continue Shopping</a>
                </div>
            `;
            form.style.display = 'none';
            return;
        }
        
        // Clear previous items
        orderItemsContainer.innerHTML = '';
        
        // Calculate totals
        let subtotal = 0;
        let totalItems = 0;
        
        // Add items to order summary
        storedCart.forEach(item => {
            const quantity = item.quantity || 1;
            const itemTotal = item.price * quantity;
            subtotal += itemTotal;
            totalItems += quantity;
            
            // Create item element
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="order-item-image">
                <div class="order-item-details">
                    <p class="order-item-name">${item.name}</p>
                    <p class="order-item-meta">
                        ${item.platform ? 'Platform: ' + item.platform : item.category ? 'Category: ' + item.category : ''}
                        ${quantity > 1 ? ' × ' + quantity : ''}
                    </p>
                </div>
                <div class="order-item-price">$${itemTotal.toFixed(2)}</div>
            `;
            
            orderItemsContainer.appendChild(itemElement);
        });
        
        // Calculate tax and total
        const shipping = 5.99;
        const tax = subtotal * 0.08;
        const total = subtotal + tax + shipping;
        
        // Update summary display
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        shippingElement.textContent = `$${shipping.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
    
    // Show notification function (copied from cart.js)
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.textContent = message;
        
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.color = 'white';
        notification.style.fontWeight = 'bold';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        
        if (type === 'success') {
            notification.style.backgroundColor = '#28a745';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#dc3545';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Validation patterns
    const patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^\d{10,15}$/,
        zip: /^\d{5}(-\d{4})?$/,
        cardnumber: /^\d{16}$/,
        expiry: /^(0[1-9]|1[0-2])\/\d{2}$/,
        cvv: /^\d{3,4}$/
    };
    
    // Format card number as user types
    document.getElementById('cardnumber').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
        }
        
        e.target.value = value;
    });
    
    // Format expiry date as user types
    document.getElementById('expiry').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        e.target.value = value;
    });
    
    // Validate a field
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.id;
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        // Check if empty first
        if (field.required && value === '') {
            field.classList.add('invalid');
            errorElement.style.display = 'block';
            return false;
        }
        
        // Pattern validation for specific fields
        if (patterns[fieldName] && value !== '') {
            // Remove spaces for card number validation
            let testValue = value;
            if (fieldName === 'cardnumber') {
                testValue = value.replace(/\s/g, '');
            }
            
            if (!patterns[fieldName].test(testValue)) {
                field.classList.add('invalid');
                errorElement.style.display = 'block';
                return false;
            }
        }
        
        // Field is valid
        field.classList.remove('invalid');
        errorElement.style.display = 'none';
        return true;
    }
    
    // Add blur event listeners to all input fields
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('invalid')) {
                validateField(this);
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate all fields
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Show success message
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Clear the cart after successful order
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
            
            showNotification('Order placed successfully!', 'success');
            
            // In a real application, you would send the form data to the server here
            console.log('Form submitted successfully');
        } else {
            // Scroll to the first invalid field
            const firstInvalid = form.querySelector('.invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        }
    });
    
    // Load cart data on page load
    loadCartData();
});