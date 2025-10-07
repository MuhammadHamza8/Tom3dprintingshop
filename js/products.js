import { products } from './products-data.js';
import { addToCart } from './cart.js';

const categoryIcons = {
    keyrings: '🔑',
    models: '🎨',
    parts: '⚙️',
    tools: '🔧',
    accessories: '✨'
};

function renderProducts(filteredProducts) {
    const grid = document.getElementById('productsGrid');

    if (filteredProducts.length === 0) {
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No products found</p>';
        return;
    }

    grid.innerHTML = filteredProducts.map(product => `
        <a href="/product-detail.html?id=${product.id}" class="product-card">
            <div class="product-image">${categoryIcons[product.category]}</div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">£${product.price.toFixed(2)}</p>
            </div>
        </a>
    `).join('');
}

function filterProducts(category) {
    if (category === 'all') {
        return products;
    }
    return products.filter(p => p.category === category);
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category') || 'all';

    renderProducts(filterProducts(categoryParam));

    if (categoryParam !== 'all') {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === categoryParam) {
                btn.classList.add('active');
            }
        });
    }

    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            const category = e.target.dataset.category;
            const filtered = filterProducts(category);
            renderProducts(filtered);

            const url = new URL(window.location);
            if (category === 'all') {
                url.searchParams.delete('category');
            } else {
                url.searchParams.set('category', category);
            }
            window.history.pushState({}, '', url);
        });
    });
});
