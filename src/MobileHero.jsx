import React from 'react';

/**
 * MobileHero Component
 * 
 * A standalone React component that implements the mobile video fallback logic.
 * This is production-ready for migration to a full React environment.
 * 
 * Usage:
 * <MobileHero videoSrc="/mobile-hero.mp4" posterSrc="/images/hero-bg.png" />
 */

const MobileHero = ({
    videoSrc = "/mobile-hero.mp4",
    posterSrc = "/images/hero-bg.png"
}) => {
    return (
        <div className="mobile-hero-container" style={styles.container}>
            <video
                className="mobile-hero-video"
                autoPlay
                muted
                loop
                playsInline
                poster={posterSrc}
                style={styles.video}
            >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Overlay Content matching current design */}
            <div className="hero-text-bottom" style={styles.overlay}>
                <div className="container" style={styles.contentContainer}>
                    <p className="hero-subtitle" style={styles.subtitle}>
                        Precision. Cleanliness. Comfort. Every visit.
                    </p>
                    <div className="hero-actions" style={styles.actions}>
                        <a href="tel:8593535541" className="btn btn-primary btn-glassy" style={styles.button}>
                            Call Now
                        </a>
                        <a href="#services" className="btn btn-secondary btn-glassy" style={styles.button}>
                            View Services
                        </a>
                    </div>
                    <div className="rating-badge" style={styles.rating}>
                        <span className="stars">★★★★★</span>
                        <span className="rating-text">4.7 | 160+ Reviews</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Inline styles for zero-dependency implementation
const styles = {
    container: {
        position: 'relative',
        width: '100%',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 0,
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        padding: '0 20px 40px 20px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
    contentContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    subtitle: {
        color: '#fff',
        marginBottom: '20px',
        fontSize: '0.9rem',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    },
    actions: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: '12px',
        marginBottom: '15px',
    },
    button: {
        width: '100%',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.9)',
        color: '#000',
        fontWeight: '600',
        padding: '14px',
        borderRadius: '4px',
        textDecoration: 'none',
    },
    rating: {
        color: '#fff',
        fontSize: '0.8rem',
        opacity: 0.9,
    }
};

export default MobileHero;
