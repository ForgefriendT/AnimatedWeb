// Import removed if not found, or fixed.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { BookingSystem } from "./booking.js"; // Commenting out until verified


gsap.registerPlugin(ScrollTrigger);

console.log("Kaylee Nail Spa: Cinematic Intro 3-Phase System");

// ------------------------------------------------------------------
// HERO SCROLL SEQUENCE LOGIC - 3 PHASES
// ------------------------------------------------------------------

// Configuration
const frameCount = 80;
const images = [];
const imageSequence = { frame: 0 };
const canvas = document.getElementById("hero-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

// Helper: Fix Canvas Resolution
const resizeCanvas = () => {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderFrame();
};

window.addEventListener("resize", resizeCanvas);
if (canvas) resizeCanvas();

// Helper: Render Logic (Cover Fit with Bottom Crop)
function renderFrame() {
    if (!canvas || !ctx) return;

    let img = images[imageSequence.frame];

    // If current frame not loaded yet, find closest loaded frame
    if (!img || !img.complete) {
        // Look backward first
        for (let i = imageSequence.frame - 1; i >= 0; i--) {
            if (images[i] && images[i].complete) {
                img = images[i];
                break;
            }
        }
        // If still not found, look forward
        if (!img || !img.complete) {
            for (let i = imageSequence.frame + 1; i < frameCount; i++) {
                if (images[i] && images[i].complete) {
                    img = images[i];
                    break;
                }
            }
        }
    }

    if (!img || !img.complete) return;

    // Crop percentage from bottom (to hide VEO logo)
    const cropBottomPercent = 0.15;
    const croppedHeight = img.height * (1 - cropBottomPercent);

    // Calculate "Cover" dimensions
    const scale = Math.max(canvas.width / img.width, canvas.height / croppedHeight);
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (croppedHeight / 2) * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw cropped image
    ctx.drawImage(
        img,
        0, 0, img.width, croppedHeight,
        x, y, img.width * scale, croppedHeight * scale
    );
};

// Preload Images (Mobile Optimized: Loads only last frame)
let imagesLoaded = 0;
let isFirstFrameReady = false;

const preloadImages = () => {
    const basePath = "/images/intro-sequence/Create_a_smooth_202601291641_8mr1q_";
    const padIndex = (index) => index.toString().padStart(3, '0');
    const isMobile = window.innerWidth <= 768;

    // Mobile: Load ONLY the last frame
    if (isMobile) {
        const lastFrameIndex = frameCount - 1;
        const img = new Image();
        img.src = `${basePath}${padIndex(lastFrameIndex)}.jpg`;
        img.onload = () => {
            images[lastFrameIndex] = img;
            imageSequence.frame = lastFrameIndex; // Set to last frame
            isFirstFrameReady = true;
            renderFrame();
            setupScrollAnimation(); // Will handle static setup for mobile
        };
        return;
    }

    // DESKTOP: Full Sequence Loading
    // Priority loading: Load first frame, last frame, and every 10th frame first
    const priorityFrames = [0, frameCount - 1, ...Array.from({ length: Math.ceil(frameCount / 10) }, (_, i) => i * 10)];
    const regularFrames = Array.from({ length: frameCount }, (_, i) => i).filter(i => !priorityFrames.includes(i));

    // Load priority frames first
    const loadFrame = (index, onComplete) => {
        const img = new Image();
        img.src = `${basePath}${padIndex(index)}.jpg`;

        img.onload = () => {
            imagesLoaded++;

            // Show first frame immediately when ready
            if (index === 0 && !isFirstFrameReady) {
                isFirstFrameReady = true;
                renderFrame();
                setupScrollAnimation();

            }

            if (onComplete) onComplete();
        };

        img.onerror = (e) => {
            console.error(`Failed to load frame ${index}:`, e);
            if (onComplete) onComplete();
        };

        images[index] = img;
    };

    // Initialize images array
    for (let i = 0; i < frameCount; i++) {
        images[i] = null;
    }

    // Load priority frames first
    let priorityIndex = 0;
    const loadNextPriority = () => {
        if (priorityIndex < priorityFrames.length) {
            loadFrame(priorityFrames[priorityIndex], loadNextPriority);
            priorityIndex++;
        } else {
            // Start loading regular frames in background
            loadRegularFrames();
        }
    };

    // Load regular frames in background
    const loadRegularFrames = () => {
        regularFrames.forEach((index, i) => {
            // Stagger loading to prevent overwhelming the browser
            setTimeout(() => loadFrame(index), i * 50);
        });
    };

    // Start loading
    loadNextPriority();
};

// 3-Phase Scroll Animation Logic
const setupScrollAnimation = () => {
    if (!canvas) return;

    const textTop = document.getElementById('hero-text-top');
    const textBottom = document.getElementById('hero-text-bottom');
    const textFinal = document.getElementById('hero-text-final');
    const canvasOverlay = document.getElementById('canvas-overlay');
    const header = document.querySelector('.site-header');
    const centerLogo = document.getElementById('hero-logo-center');

    const isMobile = window.innerWidth <= 768;

    // MOBILE: Static Final State (No Scroll Animation)
    if (isMobile) {
        // Show Final Text
        if (textFinal) {
            textFinal.style.opacity = 1;
            textFinal.classList.add('visible');
        }

        // Show Header
        if (header) {
            header.classList.add('visible');
            header.style.opacity = 1;
            header.style.transform = 'translateY(0)';
        }

        // Dark Overlay for readability
        if (canvasOverlay) {
            canvasOverlay.style.background = 'rgba(0, 0, 0, 0.5)';
        }

        // Hide Phase 1 Elements
        if (textTop) textTop.style.display = 'none';
        if (textBottom) textBottom.style.display = 'none';
        if (centerLogo) centerLogo.style.display = 'none';

        // Render the last frame (already loaded in preloadImages if mobile)
        imageSequence.frame = frameCount - 1;
        renderFrame();

        return; // EXIT - Do not attach ScrollTrigger
    }

    // DESKTOP: ScrollTrigger Animation
    // Main Timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero-sequence",
            start: "top top",
            end: "+=6000", // Extended significantly - stays much longer
            pin: true,
            scrub: 0.5,
            onUpdate: (self) => {
                const progress = self.progress;

                // Phase 1 → 2: Fade out split text AND center logo (0% - 15%)
                if (progress < 0.1) {
                    const fadeProgress = progress / 0.1;
                    const currentOpacity = Math.max(0, 1 - fadeProgress);

                    if (textTop) {
                        textTop.style.opacity = currentOpacity;
                    }
                    if (textBottom) {
                        textBottom.style.opacity = currentOpacity;
                    }
                    if (textTop) textTop.style.animation = 'none';
                    if (textBottom) textBottom.style.animation = 'none';
                    if (centerLogo) {
                        centerLogo.style.opacity = currentOpacity;
                        centerLogo.style.animation = 'none';
                    }
                } else {
                    if (textTop) textTop.style.opacity = 0;
                    if (textBottom) textBottom.style.opacity = 0;
                    if (centerLogo) centerLogo.style.opacity = 0;
                }

                // Phase 2 → 3: Dark overlay, centered text, navbar (70% - 100%)
                // Animation plays 0-70%, then hero stays in final state 30%
                if (progress > 0.70) {
                    const phase3Progress = (progress - 0.70) / 0.30;

                    // Dark tint on canvas
                    canvasOverlay.style.background = `rgba(0, 0, 0, ${0.5 * phase3Progress})`;

                    // Fade in centered text
                    if (phase3Progress > 0.1) {
                        const textProgress = (phase3Progress - 0.1) / 0.9;
                        textFinal.style.opacity = textProgress;
                        if (textProgress > 0.3) {
                            textFinal.classList.add('visible');
                        }
                    }

                    // Show navbar
                    if (phase3Progress > 0.2) {
                        header.classList.add('visible');
                    }
                } else {
                    canvasOverlay.style.background = 'rgba(0, 0, 0, 0)';
                    textFinal.style.opacity = 0;
                    textFinal.classList.remove('visible');
                    header.classList.remove('visible');
                }
            }
        }
    });

    // Animate frames
    tl.to(imageSequence, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        onUpdate: renderFrame
    });
};

// Start Sequence
preloadImages();


// ------------------------------------------------------------------
// STANDARD ANIMATIONS
// ------------------------------------------------------------------

// Mobile Navigation
const mobileBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.main-nav');

if (mobileBtn && nav) {
    mobileBtn.addEventListener('click', () => {
        const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
        mobileBtn.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('active');
    });
}

// Fade In Up Animation (Elements with class .fade-in-up)
const fadeElements = document.querySelectorAll('.fade-in-up');
fadeElements.forEach(el => {
    gsap.from(el, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: el.classList.contains('delay-1') ? 0.2 :
            el.classList.contains('delay-2') ? 0.4 :
                el.classList.contains('delay-3') ? 0.6 :
                    el.classList.contains('delay-4') ? 0.8 : 0
    });
});

// Scroll Reveal for Sections (Fade only)
const revealElements = document.querySelectorAll(".gs-reveal");
revealElements.forEach((elem) => {
    gsap.from(elem, {
        scrollTrigger: {
            trigger: elem,
            start: "top 80%",
        },
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
    });
});

// Staggered Reveal for Cards (Fade only)
const staggerContainers = document.querySelectorAll(".gs-reveal-stagger");
staggerContainers.forEach((container) => {
    const children = container.children;
    gsap.from(children, {
        scrollTrigger: {
            trigger: container,
            start: "top 80%",
        },
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out",
    });
});

// Premium scroll animations for rest of site
const initSiteAnimations = () => {
    const animateElements = document.querySelectorAll('.animate-fade-up, .scale-reveal, .glow-reveal, .slide-left, .slide-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => observer.observe(el));
};

// Initialize after DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSiteAnimations);
} else {
    initSiteAnimations();
}

// Premium site-wide animations
const setupSiteAnimations = () => {
    // Service cards with elegant stagger
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length > 0) {
        gsap.from(serviceCards, {
            scrollTrigger: {
                trigger: '.services-grid',
                start: 'top 75%',
            },
            y: 80,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
        });
    }

    // Experience items
    const experienceItems = document.querySelectorAll('.experience-item');
    if (experienceItems.length > 0) {
        gsap.from(experienceItems, {
            scrollTrigger: {
                trigger: '.experience-grid',
                start: 'top 75%',
            },
            y: 80,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
        });
    }

    // Gallery items with scale
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        gsap.from(galleryItems, {
            scrollTrigger: {
                trigger: '.gallery-grid',
                start: 'top 75%',
            },
            scale: 0.85,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'back.out(1.4)',
        });
    }

    // Section titles with elegant reveal
    const sectionTitles = document.querySelectorAll('section h2');
    sectionTitles.forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
            },
            y: 40,
            opacity: 0,
            duration: 1.2,
            ease: 'power2.out',
        });
    });

    // Trust strip stats
    const trustStats = document.querySelectorAll('.trust-stat');
    if (trustStats.length > 0) {
        gsap.from(trustStats, {
            scrollTrigger: {
                trigger: '.trust-strip',
                start: 'top 80%',
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
        });
    }

    // Form groups
    const formGroups = document.querySelectorAll('.form-group');
    if (formGroups.length > 0) {
        gsap.from(formGroups, {
            scrollTrigger: {
                trigger: 'form',
                start: 'top 75%',
            },
            x: -40,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
        });
    }

    // Pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    if (pricingCards.length > 0) {
        gsap.from(pricingCards, {
            scrollTrigger: {
                trigger: '.pricing-section',
                start: 'top 75%',
            },
            y: 60,
            opacity: 0,
            duration: 0.9,
            stagger: 0.2,
            ease: 'power3.out',
        });
    }

    // Testimonial cards
    const testimonials = document.querySelectorAll('.testimonial-card');
    if (testimonials.length > 0) {
        gsap.from(testimonials, {
            scrollTrigger: {
                trigger: '.testimonials',
                start: 'top 75%',
            },
            y: 60,
            opacity: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: 'power3.out',
        });
    }
};

