import { useState, useEffect } from "react";

/**
 * Production-specific optimizations for ultra-fast image loading
 */

/**
 * Initialize production optimizations
 */
export const initProductionOptimizations = () => {
  // Enable production mode for React
  if (process.env.NODE_ENV === "production") {
    // Add service worker for caching
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered: ", registration);
          })
          .catch((registrationError) => {
            console.log("SW registration failed: ", registrationError);
          });
      });
    }

    // Optimize images with WebP detection
    const supportsWebP = (() => {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
    })();

    // Store WebP support globally
    window.SUPPORTS_WEBP = supportsWebP;

    // Preconnect to critical domains
    const criticalDomains = [
      "https://api.baserow.io",
      "https://files.baserow.io",
    ];

    criticalDomains.forEach((domain) => {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = domain;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    });

    // Add critical CSS inlining
    const criticalCSS = `
      .image-loading {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      .image-optimized {
        transition: opacity 0.3s ease;
        will-change: opacity;
      }
    `;

    const style = document.createElement("style");
    style.textContent = criticalCSS;
    document.head.appendChild(style);
  }
};

/**
 * Create optimized image URL for production
 */
export const createProductionImageUrl = (originalUrl, options = {}) => {
  if (!originalUrl) return "";

  const {
    width = null,
    height = null,
    quality = 85,
    format = "auto",
  } = options;

  // If it's a Baserow URL, optimize it
  if (originalUrl.includes("files.baserow.io")) {
    const url = new URL(originalUrl);

    // Add optimization parameters
    if (width) url.searchParams.set("w", width);
    if (height) url.searchParams.set("h", height);
    url.searchParams.set("q", quality);

    // Use WebP if supported
    if (window.SUPPORTS_WEBP && format === "auto") {
      url.searchParams.set("f", "webp");
    }

    return url.toString();
  }

  return originalUrl;
};

/**
 * Progressive image loader with blur placeholder
 */
export const createProgressiveImage = (src, placeholder) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = reject;

    // Use optimized URL
    img.src = createProductionImageUrl(src);

    // Add loading class for skeleton effect
    img.classList.add("image-loading");

    // Remove loading class when loaded
    img.addEventListener("load", () => {
      img.classList.remove("image-loading");
      img.classList.add("image-optimized");
    });
  });
};

/**
 * Batch image preloader with priority queue
 */
export class ProductionImagePreloader {
  constructor() {
    this.queue = [];
    this.loading = new Set();
    this.maxConcurrent = 6;
    this.cache = new Map();
  }

  async preload(urls, priority = 50) {
    if (typeof urls === "string") urls = [urls];

    const promises = urls.map((url) => this.preloadSingle(url, priority));
    return Promise.allSettled(promises);
  }

  async preloadSingle(url, priority = 50) {
    // Check cache first
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    return new Promise((resolve, reject) => {
      this.queue.push({ url, priority, resolve, reject });
      this.queue.sort((a, b) => b.priority - a.priority);
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.loading.size >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const { url, resolve, reject } = this.queue.shift();

    if (this.loading.has(url)) return;

    this.loading.add(url);

    try {
      const optimizedUrl = createProductionImageUrl(url);
      const img = new Image();

      img.onload = () => {
        this.cache.set(url, img);
        this.loading.delete(url);
        resolve(img);
        this.processQueue();
      };

      img.onerror = (error) => {
        this.loading.delete(url);
        reject(error);
        this.processQueue();
      };

      img.src = optimizedUrl;
    } catch (error) {
      this.loading.delete(url);
      reject(error);
      this.processQueue();
    }
  }

  getStats() {
    return {
      queueLength: this.queue.length,
      loading: this.loading.size,
      cached: this.cache.size,
    };
  }
}

// Global instance
export const productionPreloader = new ProductionImagePreloader();

/**
 * Production-optimized React hook for images
 */
export const useProductionImage = (src, options = {}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!src) return;

    setIsLoading(true);
    setError(null);

    productionPreloader
      .preloadSingle(src, options.priority || 50)
      .then((img) => {
        setImageUrl(img.src);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
        // Fallback to original URL
        setImageUrl(src);
      });
  }, [src, options.priority]);

  return { imageUrl, isLoading, error };
};

/**
 * Performance monitoring for images
 */
export const trackImagePerformance = (imageName, startTime) => {
  if (process.env.NODE_ENV === "production") {
    const loadTime = performance.now() - startTime;

    // Log slow images for optimization
    if (loadTime > 1000) {
      console.warn(
        `Slow image load: ${imageName} took ${loadTime.toFixed(2)}ms`
      );
    }

    // Use Performance API if available
    if ("PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name.includes(imageName)) {
              console.log(
                `Image ${imageName} loaded in ${entry.duration.toFixed(2)}ms`
              );
            }
          });
        });
        observer.observe({ entryTypes: ["resource"] });
      } catch (error) {
        // Silently fail if Performance Observer not supported
      }
    }
  }
};
