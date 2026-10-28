// MOBILE MENU TOGGLE
const menuToggle = document.getElementById('menuToggle');
const navbar = document.getElementById('navbar');

menuToggle.addEventListener('click', function() {
    const isOpen = navbar.classList.toggle('active');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Mbyll menynë' : 'Hap menynë');
});

// Close menu when a link is clicked
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        navbar.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Hap menynë');
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// EmailJS setup for contact form
emailjs.init('mwlKHuIlaHkSrDoGS');

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    const statusEl = document.getElementById('contactStatus');

    statusEl.textContent = 'Duke u dërguar...';

    emailjs.send('service_w8fdzx8', 'template_jw4v03q', {
        name,
        email,
        phone,
        message
    }).then(() => {
        statusEl.textContent = 'U dërgua me sukses! Faleminderit.';
        statusEl.style.color = '#4caf50';
        e.target.reset();
    }).catch((err) => {
        console.error('EmailJS error', err);
        statusEl.textContent = 'Dështoi dërgimi. Provo sërish.';
        statusEl.style.color = '#e74c3c';
    });
});

// Header class toggle on scroll (përdor klasë, jo stil inline)
function updateHeaderOnScroll() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}
window.addEventListener('scroll', updateHeaderOnScroll);
// Kontroll fillestar në ngarkim (nëse faqja hapet të scrolluar)
window.addEventListener('load', updateHeaderOnScroll);

// Intersection Observer për animacione në scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};
        
const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);
        
// Apliko observer në të gjithë product-cards dhe section-titles
document.querySelectorAll('.product-card, .section-title, .about-content').forEach(el => {
    observer.observe(el);
});

// IMAGE MODAL FUNCTIONALITY
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeBtn = document.querySelector('.close');
        
// Kur klikojmë në fotot e produkteve
document.querySelectorAll('.product-image img').forEach(img => {
    img.addEventListener('click', function() {
        modal.style.display = 'flex';
        modalImage.src = this.src;
        document.body.style.overflow = 'hidden';
    });
});
        
// Kur klikojmë në X për mbyllie
closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});
        
// Kur klikojmë jashtë modalit
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});
        
// Close modal me ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// GALLERY FUNCTIONALITY - Complete rewrite
const galleryContainer = document.querySelector('.gallery-container');
const galleryWrapper = document.getElementById('galleryWrapper');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const galleryNav = document.getElementById('galleryNav');
const currentSlideSpan = document.getElementById('currentSlide');
const totalSlidesSpan = document.getElementById('totalSlides');

// Check if gallery exists
if (galleryWrapper && prevBtn && nextBtn) {
    const slides = document.querySelectorAll('.gallery-slide');
    const totalSlides = slides.length;
    let currentSlide = 0;
    let isAnimating = false;

    // Initialize
    console.log('Gallery initialized with', totalSlides, 'slides');

    // Create navigation dots
    if (galleryNav) {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('gallery-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('type', 'button');
            dot.addEventListener('click', () => goToSlide(i));
            galleryNav.appendChild(dot);
        }
    }

    const dots = document.querySelectorAll('.gallery-dot');

    function updateGallery() {
        const offset = -currentSlide * 100;
        galleryWrapper.style.transform = `translateX(${offset}%)`;
                
        dots.forEach((dot, i) => {
            if (i === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
                
        if (currentSlideSpan) {
            currentSlideSpan.textContent = currentSlide + 1;
        }
        if (totalSlidesSpan) {
            totalSlidesSpan.textContent = totalSlides;
        }
    }

    function nextSlide() {
        if (isAnimating) return;
        isAnimating = true;
        currentSlide = (currentSlide + 1) % totalSlides;
        updateGallery();
        setTimeout(() => { isAnimating = false; }, 500);
    }

    function prevSlide() {
        if (isAnimating) return;
        isAnimating = true;
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateGallery();
        setTimeout(() => { isAnimating = false; }, 500);
    }

    function goToSlide(n) {
        if (isAnimating) return;
        isAnimating = true;
        currentSlide = n;
        updateGallery();
        setTimeout(() => { isAnimating = false; }, 500);
    }

    // Button click events
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartTime = 0;

    galleryContainer.addEventListener('touchstart', (e) => {
        if (isAnimating) return;
        touchStartX = e.touches[0].clientX;
        touchStartTime = Date.now();
    }, { passive: true });

    galleryContainer.addEventListener('touchend', (e) => {
        if (isAnimating) return;
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 30;
        const diff = touchStartX - touchEndX;
        const timeDiff = Date.now() - touchStartTime;

        if (timeDiff < 500 && Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left → next
            } else {
                prevSlide(); // Swipe right → prev
            }
        }
    }

    // Initialize display
    updateGallery();
}
