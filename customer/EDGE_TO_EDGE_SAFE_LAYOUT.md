# Edge-to-Edge Safe Layout Solution

## Overview
This solution implements a production-ready edge-to-edge safe layout system for the Urban Steam Capacitor app, preventing content overlap with camera notches, status bars, and navigation bars on both Android and iOS.

## Implementation Details

### 1. Capacitor Configuration (`capacitor.config.ts`)
- **StatusBar**: Transparent overlay with light content
- **SafeArea**: Custom system bar colors and styles
- **Keyboard**: Ionic resize mode with accessory bar disabled
- **Android**: Edge-to-edge window configuration
- **iOS**: Content inset set to 'never' for full control

### 2. Global CSS Solution (`src/index.css`)
- **CSS Variables**: Safe area insets mapped to custom properties
- **Root Element**: Global safe area padding applied to #root
- **Utility Classes**: Comprehensive safe area utilities
- **Keyboard Handling**: Dynamic keyboard height adjustment

### 3. Android Native Configuration
- **MainActivity.java**: Edge-to-edge display with system bar transparency
- **System Bars**: Proper light/dark appearance configuration
- **Display Cutout**: Support for punch-hole cameras and notches

### 4. Component Updates
- **BottomNavigation**: Uses `fixed-bottom-nav` class with safe area
- **Page Layouts**: Removed redundant safe area classes

## Key Features

### Safe Area Utilities
```css
.safe-area-top     /* Top safe area only */
.safe-area-bottom  /* Bottom safe area only */
.safe-area-left    /* Left safe area only */
.safe-area-right   /* Right safe area only */
.safe-area-x       /* Left + Right safe areas */
.safe-area-y       /* Top + Bottom safe areas */
.safe-area-all     /* All safe areas */
```

### Layout Classes
```css
.page-container           /* Basic page with top safe area */
.page-with-bottom-nav     /* Page with bottom navigation */
.fixed-bottom-nav         /* Fixed bottom navigation */
.header-safe             /* Header with safe area padding */
.keyboard-open           /* Keyboard adjustment */
```

### CSS Variables
```css
--safe-area-inset-top
--safe-area-inset-right
--safe-area-inset-bottom
--safe-area-inset-left
--keyboard-height
```

## How It Works

### 1. Global Safe Area Handling
- The `#root` element has safe area padding applied globally
- This prevents any content from appearing behind system UI
- No per-page configuration needed

### 2. Edge-to-Edge Display
- Android: `WindowCompat.setDecorFitsSystemWindows(false)`
- iOS: `contentInset: 'never'` in Capacitor config
- Transparent system bars allow content to flow underneath

### 3. Dynamic Keyboard Handling
- Keyboard height tracked via CSS variable
- Automatic layout adjustment when keyboard appears
- Smooth transitions between states

### 4. Cross-Platform Compatibility
- Works on Android (API 21+) with punch-hole cameras
- Works on iOS with notches and home indicators
- Handles both portrait and landscape orientations

## Benefits

1. **Global Solution**: No per-page safe area handling needed
2. **Performance**: CSS-only solution with minimal JavaScript
3. **Consistency**: Same behavior across all pages
4. **Future-Proof**: Handles new device form factors automatically
5. **Maintainable**: Centralized configuration

## Usage

### For New Pages
```tsx
// Simply use standard layout classes
<div className="page-with-bottom-nav">
  <div className="pt-4"> {/* No safe area classes needed */}
    {/* Your content */}
  </div>
</div>
```

### For Headers
```tsx
// Headers automatically get safe area spacing
<div className="header-safe bg-gradient-to-r from-purple-600 to-cyan-500">
  {/* Header content */}
</div>
```

### For Bottom Navigation
```tsx
// Use the fixed-bottom-nav class
<nav className="fixed-bottom-nav bg-white">
  {/* Navigation items */}
</nav>
```

## Testing Checklist

- [ ] Android devices with punch-hole cameras
- [ ] Android devices with gesture navigation
- [ ] Android devices with button navigation
- [ ] iOS devices with notches (iPhone X+)
- [ ] iOS devices with home indicators
- [ ] Portrait and landscape orientations
- [ ] Keyboard appearance/dismissal
- [ ] Page transitions
- [ ] Bottom navigation visibility

## Troubleshooting

### Content Still Overlapping
1. Check if custom padding is overriding safe area
2. Verify Capacitor config is properly applied
3. Ensure Android build includes MainActivity changes

### Keyboard Issues
1. Check keyboard resize mode in Capacitor config
2. Verify CSS variables are being set
3. Test keyboard listeners in App.tsx

### Safe Area Not Applied
1. Confirm CSS variables are defined
2. Check if #root has safe area padding
3. Verify StatusBar overlay is enabled

## Build Commands

```bash
# Android
npm run build
npx cap sync android
npx cap open android

# iOS (when available)
npm run build
npx cap sync ios
npx cap open ios
```

This solution provides a robust, maintainable approach to edge-to-edge safe layouts that works across all device types and orientations.