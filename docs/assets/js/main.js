/**
 * Main JavaScript for Tech Insights Blog
 * This file is preserved during automatic regeneration
 */

// Theme management
class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        // Load saved theme or default to light
        const savedTheme = localStorage.getItem('meek_theme') || 'light';
        this.setTheme(savedTheme);

        // Add theme toggle button if it doesn't exist
        this.addThemeToggle();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-color-mode', theme);
        localStorage.setItem('meek_theme', theme);
        
        // Update theme toggle button if it exists
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = theme === 'light' ? '🌙' : '☀️';
            toggleBtn.title = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
        }
    }

    addThemeToggle() {
        // Check if theme toggle already exists
        if (document.querySelector('.theme-toggle')) return;

        const titleRight = document.querySelector('.title-right');
        if (!titleRight) return;

        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle circle';
        themeToggle.textContent = localStorage.getItem('meek_theme') === 'dark' ? '☀️' : '🌙';
        themeToggle.title = localStorage.getItem('meek_theme') === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
        themeToggle.style.cssText = 'font-size: 20px; cursor: pointer;';

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-color-mode');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        });

        titleRight.appendChild(themeToggle);
    }
}

// Smooth scroll for anchor links
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Copy code functionality
class CodeCopy {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('pre code').forEach(block => {
            const button = document.createElement('button');
            button.className = 'copy-button';
            button.textContent = 'Copy';
            button.style.cssText = `
                position: absolute;
                top: 4px;
                right: 4px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 12px;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s;
            `;

            const pre = block.parentElement;
            pre.style.position = 'relative';
            pre.appendChild(button);

            button.addEventListener('click', () => {
                navigator.clipboard.writeText(block.textContent).then(() => {
                    button.textContent = 'Copied!';
                    button.style.background = 'var(--secondary-color)';
                    setTimeout(() => {
                        button.textContent = 'Copy';
                        button.style.background = 'var(--primary-color)';
                    }, 2000);
                });
            });

            pre.addEventListener('mouseenter', () => button.style.opacity = '1');
            pre.addEventListener('mouseleave', () => button.style.opacity = '0.7');
        });
    }
}

// Image lazy loading and optimization
class ImageOptimizer {
    constructor() {
        this.init();
    }

    init() {
        const images = document.querySelectorAll('img');
        
        // Add loading="lazy" to images that don't have it
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add error handling
            img.addEventListener('error', () => {
                img.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.textContent = 'Image not available';
                placeholder.style.cssText = `
                    display: inline-block;
                    padding: 20px;
                    background: var(--border-color);
                    color: var(--text-color);
                    text-align: center;
                    border-radius: 4px;
                `;
                img.parentNode.insertBefore(placeholder, img);
            });
        });
    }
}

// Search functionality (if search elements exist)
class SearchManager {
    constructor() {
        this.init();
    }

    init() {
        const searchInput = document.querySelector('#search-input');
        const searchResults = document.querySelector('#search-results');

        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.performSearch(query, searchResults);
        });
    }

    performSearch(query, resultsContainer) {
        if (!resultsContainer) return;

        // Clear previous results
        resultsContainer.innerHTML = '';

        if (query.length < 2) {
            resultsContainer.style.display = 'none';
            return;
        }

        // Simple search implementation (can be enhanced)
        const posts = document.querySelectorAll('.post-preview, .list-item');
        const matches = [];

        posts.forEach(post => {
            const title = post.querySelector('h3, .listTitle')?.textContent.toLowerCase() || '';
            const content = post.querySelector('.post-excerpt, .listLabels')?.textContent.toLowerCase() || '';
            
            if (title.includes(query) || content.includes(query)) {
                matches.push(post.cloneNode(true));
            }
        });

        if (matches.length > 0) {
            resultsContainer.innerHTML = `<h3>Found ${matches.length} results:</h3>`;
            matches.forEach(match => resultsContainer.appendChild(match));
            resultsContainer.style.display = 'block';
        } else {
            resultsContainer.innerHTML = '<p>No results found.</p>';
            resultsContainer.style.display = 'block';
        }
    }
}

// Analytics and performance monitoring
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
        });

        // Track external link clicks
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            link.addEventListener('click', () => {
                console.log(`External link clicked: ${link.href}`);
            });
        });
    }
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new SmoothScroll();
    new CodeCopy();
    new ImageOptimizer();
    new SearchManager();
    new PerformanceMonitor();

    // Add fade-in animation to main content
    const mainContent = document.querySelector('main, .markdown-body, .post-content');
    if (mainContent) {
        mainContent.classList.add('fade-in');
    }

    console.log('Tech Insights Blog - Main JavaScript initialized');
});

// Export classes for potential use in other scripts
window.TechBlog = {
    ThemeManager,
    SmoothScroll,
    CodeCopy,
    ImageOptimizer,
    SearchManager,
    PerformanceMonitor
};