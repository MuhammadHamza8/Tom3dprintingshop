import { getCart, removeFromCart, updateCartItemQuantity, getCartTotal } from './cart.js';

const categoryIcons = {
    keyrings: '🔑',
    models: '🎨',
    parts: '⚙️',
    tools: '🔧',
    accessories: '✨'
};

const DELIVERY_COST = 4.99;

function renderCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <a href="products.html" class="btn-primary">Continue Shopping</a>
            </div>
        `;
        cartSummary.style.display = 'none';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">${categoryIcons[item.category]}</div>
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>${item.category}</p>
            </div>
            <div class="cart-item-quantity">
                <input type="number"
                       value="${item.quantity}"
                       min="1"
                       max="99"
                       class="quantity-input"
                       data-id="${item.id}">
            </div>
            <div class="cart-item-price">£${(item.price * item.quantity).toFixed(2)}</div>
            <button class="remove-btn" data-id="${item.id}">&times;</button>
        </div>
    `).join('');

    cartSummary.style.display = 'block';
    updateSummary();

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            removeFromCart(productId);
            renderCart();
        });
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const productId = parseInt(e.target.dataset.id);
            const quantity = parseInt(e.target.value) || 1;
            updateCartItemQuantity(productId, quantity);
            renderCart();
        });
    });
}

function updateSummary() {
    const subtotal = getCartTotal();
    const total = subtotal + DELIVERY_COST;

    document.getElementById('subtotal').textContent = `£${subtotal.toFixed(2)}`;
    document.getElementById('delivery').textContent = `£${DELIVERY_COST.toFixed(2)}`;
    document.getElementById('total').textContent = `£${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});
