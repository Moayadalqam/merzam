import { useState, useEffect } from 'react';
import './LoadingScreen.css';

export function LoadingScreen({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after 2.5 seconds (logo visible for 2.5s, then 0.5s fade out)
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    // Complete and unmount after 3 seconds total
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loading-logo-container">
        <img
          src="/logo.png"
          alt="Wood Location"
          className="loading-logo"
        />
        <div className="loading-brand">
          <span className="loading-brand-name">Wood Location</span>
          <span className="loading-brand-tagline">Interior Design & Woodwork</span>
        </div>
      </div>
    </div>
  );
}
