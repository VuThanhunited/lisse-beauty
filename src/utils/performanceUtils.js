/**
 * Performance optimization utilities for smooth scrolling a// Process images immediately for optimal performance
export const processImagesImmediately = (callback) => {
  // No intersection observer - just call immediately
  requestAnimationFrame(() => {
    callback();
  });
  
  return { disconnect: () => {} };
};

// Optimize image loading sequence
export const optimizeImageLoadingSequence = (imageUrls) => {
  if (typeof window === "undefined") return;
  
  // Load images in sequence for better performance
  imageUrls.forEach((url, index) => {
    if (url) {
      setTimeout(() => {
        const img = new Image();
        img.src = url;
      }, index * 50); // 50ms delay between each image
    }
  });
};
 */

// Debounce function for scroll events
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for high-frequency events
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Request animation frame wrapper for smooth animations
export const smoothAnimation = (callback) => {
  return (...args) => {
    requestAnimationFrame(() => callback(...args));
  };
};

// Optimize scroll performance
export const optimizeScrollPerformance = () => {
  // Enable smooth scrolling
  if (typeof window !== "undefined") {
    document.documentElement.style.scrollBehavior = "smooth";

    // Disable scroll restoration for better performance
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }
};

// Preload critical images immediately for faster loading
export const preloadCriticalImages = (imageUrls) => {
  if (typeof window === "undefined") return;

  const promises = imageUrls.map((url) => {
    if (url) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;

        // Also add link preload for browser optimization
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = url;
        link.fetchPriority = "high";
        document.head.appendChild(link);
      });
    }
    return Promise.resolve();
  });

  return Promise.allSettled(promises);
};

// Preload all images immediately for smooth experience
export const preloadAllImages = (imageUrls, priority = "auto") => {
  if (typeof window === "undefined") return;

  imageUrls.forEach((url) => {
    if (url) {
      const img = new Image();
      img.src = url;

      // Add link preload
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = url;
      link.fetchPriority = priority;
      document.head.appendChild(link);
    }
  });
};

// Lazy load non-critical images with better timing
export const createOptimizedIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    rootMargin: "200px",
    threshold: 0.01,
    ...options,
  };

  if (!window.IntersectionObserver) {
    // Fallback for older browsers
    setTimeout(callback, 100);
    return { disconnect: () => {} };
  }

  return new IntersectionObserver(callback, defaultOptions);
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  if (typeof window === "undefined") return fn();

  const start = performance.now();
  const result = fn();
  const end = performance.now();

  console.log(`${name} took ${end - start} milliseconds`);
  return result;
};
