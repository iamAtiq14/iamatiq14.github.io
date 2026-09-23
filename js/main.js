/**
 * ATIQ UR REHMAN PORTFOLIO — INTERACTIVE LOGIC
 * Lightweight, zero-dependency, accessible vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('site-header');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', isOpen.toString());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('nav-open')) {
                navMenu.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Smooth Scrolling Between Navigation Sections with Header Offset ---
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;
            const targetId = href.substring(1);
            const targetEl = document.getElementById(targetId);

            if (targetEl) {
                e.preventDefault();

                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('nav-open')) {
                    navMenu.classList.remove('nav-open');
                    navToggle?.setAttribute('aria-expanded', 'false');
                }

                const headerHeight = header?.offsetHeight || 64;
                const elementPosition = targetEl.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - (headerHeight + 10);

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Immediate active link feedback
                navLinks.forEach(l => l.classList.remove('active'));
                const matchedNav = document.querySelector(`.nav-link[href*="${targetId}"]`);
                if (matchedNav) matchedNav.classList.add('active');

                // Update URL hash cleanly without instant jump
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
            }
        });
    });

    // --- Active Link Highlighting On Scroll ---
    const sections = document.querySelectorAll('section[id]');

    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;
        const headerHeight = header?.offsetHeight || 64;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - headerHeight - 45;
            const sectionId = current.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

            if (correspondingLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    correspondingLink.classList.add('active');
                } else {
                    correspondingLink.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll, { passive: true });
    highlightNavOnScroll(); // Trigger on initial load

    // --- Header Shadow on Scroll ---
    function checkHeaderScroll() {
        if (window.scrollY > 15) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', checkHeaderScroll, { passive: true });
    checkHeaderScroll();

    // --- Professional Subtle Section & Card Reveal Animations ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        // Collect key cards and sections for smooth entrance reveals
        const revealTargets = document.querySelectorAll(
            '.metrics-grid > .metric-card, .abis-container, .timeline-card, .project-card, .skill-category-card, .education-card, .principles-card, .contact-box'
        );

        // Add reveal-item class dynamically
        revealTargets.forEach(el => {
            el.classList.add('reveal-item');
        });

        // Add subtle staggered delays for items within grids
        const gridContainers = document.querySelectorAll('.metrics-grid, .projects-grid, .skills-grid, .contact-links-grid');
        gridContainers.forEach(grid => {
            const items = grid.querySelectorAll('.reveal-item');
            items.forEach((item, idx) => {
                item.style.transitionDelay = `${idx * 50}ms`;
            });
        });

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.06,
            rootMargin: '0px 0px -25px 0px'
        });

        revealTargets.forEach(el => {
            // If already inside the visible viewport on initial load, reveal immediately
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('is-revealed');
            } else {
                revealObserver.observe(el);
            }
        });
    }
});
