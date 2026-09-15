// ===== GS INIMA BRASIL - SCRIPT PRINCIPAL =====
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== HEADER SCROLL EFFECT =====
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');
    
    function handleScroll() {
        const scrollY = window.scrollY;
        
        // Header shadow
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Back to top visibility
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // ===== MOBILE MENU =====
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu on outside click
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== FADE IN ON SCROLL =====
    const fadeElements = document.querySelectorAll(
        '.sobre-grid, .brasil-historia, .gestao-card, .pilar-card, .qsmse-item, .contato-card, .cnae-info, .qsmse-quote'
    );
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        fadeObserver.observe(el);
    });

    // ===== ANIMATED COUNTERS =====
    const statItems = document.querySelectorAll('.stat-item h3');
    let countersAnimated = false;
    
    function animateCounters() {
        if (countersAnimated) return;
        
        statItems.forEach(stat => {
            const text = stat.textContent.trim();
            const numericValue = parseInt(text.replace(/\D/g, ''));
            
            if (!isNaN(numericValue) && numericValue > 0 && !text.includes('Milhões')) {
                let current = 0;
                const increment = Math.ceil(numericValue / 40);
                const suffix = text.includes('+') ? '+' : '';
                
                const updateCounter = () => {
                    current += increment;
                    if (current >= numericValue) {
                        current = numericValue;
                        stat.textContent = current + suffix;
                        return;
                    }
                    stat.textContent = current + suffix;
                    requestAnimationFrame(updateCounter);
                };
                
                // Reset and animate
                stat.textContent = '0' + suffix;
                setTimeout(() => updateCounter(), 200);
            }
        });
        
        countersAnimated = true;
    }
    
    // Trigger counters when hero stats are visible
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    heroObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        heroObserver.observe(heroStats);
    }

    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNav() {
        const scrollPos = window.scrollY + header.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
            
            if (navLink) {
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLink.style.background = 'var(--light-gray)';
                    navLink.style.color = 'var(--primary)';
                } else {
                    navLink.style.background = '';
                    navLink.style.color = '';
                }
            }
        });
    }
    
    window.addEventListener('scroll', highlightNav);

    // ===== INTERACTIVE CARD TILT EFFECT =====
    const cards = document.querySelectorAll('.gestao-card, .pilar-card, .info-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // ===== RIPPLE EFFECT ON BUTTONS =====
    const buttons = document.querySelectorAll('.btn, .estado-tag, .valor-tag');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: rgba(255,255,255,0.6);
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            if (getComputedStyle(this).position === 'static') {
                this.style.position = 'relative';
            }
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(30);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ===== PARALLAX EFFECT ON HERO =====
    window.addEventListener('scroll', function() {
        const hero = document.querySelector('.hero');
        if (hero) {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                hero.style.backgroundPositionY = scrolled * 0.3 + 'px';
            }
        }
    });

    // ===== TYPING EFFECT FOR HERO BADGE (opcional) =====
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
        heroBadge.style.opacity = '0';
        setTimeout(() => {
            heroBadge.style.transition = 'opacity 0.8s ease';
            heroBadge.style.opacity = '1';
        }, 100);
    }

    console.log('%c💧 GS Inima Brasil', 'font-size: 24px; font-weight: bold; color: #0077C8;');
    console.log('%cSite carregado com sucesso!', 'font-size: 14px; color: #00A99D;');
});
