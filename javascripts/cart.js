// This script handles a complete shopping cart system for an e-commerce site selling games and hardware
document.addEventListener('DOMContentLoaded', () => {
    // Get reference to the cart items table body where items will be displayed
    const cartTableBody = document.querySelector('#cart-items');
    // Define consistent keys for storing cart data in browser's localStorage
    const CART_STORAGE_KEY = 'shoppingCart'; // Main cart storage key
    const FAVORITES_STORAGE_KEY = 'favoriteCart'; // Storage key for saved favorite carts

    // Function to add custom buttons to the cart interface (Favorites and Clear Cart)
    function addCustomButtons() {
        // Find the cart summary section
        const cartSummary = document.querySelector('.cart-summary');
        if (!cartSummary) return; // Exit if the cart summary doesn't exist on current page
        
        // Create container for Favorites buttons
        const favoritesContainer = document.createElement('div');
        favoritesContainer.className = 'favorites-buttons';
        favoritesContainer.style.marginTop = '20px';
        favoritesContainer.style.display = 'flex';
        favoritesContainer.style.gap = '10px';
        
        // Create "Save as Favorite" button with styling
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save as Favorite';
        saveButton.className = 'save-favorite-btn';
        saveButton.style.flex = '1';
        saveButton.style.background = '#007bff'; // Blue background
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.padding = '10px';
        saveButton.style.borderRadius = '5px';
        saveButton.style.cursor = 'pointer';
        saveButton.style.transition = 'background-color 0.3s ease';
        
        // Create "Apply Favorite" button with styling
        const applyButton = document.createElement('button');
        applyButton.textContent = 'Apply Favorite';
        applyButton.className = 'apply-favorite-btn';
        applyButton.style.flex = '1';
        applyButton.style.background = '#28a745'; // Green background
        applyButton.style.color = 'white';
        applyButton.style.border = 'none';
        applyButton.style.padding = '10px';
        applyButton.style.borderRadius = '5px';
        applyButton.style.cursor = 'pointer';
        applyButton.style.transition = 'background-color 0.3s ease';
        
        // Add hover effects for better user experience
        saveButton.addEventListener('mouseover', () => {
            saveButton.style.background = '#0069d9'; // Darker blue on hover
        });
        saveButton.addEventListener('mouseout', () => {
            saveButton.style.background = '#007bff'; // Return to original blue
        });
        
        applyButton.addEventListener('mouseover', () => {
            applyButton.style.background = '#218838'; // Darker green on hover
        });
        applyButton.addEventListener('mouseout', () => {
            applyButton.style.background = '#28a745'; // Return to original green
        });
        
        // Add buttons to favorites container
        favoritesContainer.appendChild(saveButton);
        favoritesContainer.appendChild(applyButton);
        
        // Create container for Clear Cart button (separate for styling)
        const clearContainer = document.createElement('div');
        clearContainer.style.marginTop = '10px';
        
        // Create Clear Cart button with styling
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear Cart';
        clearButton.className = 'clear-cart-btn';
        clearButton.style.width = '100%';
        clearButton.style.background = '#dc3545'; // Red background
        clearButton.style.color = 'white';
        clearButton.style.border = 'none';
        clearButton.style.padding = '10px';
        clearButton.style.borderRadius = '5px';
        clearButton.style.cursor = 'pointer';
        clearButton.style.transition = 'background-color 0.3s ease';
        
        // Add hover effect for Clear Cart button
        clearButton.addEventListener('mouseover', () => {
            clearButton.style.background = '#c82333'; // Darker red on hover
        });
        clearButton.addEventListener('mouseout', () => {
            clearButton.style.background = '#dc3545'; // Return to original red
        });
        
        clearContainer.appendChild(clearButton);
        
        // Insert the button containers before payment methods section
        const paymentMethods = cartSummary.querySelector('.payment-methods');
        cartSummary.insertBefore(favoritesContainer, paymentMethods);
        cartSummary.insertBefore(clearContainer, paymentMethods);
        
        // Add event listeners to connect the buttons to their functions
        saveButton.addEventListener('click', saveCartAsFavorite);
        applyButton.addEventListener('click', applyFavoriteCart);
        clearButton.addEventListener('click', clearCart);
    }
    
    // Function to clear all items from the cart
    function clearCart() {
        // Get current cart from localStorage
        const storedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
        
        // Check if cart is already empty
        if (storedCart.length === 0) {
            showNotification('Cart is already empty', 'error');
            return;
        }
        
        // Ask for confirmation before clearing
        if (confirm('Are you sure you want to clear your entire cart?')) {
            // Empty the cart in localStorage
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
            // Update the cart display
            populateCart();
            // Show success notification
            showNotification('Cart has been cleared', 'success');
        }
    }
    
    // Function to save current cart as a favorite for later use
    function saveCartAsFavorite() {
        // Get current cart from localStorage
        const currentCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
        
        // Prevent saving an empty cart
        if (currentCart.length === 0) {
            showNotification('Cannot save an empty cart as favorite', 'error');
            return;
        }
        
        // Save current cart as favorite in localStorage
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(currentCart));
        // Show success notification
        showNotification('Current cart saved as favorite', 'success');
    }
    
    // Function to replace current cart with previously saved favorite cart
    function applyFavoriteCart() {
        // Get saved favorite cart from localStorage
        const favoriteCart = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) || [];
        
        // Check if a favorite cart exists
        if (favoriteCart.length === 0) {
            showNotification('No favorite cart saved', 'error');
            return;
        }
        
        // Replace current cart with favorite cart
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(favoriteCart));
        // Update the cart display
        populateCart();
        // Show success notification
        showNotification('Favorite cart applied', 'success');
    }
    
    // Function for displaying temporary notifications to the user
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.textContent = message;
        
        // Style notification based on type (success or error)
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.color = 'white';
        notification.style.fontWeight = 'bold';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0'; // Start invisible for fade-in
        notification.style.transition = 'opacity 0.3s ease';
        
        // Set background color based on notification type
        if (type === 'success') {
            notification.style.backgroundColor = '#28a745'; // Green for success
        } else if (type === 'error') {
            notification.style.backgroundColor = '#dc3545'; // Red for error
        }
        
        // Add notification to the page
        document.body.appendChild(notification);
        
        // Fade in effect using setTimeout
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Remove after delay (3 seconds) with fade-out effect
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300); // Wait for fade out before removing from DOM
        }, 3000);
    }
    
    // Main function to display cart items and update the interface
    function populateCart() {
        // Get current cart from localStorage
        const storedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
        // Clear current cart display
        cartTableBody.innerHTML = '';

        // If cart is empty, show empty cart message with link to continue shopping
        if (storedCart.length === 0) {
            cartTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center;">
                        <p>Your cart is empty.</p>
                        <a href="games.html" class="continue-shopping">Continue Shopping</a>
                    </td>
                </tr>
            `;
            return;
        }

        // Loop through each item in the cart and create table rows
        storedCart.forEach((item, index) => {
            const row = document.createElement('tr');
            // Generate HTML for the cart item including image, details, price, quantity controls, total, and action buttons
            row.innerHTML = `
                <td class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </td>
                <td class="item-details">
                    <h3>${item.name}</h3>
                    <p>${item.platform ? 'Platform: ' + item.platform : item.category ? 'Category: ' + item.category : ''}</p>
                </td>
                <td class="item-price">
                    <p class="final-price">$${item.price.toFixed(2)}</p>
                </td>
                <td class="item-quantity">
                    <button class="qty-btn decrease" data-index="${index}">-</button>
                    <input type="number" value="${item.quantity || 1}" min="1" max="10" class="qty-input" data-index="${index}">
                    <button class="qty-btn increase" data-index="${index}">+</button>
                </td>
                <td class="item-total">
                    <p>$${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                </td>
                <td class="item-actions">
                    <button class="remove-btn" data-index="${index}">Remove</button>
                    <button class="wishlist-btn">Save for Later</button>
                </td>
            `;
            cartTableBody.appendChild(row);

            // Add event listeners to each row's interactive elements
            // Remove button - deletes item with animation
            row.querySelector('.remove-btn').addEventListener('click', () => removeItem(index));
            // Quantity decrease button
            row.querySelector('.decrease').addEventListener('click', () => adjustQuantity(index, -1));
            // Quantity increase button
            row.querySelector('.increase').addEventListener('click', () => adjustQuantity(index, 1));
            // Quantity input field for direct quantity entry
            row.querySelector('.qty-input').addEventListener('change', (event) => updateQuantity(index, parseInt(event.target.value)));
            // Wishlist button (currently just shows alert, could be expanded)
            row.querySelector('.wishlist-btn').addEventListener('click', () => {
                alert(`Item "${item.name}" saved for later!`);
            });
        });

        // Update order summary with new totals
        updateSummary(storedCart);
    }

    // Function to increase or decrease item quantity
    function adjustQuantity(index, change) {
        // Get current cart
        const storedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
        // Adjust quantity ensuring it doesn't go below 1
        storedCart[index].quantity = Math.max(1, (storedCart[index].quantity || 1) + change);
        // Save updated cart
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(storedCart));
        // Refresh cart display
        populateCart();
    }

    // Function to update quantity from direct input
    function updateQuantity(index, value) {
        // Get current cart
        const storedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
        // Update quantity ensuring it doesn't go below 1
        storedCart[index].quantity = Math.max(1, value);
        // Save updated cart
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(storedCart));
        // Refresh cart display
        populateCart();
    }

    // Function to remove item with animation effect
    function removeItem(index) {
        // Get all cart item rows
        const cartItems = document.querySelectorAll('#cart-items tr');
        const rowToRemove = cartItems[index];

        // Check if the row exists
        if (!rowToRemove) return;

        // Add CSS class for swipe-out animation
        rowToRemove.classList.add('swipe-out');

        // Wait for the animation to complete before removing the item
        rowToRemove.addEventListener('animationend', () => {
            // Get current cart
            const storedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
            // Remove item from cart array
            storedCart.splice(index, 1);
            // Save updated cart
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(storedCart));
            // Refresh cart display
            populateCart();
        });
    }

    // Function to update the order summary section with prices and totals
    function updateSummary(cartItems) {
        // Get elements for subtotal, total, and item count
        const subtotalElem = document.querySelector('.summary-item span:last-child');
        const totalElem = document.querySelector('.summary-total span:last-child');
        const subtotalItemsElem = document.querySelector('.summary-item span:first-child');

        // Exit if any required elements don't exist
        if (!subtotalElem || !subtotalItemsElem || !totalElem) return;

        let subtotal = 0;
        let totalItems = 0;

        // Calculate subtotal and count items
        cartItems.forEach(item => {
            const quantity = item.quantity || 1;
            subtotal += item.price * quantity;
            totalItems += quantity;
        });

        // Update the subtotal price display
        subtotalElem.textContent = `$${subtotal.toFixed(2)}`;

        // Total is now the same as subtotal (no tax or shipping)
        totalElem.textContent = `$${subtotal.toFixed(2)}`;

        // Update the item count text with appropriate singular/plural form
        subtotalItemsElem.textContent = `Subtotal (${totalItems} ${totalItems === 1 ? 'item' : 'items'})`;
    }

    // Helper function to determine category for hardware items
    function getItemCategory(card) {
        if (card.classList.contains('part-card')) return 'Processor';
        if (card.classList.contains('graphics-card')) return 'Graphics Card';
        if (card.classList.contains('storage-item')) return 'Storage';
        return 'Hardware'; // Default category
    }

    // Function to migrate data from old cart system (one-time operation)
    function migrateOldCart() {
        // Check for old cart data
        const oldCart = JSON.parse(localStorage.getItem('cartItems')) || [];
        if (oldCart.length > 0) {
            // Get current cart (if any)
            const newCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];

            // Merge old cart items into new cart
            oldCart.forEach(oldItem => {
                // Check if item already exists in new cart
                const existingItem = newCart.find(item => item.id === oldItem.id);
                if (existingItem) {
                    // If exists, add quantities
                    existingItem.quantity += (oldItem.quantity || 1);
                } else {
                    // If new, add item to new cart
                    newCart.push(oldItem);
                }
            });

            // Save merged cart and clear old cart
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
            localStorage.removeItem('cartItems');
        }
    }

    // Event listeners for "Add to Cart" buttons on games page
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Get product details from button's data attributes
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            const image = button.closest('.game-item, .product-card').querySelector('img').src;
            
            // Get current cart
            const storedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
            // Check if item already exists in cart
            const existingItem = storedCart.find(item => item.id === id);

            if (existingItem) {
                // If exists, increase quantity
                existingItem.quantity = (existingItem.quantity || 1) + 1;
            } else {
                // If new, add to cart
                storedCart.push({
                    id,
                    name,
                    price,
                    image,
                    quantity: 1,
                    platform: 'PC' // Default platform
                });
            }

            // Save updated cart
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(storedCart));
            // Show notification
            showNotification(`${name} added to cart!`, 'success');
            // Refresh cart if we're on the cart page
            populateCart();
        });
    });

    // Event listeners for "Add to Cart" buttons on peripherals/hardware page
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            // Find parent product card
            const card = button.closest('.part-card, .graphics-card, .storage-item');
            if (!card) return; // Exit if no parent card found

            // Get product details from card elements
            const itemId = card.id;
            const nameElement = card.querySelector('.part-name, .graphics-card-name, .storage-name');
            const priceElement = card.querySelector('.part-price, .graphics-card-price, .storage-price-back');
            if (!nameElement || !priceElement) return; // Exit if required elements not found

            const itemName = nameElement.innerText;
            const itemPrice = parseFloat(priceElement.innerText.replace('$', ''));
            const itemImage = card.querySelector('img')?.src || '';
            
            // Get current cart
            const storedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
            // Check if item already exists in cart
            const existingItem = storedCart.find(item => item.id === itemId);

            if (existingItem) {
                // If exists, increase quantity
                existingItem.quantity = (existingItem.quantity || 1) + 1;
            } else {
                // If new, add to cart
                storedCart.push({
                    id: itemId,
                    name: itemName,
                    price: itemPrice,
                    image: itemImage,
                    quantity: 1,
                    category: getItemCategory(card) // Determine category based on card type
                });
            }

            // Save updated cart
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(storedCart));
            // Show notification
            showNotification(`${itemName} added to cart!`, 'success');
        });
    });

    // Initial Setup - run when page loads
    migrateOldCart(); // Migrate any old cart data
    addCustomButtons(); // Add custom buttons to interface
    populateCart(); // Display cart contents
});