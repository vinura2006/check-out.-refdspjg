document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const topNav = document.querySelector('.top-nav');
    const platformNav = document.querySelector('.platform-nav');
    
    hamburgerBtn.addEventListener('click', function() {
        topNav.classList.toggle('hamburger-menu');
        platformNav.classList.toggle('hamburger-menu');
    });
});