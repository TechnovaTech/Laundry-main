🚀 Urban Steam Customer App - Release v1.4.0 (Build 10)
================================================================

📅 Release Date: ${new Date().toLocaleDateString()}

🔧 MAJOR FIXES & IMPROVEMENTS:
==============================

✅ Hardware Back Button & Swipe Gesture Fixed:
   - Cart page: Hardware back button now goes to home (no app closing)
   - Prices page: Hardware back button handles category navigation properly
   - Booking page: Hardware back button now goes to home (no app closing)
   - Swipe gestures now work correctly without closing the app

✅ Navigation Improvements:
   - "Back to all categories" button in Prices page now works correctly
   - Smart category navigation: back button goes to category list first, then home
   - All navigation buttons redirect to home instead of closing app

✅ Support Contact Enhancement:
   - Support mail now pre-fills "support@urbansteam.in" in the To field
   - Opens default mail app with correct recipient

✅ Previous Fixes (from v1.3.0):
   - Cart items properly cleared after successful order placement
   - Fixed cart items not saving when placing orders from cart
   - Improved order payload handling for cart-based orders

📱 APK DETAILS:
===============
- File: app-release.apk
- Version: 1.4.0
- Build: 10
- Size: ~15-20MB (estimated)
- Target SDK: Latest
- Min SDK: 21 (Android 5.0+)

📍 APK Location:
================
D:\OFFICE WORK\laundry-main\customer\android\app\build\outputs\apk\release\app-release.apk

🔧 TECHNICAL IMPROVEMENTS:
==========================
- Added Capacitor App plugin integration for hardware back button handling
- Implemented smart navigation logic for category-based pages
- Enhanced user experience with proper gesture handling
- Improved mobile app stability

📋 TESTING CHECKLIST:
=====================
□ Test hardware back button on Cart page
□ Test hardware back button on Prices page (category navigation)
□ Test hardware back button on Booking page
□ Test swipe gestures don't close app
□ Test "Back to all categories" button functionality
□ Test support mail with pre-filled email
□ Test cart functionality and order placement
□ Verify no unexpected app closures

🚀 DEPLOYMENT:
==============
The APK is ready for:
- Internal testing
- Google Play Store upload
- Direct distribution

🎯 USER EXPERIENCE:
==================
- No more accidental app closures when using back button
- Smooth navigation between categories and pages
- Intuitive back button behavior throughout the app
- Better mobile app experience overall

Built with ❤️ by TechnovaTech Team