document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const closeBtn = document.querySelector('.close-btn');
    
    // Scroll, Minimum scroll amount(last one)
    const header = document.querySelector('.header-main');
    let lastScrollPosition = 0;
    const scrollThreshold = 100; 
    
    //  toggle mobile menu
    const toggleMobileMenu = () => {
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    };
    
    // click for hamburger button
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // click for close button
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Close menu, click outside
    document.addEventListener('click', (e) => {
        if (mobileNav.classList.contains('active') && !mobileNav.contains(e.target)) {
            toggleMobileMenu();
        }
    });
    
    // Prevent clicks inside mobile
    mobileNav.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    //scroll events
    window.addEventListener('scroll', () => {
        const currentScrollPosition = window.pageYOffset;
        
        // Check scrolled past the threshold
        if (Math.abs(currentScrollPosition - lastScrollPosition) < scrollThreshold) {
            return;
        }
        
        // Scrolling down
        if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 100) {
            header.classList.add('nav-hidden');
        }
        // Scrolling up
        else {
            header.classList.remove('nav-hidden');
        }
        
        lastScrollPosition = currentScrollPosition;
    });
});