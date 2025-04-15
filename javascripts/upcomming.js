document.addEventListener('DOMContentLoaded', () => {
    // Initialize game carousel functionality
    const initGameCarousel = () => {
        const carousel = document.querySelector('.game-carousel');
        if (!carousel) return;
        
        const track = carousel.querySelector('.game-carousel-track');
        const cards = track.querySelectorAll('.game-card');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        
        let currentPosition = 0;
        let slidesPerView = getSlidesPerView();
        
        // Determine number of visible slides based on viewport width
        function getSlidesPerView() {
            const width = window.innerWidth;
            if (width < 576) return 1;
            if (width < 992) return 2;
            if (width < 1200) return 3;
            return 4;
        }
        
        // Update carousel position
        function updateCarouselPosition() {
            // Calculate card width including gap
            const slideWidth = 100 / slidesPerView;
            const translateValue = -currentPosition * slideWidth;
            
            // Transform the track
            track.style.transform = `translateX(${translateValue}%)`;
            
            // Update button states
            updateButtonStates();
        }
        
        // Update navigation button states
        function updateButtonStates() {
            const maxPosition = Math.max(0, cards.length - slidesPerView);
            
            prevBtn.disabled = currentPosition <= 0;
            nextBtn.disabled = currentPosition >= maxPosition;
            
            prevBtn.style.opacity = currentPosition <= 0 ? '0.5' : '1';
            nextBtn.style.opacity = currentPosition >= maxPosition ? '0.5' : '1';
            
            prevBtn.style.cursor = currentPosition <= 0 ? 'not-allowed' : 'pointer';
            nextBtn.style.cursor = currentPosition >= maxPosition ? 'not-allowed' : 'pointer';
        }
        
        // Navigate to previous slide
        function goToPrevSlide() {
            if (currentPosition > 0) {
                currentPosition--;
                updateCarouselPosition();
            }
        }
        
        // Navigate to next slide
        function goToNextSlide() {
            const maxPosition = Math.max(0, cards.length - slidesPerView);
            if (currentPosition < maxPosition) {
                currentPosition++;
                updateCarouselPosition();
            }
        }
        
        // Add event listeners to buttons
        prevBtn.addEventListener('click', goToPrevSlide);
        nextBtn.addEventListener('click', goToNextSlide);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            // Update slides per view
            const newSlidesPerView = getSlidesPerView();
            
            // Only update if the number of visible slides changes
            if (newSlidesPerView !== slidesPerView) {
                slidesPerView = newSlidesPerView;
                
                // Reset position when layout changes
                currentPosition = 0;
                updateCarouselPosition();
            }
        });
        
        // Initialize carousel
        updateCarouselPosition();
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                goToPrevSlide();
            } else if (e.key === 'ArrowRight') {
                goToNextSlide();
            }
        });
        
        // Add touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        // Handle swipe gesture
        function handleSwipe() {
            const swipeDistance = touchEndX - touchStartX;
            const swipeThreshold = 50; // Minimum distance to qualify as a swipe
            if (swipeDistance > swipeThreshold) {
                goToPrevSlide(); // Swipe right
            } else if (swipeDistance < -swipeThreshold) {
                goToNextSlide(); // Swipe left
            }
        }
    };

    // Call the function to initialize the carousel
    initGameCarousel();
});
