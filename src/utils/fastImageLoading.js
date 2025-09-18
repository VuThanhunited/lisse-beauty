/**
 * Advanced Image Loading Optimization for Production
 * Ultra-fast image loading strategies for deployment
 */

/**
 * Image compression and format optimization
 */
export const optimizeImageUrl = (url, options = {}) => {
  if (!url) return "";

  const {
    width = null,
    height = null,
    quality = 80,
    format = "webp",
    resize = "cover",
  } = options;

  // If it's already a data URL or blob, return as is
  if (url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }

  // For external URLs, add optimization parameters if supported
  const urlObj = new URL(url);

  // Common CDN optimization parameters
  const params = new URLSearchParams();
  if (width) params.set("w", width);
  if (height) params.set("h", height);
  if (quality !== 80) params.set("q", quality);
  if (format !== "auto") params.set("f", format);
  if (resize !== "cover") params.set("fit", resize);

  // Add parameters to URL
  if (params.toString()) {
    urlObj.search = params.toString();
  }

  return urlObj.toString();
};

/**
 * Responsive image URL generator
 */
export const generateResponsiveImageUrls = (baseUrl, sizes = []) => {
  const defaultSizes = [320, 640, 960, 1280, 1920];
  const imageSizes = sizes.length ? sizes : defaultSizes;

  return imageSizes.map((size) => ({
    url: optimizeImageUrl(baseUrl, { width: size, quality: 85 }),
    width: size,
  }));
};

/**
 * Progressive image loading with blur placeholder
 */
export class ProgressiveImage {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      blurAmount: 10,
      transitionDuration: 300,
      quality: 85,
      ...options,
    };
    this.loaded = false;
  }

  async load(src, placeholder = null) {
    if (!src) return;

    // Create placeholder with blur effect
    if (placeholder) {
      const placeholderImg = new Image();
      placeholderImg.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: blur(${this.options.blurAmount}px);
        transition: all ${this.options.transitionDuration}ms ease;
      `;
      placeholderImg.src = optimizeImageUrl(placeholder, {
        width: 50,
        quality: 30,
      });
      this.container.appendChild(placeholderImg);
    }

    // Load high quality image
    const highResImg = new Image();

    return new Promise((resolve, reject) => {
      highResImg.onload = () => {
        highResImg.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity ${this.options.transitionDuration}ms ease;
          transform: translateZ(0);
          backface-visibility: hidden;
        `;

        this.container.style.position = "relative";
        this.container.appendChild(highResImg);

        // Fade in high res image
        requestAnimationFrame(() => {
          highResImg.style.opacity = "1";

          // Remove placeholder after transition
          setTimeout(() => {
            const placeholder = this.container.querySelector("img:first-child");
            if (placeholder && placeholder !== highResImg) {
              placeholder.remove();
            }
          }, this.options.transitionDuration);
        });

        this.loaded = true;
        resolve(highResImg);
      };

      highResImg.onerror = reject;
      highResImg.src = optimizeImageUrl(src, { quality: this.options.quality });
    });
  }
}

/**
 * Smart image preloader with priority queue
 */
export class SmartImagePreloader {
  constructor(options = {}) {
    this.options = {
      maxConcurrent: 4,
      timeout: 10000,
      retryAttempts: 2,
      priorityBoost: 1000,
      ...options,
    };

    this.queue = [];
    this.loading = new Set();
    this.loaded = new Set();
    this.failed = new Set();
    this.cache = new Map();
  }

  preload(url, priority = 0) {
    if (this.loaded.has(url) || this.loading.has(url)) {
      return this.cache.get(url) || Promise.resolve();
    }

    const promise = new Promise((resolve, reject) => {
      this.queue.push({
        url,
        priority,
        resolve,
        reject,
        attempts: 0,
        addedAt: Date.now(),
      });
    });

    this.cache.set(url, promise);
    this.queue.sort((a, b) => b.priority - a.priority);
    this.processQueue();

    return promise;
  }

  async processQueue() {
    while (
      this.queue.length > 0 &&
      this.loading.size < this.options.maxConcurrent
    ) {
      const item = this.queue.shift();
      if (!item) break;

      this.loading.add(item.url);

      try {
        await this.loadImage(item);
        this.loaded.add(item.url);
        this.loading.delete(item.url);
        item.resolve(item.url);
      } catch (error) {
        this.loading.delete(item.url);

        if (item.attempts < this.options.retryAttempts) {
          item.attempts++;
          item.priority += this.options.priorityBoost; // Boost priority for retry
          this.queue.unshift(item);
          this.queue.sort((a, b) => b.priority - a.priority);
        } else {
          this.failed.add(item.url);
          item.reject(error);
        }
      }
    }

    // Continue processing if there are more items
    if (this.queue.length > 0) {
      setTimeout(() => this.processQueue(), 100);
    }
  }

  loadImage(item) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timeoutId = setTimeout(() => {
        reject(new Error(`Image load timeout: ${item.url}`));
      }, this.options.timeout);

      img.onload = () => {
        clearTimeout(timeoutId);

        // Add to browser cache
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = item.url;
        document.head.appendChild(link);

        // Remove link after a short delay
        setTimeout(() => {
          if (link.parentNode) {
            link.parentNode.removeChild(link);
          }
        }, 1000);

        resolve(img);
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error(`Failed to load image: ${item.url}`));
      };

      // Optimize image URL
      img.src = optimizeImageUrl(item.url, { quality: 85 });
    });
  }

  preloadBatch(urls, basePriority = 0) {
    return Promise.allSettled(
      urls.map((url, index) =>
        this.preload(url, basePriority + (urls.length - index))
      )
    );
  }

  getStats() {
    return {
      loaded: this.loaded.size,
      loading: this.loading.size,
      failed: this.failed.size,
      queued: this.queue.length,
      cacheSize: this.cache.size,
    };
  }
}

/**
 * Critical image optimization for above-the-fold content
 */
export const optimizeCriticalImages = () => {
  // Find all images in viewport
  const images = document.querySelectorAll("img");
  const criticalImages = Array.from(images).filter((img) => {
    const rect = img.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  });

  criticalImages.forEach((img) => {
    // Add high priority attributes
    img.loading = "eager";
    img.decoding = "sync";
    if (img.fetchPriority !== undefined) {
      img.fetchPriority = "high";
    }

    // Apply performance optimizations
    img.style.transform = "translateZ(0)";
    img.style.backfaceVisibility = "hidden";

    // Preconnect to image domain
    const url = new URL(img.src);
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = url.origin;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  });
};

/**
 * Image lazy loading with intersection observer
 */
export class LazyImageLoader {
  constructor(options = {}) {
    this.options = {
      rootMargin: "50px",
      threshold: 0.1,
      ...options,
    };

    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      this.options
    );

    this.preloader = new SmartImagePreloader();
  }

  observe(img) {
    if (!img.dataset.src) return;

    // Add placeholder
    if (!img.src && img.dataset.placeholder) {
      img.src = optimizeImageUrl(img.dataset.placeholder, {
        width: 50,
        quality: 20,
      });
      img.style.filter = "blur(5px)";
    }

    this.observer.observe(img);
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }

  async loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;

    try {
      // Preload the image
      await this.preloader.preload(src, 100);

      // Create new image element
      const newImg = new Image();
      newImg.onload = () => {
        // Smooth transition
        img.style.transition = "filter 300ms ease";
        img.src = src;
        img.style.filter = "none";

        // Copy optimizations
        img.style.transform = "translateZ(0)";
        img.style.backfaceVisibility = "hidden";

        // Remove data attributes
        delete img.dataset.src;
        delete img.dataset.placeholder;
      };

      newImg.src = optimizeImageUrl(src, { quality: 85 });
    } catch (error) {
      console.warn("Failed to load lazy image:", src, error);
    }
  }

  disconnect() {
    this.observer.disconnect();
  }
}

/**
 * Initialize all image optimizations
 */
export const initializeImageOptimizations = () => {
  // Optimize critical images immediately
  optimizeCriticalImages();

  // Setup lazy loading for non-critical images
  const lazyLoader = new LazyImageLoader();

  // Find all images with data-src attribute
  document.querySelectorAll("img[data-src]").forEach((img) => {
    lazyLoader.observe(img);
  });

  // Preconnect to common image domains
  const commonDomains = ["https://api.baserow.io", "https://files.baserow.io"];

  commonDomains.forEach((domain) => {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = domain;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  });

  return {
    lazyLoader,
    preloader: new SmartImagePreloader(),
  };
};

const fastImageLoading = {
  optimizeImageUrl,
  generateResponsiveImageUrls,
  ProgressiveImage,
  SmartImagePreloader,
  optimizeCriticalImages,
  LazyImageLoader,
  initializeImageOptimizations,
};

export default fastImageLoading;
