import { products } from './products-data.js';
import { addToCart } from './cart.js';

const categoryIcons = {
    keyrings: '🔑',
    models: '🎨',
    parts: '⚙️',
    tools: '🔧',
    accessories: '✨'
};

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    const product = products.find(p => p.id === productId);

    if (!product) {
        document.getElementById('productDetailContent').innerHTML = '<p>Product not found</p>';
        return;
    }

    document.querySelector('.product-image-placeholder').innerHTML = categoryIcons[product.category];
    document.querySelector('.product-title').textContent = product.name;
    document.querySelector('.product-price').textContent = `£${product.price.toFixed(2)}`;
    document.querySelector('.product-category').textContent = product.category;
    document.querySelector('.product-description').textContent = product.description;

    document.title = `${product.name} - TOM 3D Printing Shop`;

    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const addToCartBtn = document.getElementById('addToCartBtn');

    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 99) {
            quantityInput.value = currentValue + 1;
        }
    });

    quantityInput.addEventListener('input', () => {
        let value = parseInt(quantityInput.value) || 1;
        if (value < 1) value = 1;
        if (value > 99) value = 99;
        quantityInput.value = value;
    });

    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        addToCart(product, quantity);

        addToCartBtn.textContent = 'Added to Cart!';
        addToCartBtn.style.backgroundColor = 'var(--color-black)';
        addToCartBtn.style.color = 'var(--color-white)';

        setTimeout(() => {
            addToCartBtn.textContent = 'Add to Cart';
            addToCartBtn.style.backgroundColor = '';
            addToCartBtn.style.color = '';
        }, 2000);
    });
});
