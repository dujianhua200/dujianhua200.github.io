/**
 * Homepage-specific JavaScript for Tech Insights Blog
 * This file is preserved during automatic regeneration
 */

class HomePageManager {
    constructor() {
        this.init();
    }

    init() {
        this.createHeroSection();
        this.createStatsSection();
        this.createFeaturedPosts();
        this.createSocialLinks();
        this.createRecentTags();
        this.addScrollAnimations();
        this.setupIntersectionObserver();
    }

    createHeroSection() {
        const header = document.querySelector('#header');
        if (!header) return;

        const heroSection = document.createElement('div');
        heroSection.className = 'hero-section fade-in';
        heroSection.innerHTML = `
            <h1>Welcome to Tech Insights Blog</h1>
            <p>Exploring technology, development, and digital innovation through insightful articles and tutorials.</p>
        `;

        header.insertAdjacentElement('afterend', heroSection);
    }

    createStatsSection() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        const statsGrid = document.createElement('div');
        statsGrid.className = 'stats-grid slide-in-left';
        statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-number">2</div>
                <div class="stat-label">Articles</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">0</div>
                <div class="stat-label">Comments</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">11</div>
                <div class="stat-label">Total Views</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">2025</div>
                <div class="stat-label">Year Started</div>
            </div>
        `;

        heroSection.insertAdjacentElement('afterend', statsGrid);
    }

    createFeaturedPosts() {
        const statsGrid = document.querySelector('.stats-grid');
        if (!statsGrid) return;

        const featuredPosts = document.createElement('section');
        featuredPosts.className = 'featured-posts slide-in-right';
        featuredPosts.innerHTML = `
            <h2 class="section-title">Featured Posts</h2>
            <div id="featured-posts-container"></div>
        `;

        statsGrid.insertAdjacentElement('afterend', featuredPosts);
        this.populateFeaturedPosts();
    }

    populateFeaturedPosts() {
        const container = document.querySelector('#featured-posts-container');
        if (!container) return;

        // Get existing posts from the page
        const existingPosts = document.querySelectorAll('.list-item, .post-list-item');
        const maxPosts = Math.min(3, existingPosts.length);

        if (existingPosts.length === 0) {
            container.innerHTML = '<p>No posts available yet. Check back soon!</p>';
            return;
        }

        for (let i = 0; i < maxPosts; i++) {
            const post = existingPosts[i];
            const postPreview = document.createElement('article');
            postPreview.className = 'post-preview';

            const title = post.querySelector('.listTitle, h3')?.textContent || 'Untitled Post';
            const url = post.querySelector('a')?.href || '#';
            const date = post.querySelector('.LabelTime, .date')?.textContent || 'Recent';
            const labels = post.querySelectorAll('.Label');
            const excerpt = post.querySelector('.listLabels')?.textContent || 'Read this interesting article...';

            let labelsHtml = '';
            labels.forEach(label => {
                const labelText = label.textContent.trim();
                const labelColor = label.style.backgroundColor || '#0969da';
                if (labelText) {
                    labelsHtml += `<span class="Label" style="background-color: ${labelColor}; color: white;">${labelText}</span>`;
                }
            });

            postPreview.innerHTML = `
                <h3><a href="${url}">${title}</a></h3>
                <div class="post-meta">
                    <span>📅 ${date}</span>
                    ${labelsHtml ? `<span style="margin-left: 12px;">${labelsHtml}</span>` : ''}
                </div>
                <div class="post-excerpt">${excerpt}</div>
            `;

            container.appendChild(postPreview);
        }
    }

    createSocialLinks() {
        const featuredPosts = document.querySelector('.featured-posts');
        if (!featuredPosts) return;

        const socialSection = document.createElement('section');
        socialSection.className = 'social-section';
        socialSection.innerHTML = `
            <h2 class="section-title">Connect With Us</h2>
            <div class="social-links">
                <a href="https://github.com/dujianhua200" class="social-link" target="_blank" rel="noopener">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0016 8c0-4.42-3.58-8-8-8z"/>
                    </svg>
                    GitHub
                </a>
                <a href="https://linkedin.com/in/dujianhua200" class="social-link" target="_blank" rel="noopener">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 01.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                    </svg>
                    LinkedIn
                </a>
                <a href="https://twitter.com/dujianhua200" class="social-link" target="_blank" rel="noopener">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0016 3.542a6.658 6.658 0 01-1.889.518 3.301 3.301 0 001.447-1.817 6.533 6.533 0 01-2.087.793 3.286 3.286 0 00-5.594 2.997 9.325 9.325 0 01-6.767-3.429 3.289 3.289 0 001.018 4.382A3.323 3.323 0 01.64 6.575v.045a3.288 3.288 0 002.632 3.218 3.203 3.203 0 01-.865.115 3.23 3.23 0 01-.614-.057 3.283 3.283 0 003.067 2.277A6.588 6.588 0 01.78 13.58a6.32 6.32 0 01-.78-.045A9.344 9.344 0 005.026 15z"/>
                    </svg>
                    Twitter
                </a>
            </div>
        `;

        featuredPosts.insertAdjacentElement('afterend', socialSection);
    }

    createRecentTags() {
        const socialSection = document.querySelector('.social-section');
        if (!socialSection) return;

        const tagsSection = document.createElement('section');
        tagsSection.className = 'recent-tags-section';
        tagsSection.innerHTML = `
            <h2 class="section-title">Popular Topics</h2>
            <div class="recent-tags tag-cloud">
                <span class="Label" style="background-color: #0969da;">documentation</span>
                <span class="Label" style="background-color: #1f883d;">tutorial</span>
                <span class="Label" style="background-color: #bc4c00;">news</span>
                <span class="Label" style="background-color: #A333D0;">feature</span>
                <span class="Label" style="background-color: #d73a4a;">bug</span>
                <span class="Label" style="background-color: #a2eeef;">enhancement</span>
            </div>
        `;

        socialSection.insertAdjacentElement('afterend', tagsSection);
    }

    addScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.stat-card, .post-preview, .social-link').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    setupIntersectionObserver() {
        // Lazy load images and enhance performance
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Dynamic content updates
    updateStats(newStats) {
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length >= 4) {
            statNumbers[0].textContent = newStats.posts || '2';
            statNumbers[1].textContent = newStats.comments || '0';
            statNumbers[2].textContent = newStats.views || '11';
        }
    }

    addNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--secondary-color)' : 'var(--primary-color)'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize homepage functionality
document.addEventListener('DOMContentLoaded', () => {
    // Only run on homepage
    if (window.location.pathname === '/' || window.location.pathname.endsWith('/index.html')) {
        window.homePageManager = new HomePageManager();
        console.log('Tech Insights Blog - Homepage functionality initialized');
    }
});

// Export for potential use in other scripts
window.HomePageManager = HomePageManager;