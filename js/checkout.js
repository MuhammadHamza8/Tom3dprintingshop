import { getCart, getCartTotal, clearCart } from './cart.js';

const DELIVERY_COST = 4.99;
const STRIPE_PUBLIC_KEY = 'pk_test_51QkKQoP8VHqxxxxx';

let stripe;
let cardElement;

function initializeStripe() {
    if (typeof Stripe === 'undefined') {
        console.error('Stripe.js not loaded');
        return;
    }

    stripe = Stripe(STRIPE_PUBLIC_KEY);
    const elements = stripe.elements();

    cardElement = elements.create('card', {
        style: {
            base: {
                fontSize: '16px',
                color: '#000',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                '::placeholder': {
                    color: '#aaa',
                },
            },
        },
    });

    cardElement.mount('#card-element');

    cardElement.on('change', (event) => {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });
}

function renderOrderSummary() {
    const cart = getCart();

    if (cart.length === 0) {
        window.location.href = '/cart.html';
        return;
    }

    const orderItemsContainer = document.getElementById('orderItems');
    orderItemsContainer.innerHTML = cart.map(item => `
        <div class="order-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>£${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    const subtotal = getCartTotal();
    const total = subtotal + DELIVERY_COST;

    document.getElementById('checkoutSubtotal').textContent = `£${subtotal.toFixed(2)}`;
    document.getElementById('checkoutDelivery').textContent = `£${DELIVERY_COST.toFixed(2)}`;
    document.getElementById('checkoutTotal').textContent = `£${total.toFixed(2)}`;
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const submitButton = document.getElementById('submitPayment');
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';

    const formData = new FormData(event.target);
    const billingDetails = {
        name: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: {
            line1: formData.get('address'),
            city: formData.get('city'),
            postal_code: formData.get('postcode'),
            country: 'GB',
        },
    };

    try {
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: billingDetails,
        });

        if (error) {
            const errorElement = document.getElementById('card-errors');
            errorElement.textContent = error.message;
            submitButton.disabled = false;
            submitButton.textContent = 'Complete Order';
            return;
        }

        alert('Payment Successful! (Test Mode)\n\nThank you for your order. In production, this would process your payment through Stripe.\n\nPayment Method ID: ' + paymentMethod.id);

        clearCart();
        window.location.href = '/?success=true';

    } catch (error) {
        console.error('Payment error:', error);
        alert('An error occurred processing your payment. Please try again.');
        submitButton.disabled = false;
        submitButton.textContent = 'Complete Order';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderOrderSummary();
    initializeStripe();

    const checkoutForm = document.getElementById('checkoutForm');
    checkoutForm.addEventListener('submit', handleFormSubmit);
});
