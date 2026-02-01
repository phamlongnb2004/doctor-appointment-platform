// Custom hook for falling flower animation
import { useEffect, useRef } from 'react';

const flowerEmojis = ['🌸', '🌺', '🌻', '🌹', '🌷', '💐', '🍀', '🌱', '🌿', '🍃'];

export const useFallingFlowers = (intensity = 20) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createFlower = () => {
      const flower = document.createElement('div');
      flower.innerHTML = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
      flower.style.cssText = `
        position: absolute;
        top: -50px;
        left: ${Math.random() * 100}%;
        font-size: ${Math.random() * 20 + 15}px;
        animation: fall ${Math.random() * 5 + 8}s linear infinite;
        opacity: ${Math.random() * 0.6 + 0.4};
        pointer-events: none;
        z-index: 1000;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
      `;
      
      // Random horizontal movement
      const duration = Math.random() * 5 + 8;
      flower.style.animation = `
        fall ${duration}s linear infinite,
        sway ${Math.random() * 2 + 1}s ease-in-out infinite alternate
      `;
      
      // Add keyframes dynamically
      const style = document.createElement('style');
      style.textContent = `
        @keyframes fall {
          0% { transform: translateY(-50px) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
        @keyframes sway {
          0% { margin-left: 0; }
          100% { margin-left: ${Math.random() * 100 - 50}px; }
        }
      `;
      document.head.appendChild(style);
      
      container.appendChild(flower);
      
      // Remove flower after animation
      setTimeout(() => {
        flower.remove();
        style.remove();
      }, duration * 1000);
    };

    // Create initial batch
    for (let i = 0; i < intensity / 2; i++) {
      setTimeout(createFlower, Math.random() * 3000);
    }

    // Continuous creation
    const interval = setInterval(createFlower, 3000 / intensity * 1000);

    return () => clearInterval(interval);
  }, [intensity]);

  return containerRef;
};

export default useFallingFlowers;
