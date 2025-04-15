document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.add('active');
    });

    closeMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
    });

    // Close menu when clicking out
    document.addEventListener('click', function(event) {
        if (!mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
            mobileMenu.classList.remove('active');
        }
    });
});