document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset for fixed header
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll class to header for styling
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('mobile-open');
            hamburger.setAttribute('aria-expanded', 
                hamburger.classList.contains('active'));
            // Prevent body scroll when menu is open
            document.body.style.overflow = 
                navLinks.classList.contains('mobile-open') ? 'hidden' : '';
        });
        
        // Close menu when a nav link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('mobile-open');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Easter Egg: Confetti on clicking headshot 5 times
    const easterEggTrigger = document.getElementById('easter-egg-trigger');
    if (easterEggTrigger) {
        let clickCount = 0;
        easterEggTrigger.addEventListener('click', () => {
            clickCount++;
            easterEggTrigger.style.transform = 'scale(0.95)';
            setTimeout(() => easterEggTrigger.style.transform = 'scale(1)', 100);
            
            if (clickCount === 5) {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#2b6cb0', '#ffffff', '#ffd700']
                });
                clickCount = 0; // Reset
            }
        });
    }
});
