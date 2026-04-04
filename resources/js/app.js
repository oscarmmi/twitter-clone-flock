import './bootstrap';
import Alpine from 'alpinejs';
import { router } from '@inertiajs/core';

window.Alpine = Alpine;

const el = document.getElementById('app');

if (el) {
    const pageData = JSON.parse(el.dataset.page);
    
    const resolve = (name) => {
        const pages = import.meta.glob('./Pages/**/*.js', { eager: true });
        return pages[`./Pages/${name}.js`];
    };

    const render = (page) => {
        const module = resolve(page.component);
        if (module && module.default) {
            el.innerHTML = module.default(page.props);
            // We need to re-initialize Alpine on the new content
            Alpine.start();
        } else {
            console.error('Inertia component not found:', page.component);
        }
    };

    // Initial render
    render(pageData);

    // Listen for subsequent navigations
    router.on('navigate', (event) => {
        render(event.detail.page);
    });
}

