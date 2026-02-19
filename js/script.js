document.addEventListener('DOMContentLoaded', function() {
    // Logo click - navigate to homepage or scroll to top
    const logoLinks = document.querySelectorAll('.logo');
    logoLinks.forEach(logo => {
        // Make logo clickable with proper cursor
        logo.style.cursor = 'pointer';
        
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const currentPage = window.location.pathname;
            const isHomePage = currentPage.includes('index.html') || currentPage === '/' || currentPage.endsWith('/');
            
            if (isHomePage) {
                // On homepage - smooth scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                // On other pages - navigate to homepage
                window.location.href = 'index.html';
            }
        });
        
        // Also handle touch events for better mobile support
        logo.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const currentPage = window.location.pathname;
            const isHomePage = currentPage.includes('index.html') || currentPage === '/' || currentPage.endsWith('/');
            
            if (isHomePage) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                window.location.href = 'index.html';
            }
        });
    });
    
    // Highlight active page in navigation
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop().replace('.html', '') || 'index';
    
    // Header navigation
    const headerLinks = document.querySelectorAll('.nav-links a');
    headerLinks.forEach(link => {
        const linkPage = link.getAttribute('href').replace('.html', '').replace('/', '');
        if (linkPage === currentPage || (currentPage === 'index' && linkPage === '')) {
            link.classList.add('active');
        }
    });
    
    // Footer navigation
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        const linkPage = link.getAttribute('href').replace('.html', '').replace('/', '');
        if (linkPage === currentPage || (currentPage === 'index' && linkPage === '')) {
            link.classList.add('active');
        }
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = navLinks.contains(event.target);
            const isClickOnToggle = mobileMenuToggle.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnToggle && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Hero Slider
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero-dot');
    let currentIndex = 0;
    let autoSlideInterval;
    
    if (heroSlides.length > 0) {
        function goToSlide(index) {
            // Remove active class from current slide and dot
            heroSlides[currentIndex].classList.remove('active');
            heroDots[currentIndex].classList.remove('active');
            
            // Update index
            currentIndex = index;
            
            // Add active class to new slide and dot
            heroSlides[currentIndex].classList.add('active');
            heroDots[currentIndex].classList.add('active');
        }
        
        function showNextSlide() {
            const nextIndex = (currentIndex + 1) % heroSlides.length;
            goToSlide(nextIndex);
        }
        
        // Auto-slide every 6 seconds for better readability
        function startAutoSlide() {
            autoSlideInterval = setInterval(showNextSlide, 6000);
        }
        
        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }
        
        // Add click event to dots
        heroDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoSlide(); // Reset timer when manually changing slides
            });
        });
        
        // Start auto-slide
        startAutoSlide();
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.service-card, .result-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // Animated Counter for Stats Section
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    let hasAnimated = false;
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    if (isNaN(target)) return; // Skip if not a valid number
                    
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            stat.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            stat.textContent = target;
                        }
                    };
                    
                    updateCounter();
                });
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});
