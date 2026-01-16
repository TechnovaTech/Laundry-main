/**
 * Navigation Detection Utility
 * Detects Android 3-button navigation and applies appropriate spacing
 */

export class NavigationDetector {
  private static instance: NavigationDetector;
  private hasThreeButtonNav: boolean = false;
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): NavigationDetector {
    if (!NavigationDetector.instance) {
      NavigationDetector.instance = new NavigationDetector();
    }
    return NavigationDetector.instance;
  }

  /**
   * Initialize navigation detection
   */
  public init(): void {
    if (this.initialized) return;
    
    this.detectNavigationType();
    this.applyNavigationSpacing();
    this.initialized = true;
  }

  /**
   * Detect if device has 3-button navigation
   */
  private detectNavigationType(): void {
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile) {
      this.hasThreeButtonNav = false;
      return;
    }

    // Check for Android
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    if (!isAndroid) {
      this.hasThreeButtonNav = false;
      return;
    }

    // For Android devices, assume 3-button navigation exists
    // This is a conservative approach to ensure proper spacing
    this.hasThreeButtonNav = true;

    // Try to detect based on viewport height changes
    this.detectByViewportChanges();
  }

  /**
   * Detect navigation type by monitoring viewport changes
   */
  private detectByViewportChanges(): void {
    let initialHeight = window.innerHeight;
    
    // Monitor for viewport changes that might indicate navigation bar
    const checkViewport = () => {
      const currentHeight = window.innerHeight;
      const heightDiff = initialHeight - currentHeight;
      
      // If there's a significant height difference, likely has navigation bar
      if (heightDiff > 40) {
        this.hasThreeButtonNav = true;
      }
    };

    // Check after a short delay to allow for initial rendering
    setTimeout(checkViewport, 1000);
    
    // Also check on orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(checkViewport, 500);
    });
  }

  /**
   * Apply appropriate spacing based on navigation type
   */
  private applyNavigationSpacing(): void {
    const root = document.documentElement;
    
    if (this.hasThreeButtonNav) {
      // Set CSS custom property for 3-button navigation
      root.style.setProperty('--dynamic-bottom-padding', '100px');
      root.style.setProperty('--has-three-button-nav', '1');
      root.setAttribute('data-has-three-button-nav', '1');
    } else {
      // Set CSS custom property for gesture navigation or no navigation
      root.style.setProperty('--dynamic-bottom-padding', '24px');
      root.style.setProperty('--has-three-button-nav', '0');
      root.setAttribute('data-has-three-button-nav', '0');
    }
  }

  /**
   * Get current navigation type
   */
  public hasThreeButtonNavigation(): boolean {
    return this.hasThreeButtonNav;
  }

  /**
   * Manually set navigation type (for testing or specific cases)
   */
  public setNavigationType(hasThreeButton: boolean): void {
    this.hasThreeButtonNav = hasThreeButton;
    this.applyNavigationSpacing();
  }

  /**
   * Get recommended bottom padding for current navigation type
   */
  public getBottomPadding(): string {
    return this.hasThreeButtonNav ? '100px' : '24px';
  }

  /**
   * Apply navigation-safe class to an element
   */
  public makeElementNavigationSafe(element: HTMLElement): void {
    if (this.hasThreeButtonNav) {
      element.classList.add('system-nav-safe');
    }
  }

  /**
   * Remove navigation-safe class from an element
   */
  public removeNavigationSafe(element: HTMLElement): void {
    element.classList.remove('system-nav-safe');
  }
}

// Export singleton instance
export const navigationDetector = NavigationDetector.getInstance();

// Auto-initialize when module is imported
if (typeof window !== 'undefined') {
  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      navigationDetector.init();
    });
  } else {
    navigationDetector.init();
  }
}