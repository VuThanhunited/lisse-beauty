/**
 * Optimized Image Loading Utilities
 * Ultra-fast image loading for production deployment
 */

import { optimizeImageUrl, SmartImagePreloader } from "./fastImageLoading";

// Global preloader instance
const globalPreloader = new SmartImagePreloader({
  maxConcurrent: 6, // Increased for faster loading
  timeout: 8000,
  retryAttempts: 3,
});

/**
 * Enhanced Image cache manager with compression
 */
class ImageCache {
  static cache = new Map();
  static defaultExpiry = 15 * 60 * 1000; // 15 minutes

  static set(key, url, expiry = this.defaultExpiry) {
    // Optimize URL before caching
    const optimizedUrl = optimizeImageUrl(url, { quality: 85, format: "webp" });

    const item = {
      url: optimizedUrl,
      originalUrl: url,
      timestamp: Date.now(),
      expiry,
    };
    this.cache.set(key, item);

    // Store in sessionStorage with compression
    try {
      sessionStorage.setItem(`img_cache_${key}`, JSON.stringify(item));

      // Preload the optimized image
      globalPreloader.preload(optimizedUrl, 50);
    } catch (e) {
      console.warn("Failed to cache image in sessionStorage:", e);
    }
  }

  static get(key) {
    // Check memory cache first
    let item = this.cache.get(key);

    // If not in memory, try sessionStorage
    if (!item) {
      try {
        const stored = sessionStorage.getItem(`img_cache_${key}`);
        if (stored) {
          item = JSON.parse(stored);
          this.cache.set(key, item);
        }
      } catch (e) {
        console.warn("Failed to retrieve cached image:", e);
      }
    }

    if (!item) return null;

    // Check if expired
    const now = Date.now();
    if (now - item.timestamp > item.expiry) {
      this.cache.delete(key);
      try {
        sessionStorage.removeItem(`img_cache_${key}`);
      } catch (e) {
        // Ignore storage errors
      }
      return null;
    }

    return item.url;
  }

  static clear() {
    this.cache.clear();
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach((key) => {
        if (key.startsWith("img_cache_")) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn("Failed to clear image cache:", e);
    }
  }
}

/**
 * Preload image with promise support
 */
export const preloadImage = (url, priority = "high") => {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error("No URL provided"));
      return;
    }

    const img = new Image();

    img.onload = () => {
      resolve(url);
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${url}`));
    };

    // Set attributes for optimization
    if (img.loading !== undefined) {
      img.loading = "eager";
    }
    if (img.decoding !== undefined) {
      img.decoding = "async";
    }
    if (img.fetchPriority !== undefined) {
      img.fetchPriority = priority;
    }

    img.src = url;

    // Also add link preload for even faster loading
    if (typeof document !== "undefined") {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = url;
      link.fetchPriority = priority;

      // Remove link after loading to prevent memory leaks
      const cleanup = () => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      };

      link.onload = cleanup;
      link.onerror = cleanup;

      document.head.appendChild(link);
    }
  });
};

/**
 * Ultra-fast fetch with caching and compression for backend images
 */
export const fetchImageWithCache = async (url, cacheKey, options = {}) => {
  const {
    timeout = 4000, // Reduced timeout for faster fail-over
    priority = "high",
    expiry = 15 * 60 * 1000, // 15 minutes
    retries = 3, // Increased retries
    fetchOptions = {},
    width = null,
    height = null,
    quality = 85,
  } = options;

  // Check cache first with optimized URL
  const cachedItem = ImageCache.get(cacheKey);
  if (cachedItem) {
    try {
      // Use global preloader for faster loading
      await globalPreloader.preload(cachedItem, priority === "high" ? 100 : 50);
      return cachedItem;
    } catch (error) {
      console.warn("Cached image failed to load, fetching fresh:", error);
      ImageCache.cache.delete(cacheKey);
    }
  }

  // Import axios dynamically to avoid circular dependencies
  const axios = (await import("axios")).default;

  // Add preconnect for faster subsequent requests
  if (typeof document !== "undefined") {
    const urlObj = new URL(url);
    const preconnectLink = document.createElement("link");
    preconnectLink.rel = "preconnect";
    preconnectLink.href = urlObj.origin;
    preconnectLink.crossOrigin = "anonymous";
    document.head.appendChild(preconnectLink);
  }

  // Fetch with retries and exponential backoff
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await axios.get(url, {
        timeout: timeout + i * 1000, // Increase timeout on retries
        ...fetchOptions,
      });

      if (!response.data || !response.data.results) {
        throw new Error("Invalid response structure");
      }

      const rawImageUrl =
        response.data.results[0]?.logo?.[0]?.url ||
        response.data.results[0]?.image?.[0]?.url ||
        response.data.results[0]?.serviceImage?.[0]?.url ||
        "";

      if (rawImageUrl) {
        // Optimize image URL for faster loading
        const optimizedImageUrl = optimizeImageUrl(rawImageUrl, {
          width,
          height,
          quality,
          format: "webp",
        });

        // Cache both original and optimized URLs
        ImageCache.set(cacheKey, optimizedImageUrl, expiry);

        // Preload with high priority using global preloader
        await globalPreloader.preload(
          optimizedImageUrl,
          priority === "high" ? 100 : 50
        );

        return optimizedImageUrl;
      } else {
        throw new Error("No image URL found in response");
      }
    } catch (error) {
      lastError = error;

      if (i < retries) {
        // Exponential backoff delay with jitter
        const baseDelay = Math.pow(2, i) * 500;
        const jitter = Math.random() * 500;
        const delay = Math.min(baseDelay + jitter, 4000);

        await new Promise((resolve) => setTimeout(resolve, delay));
        console.warn(
          `Retry ${i + 1}/${retries} for image fetch in ${delay}ms:`,
          error.message
        );
      }
    }
  }

  // All retries failed, try to use cached version as last resort
  const fallbackUrl = ImageCache.get(cacheKey);
  if (fallbackUrl) {
    console.warn("Using stale cached image as fallback");
    return fallbackUrl;
  }

  throw lastError || new Error("Failed to fetch image after all retries");
};

/**
 * Batch preload multiple images
 */
export const batchPreloadImages = async (urls, concurrency = 3) => {
  if (!Array.isArray(urls) || urls.length === 0) return [];

  const results = [];

  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const batchPromises = batch.map((url) =>
      preloadImage(url, "low").catch((error) => ({ error, url }))
    );

    const batchResults = await Promise.allSettled(batchPromises);
    results.push(...batchResults);
  }

  return results;
};

/**
 * Optimized image component attributes
 */
export const getOptimizedImageAttributes = (priority = "auto") => ({
  loading: priority === "high" ? "eager" : "lazy",
  decoding: "async",
  fetchPriority: priority,
  style: {
    transform: "translateZ(0)",
    backfaceVisibility: "hidden",
    imageRendering: "high-quality",
  },
});

/**
 * Clear all image caches (useful for cleanup)
 */
export const clearImageCache = () => {
  ImageCache.clear();
};

const imageOptimization = {
  preloadImage,
  fetchImageWithCache,
  batchPreloadImages,
  getOptimizedImageAttributes,
  clearImageCache,
};

export default imageOptimization;
