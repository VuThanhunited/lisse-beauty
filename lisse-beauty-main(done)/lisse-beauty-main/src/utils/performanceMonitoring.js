/**
 * Simple performance monitoring for scroll improvements
 */

export const measureScrollPerformance = () => {
  let scrollStart = performance.now();
  let frameCount = 0;
  let lastFrameTime = performance.now();

  const measureFPS = () => {
    frameCount++;
    const currentTime = performance.now();
    const deltaTime = currentTime - lastFrameTime;

    if (deltaTime >= 1000) {
      // Every second
      const fps = Math.round((frameCount * 1000) / deltaTime);
      console.log(`Scroll FPS: ${fps}`);
      frameCount = 0;
      lastFrameTime = currentTime;
    }

    requestAnimationFrame(measureFPS);
  };

  const handleScroll = () => {
    if (!scrollStart) {
      scrollStart = performance.now();
    }
    requestAnimationFrame(measureFPS);
  };

  // Monitor scroll performance
  window.addEventListener("scroll", handleScroll, { passive: true });

  // Cleanup function
  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
};

// Simple scroll smoothness test
export const testScrollSmoothness = () => {
  console.log("Testing scroll smoothness...");

  const startY = window.pageYOffset;
  const targetY = startY + 1000; // Scroll down 1000px
  const duration = 2000; // 2 seconds
  const startTime = performance.now();

  const animateScroll = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Smooth easing function
    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    const easedProgress = easeInOutCubic(progress);

    const currentY = startY + (targetY - startY) * easedProgress;
    window.scrollTo(0, currentY);

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    } else {
      console.log("Scroll test completed!");
      // Scroll back to original position
      setTimeout(() => {
        window.scrollTo({ top: startY, behavior: "smooth" });
      }, 1000);
    }
  };

  requestAnimationFrame(animateScroll);
};

const performanceMonitoring = {
  measureScrollPerformance,
  testScrollSmoothness,
};

export default performanceMonitoring;
