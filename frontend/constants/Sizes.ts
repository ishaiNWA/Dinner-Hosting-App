// Sizing Constants - Spacing, font sizes, border radius, etc.

// Base unit for consistent spacing (8px system)
const UNIT = 8;

export const Sizes = {
  // Spacing System (based on 8px grid)
  SPACING: {
    XS: UNIT * 0.5,    // 4px
    SM: UNIT,          // 8px  
    MD: UNIT * 1.5,    // 12px
    LG: UNIT * 2,      // 16px
    XL: UNIT * 3,      // 24px
    XXL: UNIT * 4,     // 32px
    XXXL: UNIT * 6,    // 48px
  },
  
  // Font Sizes
  FONT: {
    XS: 12,
    SM: 14,
    MD: 16,  // Base font size
    LG: 18,
    XL: 20,
    XXL: 24,
    XXXL: 32,
    HEADING_SM: 20,
    HEADING_MD: 24,
    HEADING_LG: 28,
    HEADING_XL: 32,
  },
  
  // Border Radius
  RADIUS: {
    SM: 4,
    MD: 8,
    LG: 12,
    XL: 16,
    ROUND: 50, // For circular elements
  },
  
  // Screen Dimensions (we'll update these dynamically)
  SCREEN: {
    WIDTH: 375,  // Will be updated with actual screen width
    HEIGHT: 812, // Will be updated with actual screen height
  },
  
  // Touch Targets (minimum sizes for accessibility)
  TOUCH: {
    MIN_SIZE: 44,     // Minimum touch target size
    BUTTON_HEIGHT: 48, // Standard button height
    INPUT_HEIGHT: 48,  // Standard input height
  },
  
  // Component Specific
  COMPONENT: {
    // Cards
    CARD_PADDING: UNIT * 2,        // 16px
    CARD_MARGIN: UNIT,             // 8px
    
    // Headers
    HEADER_HEIGHT: 56,
    
    // Tab Bar
    TAB_BAR_HEIGHT: 80,
    TAB_ICON_SIZE: 24,
    
    // Event Cards
    EVENT_CARD_IMAGE_HEIGHT: 120,
    
    // Modals
    MODAL_BORDER_RADIUS: UNIT * 2, // 16px
    MODAL_PADDING: UNIT * 3,       // 24px
    
    // Forms
    FORM_ELEMENT_SPACING: UNIT * 2, // 16px between form elements
    
    // Lists
    LIST_ITEM_HEIGHT: 60,
    LIST_SEPARATOR_HEIGHT: 1,
  },
  
  // Icon Sizes
  ICON: {
    XS: 12,
    SM: 16,
    MD: 20,
    LG: 24,
    XL: 32,
    XXL: 48,
  },
  
  // Layout Containers
  LAYOUT: {
    CONTAINER_PADDING: UNIT * 2,    // 16px
    SECTION_SPACING: UNIT * 3,      // 24px
    MAX_CONTENT_WIDTH: 600,         // Max width for larger screens
  },
  
  // Elevation/Shadow levels (for Android)
  ELEVATION: {
    NONE: 0,
    SM: 2,
    MD: 4,
    LG: 8,
    XL: 16,
  },
  
  // Animation Durations (in milliseconds)
  ANIMATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  
  // Z-Index levels (for layering)
  Z_INDEX: {
    BACKGROUND: -1,
    NORMAL: 0,
    ELEVATED: 10,
    MODAL: 100,
    TOOLTIP: 200,
    LOADING: 300,
  },
};

// Helper functions for consistent sizing
export const spacing = (multiplier: number): number => UNIT * multiplier;

export const fontScale = (size: number, scale: number = 1): number => size * scale;

// Responsive helpers (we can enhance these later)
export const isSmallScreen = (width: number): boolean => width < 375;
export const isMediumScreen = (width: number): boolean => width >= 375 && width < 768;
export const isLargeScreen = (width: number): boolean => width >= 768;

// Type exports
export type SizesType = typeof Sizes; 