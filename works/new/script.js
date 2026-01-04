// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjust for sticky header
                behavior: 'smooth'
            });
        }
    });
});

// Helper to load video lazily
const loadVideo = (video) => {
    if (video.dataset.src && !video.src) {
        video.src = video.dataset.src;
        video.load(); // Start loading the video
    }
};

// Video hover playback logic (for Desktop)
document.querySelectorAll('.game-card').forEach(card => {
    const video = card.querySelector('video');
    if (video) {
        card.addEventListener('mouseenter', () => {
            if (window.innerWidth >= 768) {
                loadVideo(video);
                video.play().catch(err => console.log('Video play interrupted:', err));
            }
        });
        card.addEventListener('mouseleave', () => {
            if (window.innerWidth >= 768) {
                video.pause();
                video.currentTime = 0; // Reset to start
            }
        });
    }
});

// IntersectionObserver for mobile auto-play
const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -30% 0px', // Detects when the card is in the central 40% of the screen
    threshold: 0.2
};

const mobileObserver = new IntersectionObserver((entries) => {
    if (window.innerWidth >= 768) return;

    entries.forEach(entry => {
        const video = entry.target.querySelector('video');
        if (!video) return;

        if (entry.isIntersecting) {
            entry.target.classList.add('is-active');
            loadVideo(video);
            video.play().catch(err => { });
        } else {
            entry.target.classList.remove('is-active');
            video.pause();
            video.currentTime = 0;
        }
    });
}, observerOptions);

document.querySelectorAll('.game-card').forEach(card => {
    mobileObserver.observe(card);
});

console.log('Pufferfish Digital Site Loaded! 🐡');
// Stateful Logo Shine logic
const logoContainer = document.querySelector(".logo-container");
if (logoContainer) {
    let isShineActive = false;

    const triggerShine = () => {
        if (!isShineActive) {
            isShineActive = true;
            logoContainer.classList.add("active-shine");
            // Auto-reset after animation completes
            setTimeout(() => {
                logoContainer.classList.remove("active-shine");
                isShineActive = false; // Reset flag to allow repeat triggers
            }, 800); // Match CSS animation duration
        }
    };

    // Desktop hover (mouseenter)
    logoContainer.addEventListener("mouseenter", triggerShine);

    // Reset flag when mouse leaves so it can trigger again on next enter
    logoContainer.addEventListener("mouseleave", () => {
        isShineActive = false;
        logoContainer.classList.remove("active-shine");
    });

    // Mobile click / general click
    logoContainer.addEventListener("click", triggerShine);
}
