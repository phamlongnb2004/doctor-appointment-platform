// Apricot blossom (Hoa Mai Tet) falling animation hook
import { useEffect, useRef, useCallback } from 'react';

const HOAMAI_CSS = `
  #hoamaitet-overlay {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
  }

  .hoamai {
    position: fixed;
    user-select: none;
    -webkit-user-select: none;
    pointer-events: none;
  }

  .hoamai img {
    display: block;
  }
`;

const HOAMAI_IMAGE = "https://1.bp.blogspot.com/-CXx9jt2JMRk/Vq-Lh5fm88I/AAAAAAAASwo/XivooDn_oSY/s1600/hoamai.png";

export const useFallingFlowers = (options = {}) => {
  const {
    numberOfFlowers = 15,
  } = options;

  const flowersRef = useRef([]);
  const requestRef = useRef(null);
  const isInitialized = useRef(false);
  const overlayContainerRef = useRef(null);

  // Initialize CSS styles
  const initStyles = useCallback(() => {
    if (isInitialized.current) return;

    const style = document.createElement('style');
    style.id = 'hoamai-animation-styles';
    style.textContent = HOAMAI_CSS;
    document.head.appendChild(style);
    isInitialized.current = true;
  }, []);

  // Get supported transform property
  const getSupportedPropertyName = useCallback((props) => {
    for (let i = 0; i < props.length; i++) {
      if (typeof document.body.style[props[i]] !== "undefined") {
        return props[i];
      }
    }
    return null;
  }, []);

  // Flower class constructor
  const createFlowerObject = useCallback((element, speed, xPos, yPos) => {
    return {
      element: element,
      speed: speed,
      xPos: xPos,
      yPos: yPos,
      counter: Math.random() * Math.PI * 2,
      sign: Math.random() < 0.5 ? 1 : -1,
      update: function() {
        this.counter += this.speed / 5000;
        this.xPos += this.sign * this.speed * Math.cos(this.counter) / 40;
        this.yPos += Math.sin(this.counter) / 40 + this.speed / 30;

        const transformProperty = getSupportedPropertyName([
          "transform", "msTransform", "webkitTransform", "mozTransform", "oTransform"
        ]);

        if (transformProperty) {
          this.element.style[transformProperty] = `translate3d(${Math.round(this.xPos)}px, ${Math.round(this.yPos)}px, 0)`;
        }

        // Reset when out of view
        if (this.yPos > window.innerHeight + 50) {
          this.yPos = -50;
        }
      }
    };
  }, [getSupportedPropertyName]);

  // Get random position
  const getPosition = useCallback((padding, max) => {
    return Math.round(-padding + Math.random() * (max + 2 * padding));
  }, []);

  // Create overlay container
  const createOverlay = useCallback(() => {
    // Remove existing overlay if any
    const existing = document.getElementById('hoamaitet-overlay');
    if (existing) {
      existing.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'hoamaitet-overlay';
    document.body.appendChild(overlay);
    return overlay;
  }, []);

  // Generate flowers
  const generateFlowers = useCallback(() => {
    const overlay = createOverlay();
    overlayContainerRef.current = overlay;

    const browserWidth = window.innerWidth;
    const browserHeight = window.innerHeight;

    // Create template flower
    const template = document.createElement('div');
    template.className = 'hoamai';
    template.innerHTML = `<img src="${HOAMAI_IMAGE}" alt="hoamai" />`;
    template.style.display = 'none';
    overlay.appendChild(template);

    // Create flower instances
    for (let i = 0; i < numberOfFlowers; i++) {
      const flower = template.cloneNode(true);
      flower.style.display = 'block';
      flower.style.opacity = 0.3 + Math.random() * 0.4;
      const size = 10 + Math.random() * 20;
      flower.style.fontSize = size + 'px';
      flower.querySelector('img').style.width = size + 'px';

      overlay.appendChild(flower);

      const speed = 5 + Math.random() * 30;
      const xPos = getPosition(50, browserWidth);
      const yPos = getPosition(50, browserHeight);

      const flowerObj = createFlowerObject(flower, speed, xPos, yPos);
      flowersRef.current.push(flowerObj);
    }

    // Remove template
    template.remove();
  }, [numberOfFlowers, getPosition, createFlowerObject, createOverlay]);

  // Animation loop
  const moveFlowers = useCallback(() => {
    for (let i = 0; i < flowersRef.current.length; i++) {
      const flower = flowersRef.current[i];
      flower.update();
    }
    requestRef.current = requestAnimationFrame(moveFlowers);
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }

    // Remove overlay container
    const overlay = document.getElementById('hoamaitet-overlay');
    if (overlay) {
      overlay.remove();
    }

    flowersRef.current = [];
    overlayContainerRef.current = null;
  }, []);

  useEffect(() => {
    initStyles();

    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        generateFlowers();
        requestRef.current = requestAnimationFrame(moveFlowers);
      });
    } else {
      generateFlowers();
      requestRef.current = requestAnimationFrame(moveFlowers);
    }

    return () => {
      cleanup();
    };
  }, [initStyles, generateFlowers, moveFlowers, cleanup]);

  // Return a dummy ref - the overlay is appended to body directly
  return useRef(null);
};

export default useFallingFlowers;
