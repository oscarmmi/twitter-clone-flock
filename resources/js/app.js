import './bootstrap';
import Alpine from 'alpinejs';
import { router } from '@inertiajs/core';

window.Alpine = Alpine;
window.router = router;

const el = document.getElementById('app');

if (el) {
    const pageData = JSON.parse(el.dataset.page);
    
    // Crucial: Priming the router with the initial page state
    router.page = pageData;

    const resolve = (name) => {
        const pages = import.meta.glob('./Pages/**/*.js', { eager: true });
        const path = `./Pages/${name}.js`;
        return pages[path]?.default;
    };

    const render = (page) => {
        const component = resolve(page.component);
        if (component) {
            // Update router's internal state so router.post knows the current URL
            router.page = page;
            
            // Render the new HTML string
            el.innerHTML = component(page.props);
            
            // If Alpine has already started, we need to tell it to look for new components.
            // If it hasn't started yet, Alpine.start() will handle it.
            if (window.Alpine.initialized) {
                // This is a common way to re-trigger Alpine on new DOM segments
                // since we are replacing the entire innerHTML.
                window.Alpine.discover();
            }
        } else {
            console.error('Inertia component not found:', page.component);
        }
    };

    // Initial render
    render(pageData);
    
    // Start Alpine
    Alpine.start();
    window.Alpine.initialized = true;

    // Listen for subsequent navigations (this handles router.post success)
    router.on('navigate', (event) => {
        render(event.detail.page);
    });
}
