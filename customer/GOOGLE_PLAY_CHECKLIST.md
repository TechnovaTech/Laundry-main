# 📋 Google Play Console Submission Checklist

## Before Building AAB

- [ ] Update version code in `android/app/build.gradle`
- [ ] Update version name in `android/app/build.gradle`
- [ ] Test app on physical Android device
- [ ] Verify all API URLs point to production (not localhost)
- [ ] Check Google Auth is configured correctly
- [ ] Ensure app icons are optimized
- [ ] Test all major features work correctly

## Building AAB

- [ ] Run `create-keystore.bat` (first time only)
- [ ] Backup keystore file securely
- [ ] Run `build-aab.bat`
- [ ] Verify AAB file is created successfully
- [ ] Check AAB file size (should be < 150MB)

## Google Play Console Setup

### 1. App Information
- [ ] App name: **Laundry Mate Customer**
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500 PNG)
- [ ] Screenshots (at least 2, up to 8)
  - Phone: 16:9 or 9:16 ratio
  - Tablet: Optional but recommended

### 2. Store Listing
- [ ] App category: **Lifestyle** or **Productivity**
- [ ] Tags: laundry, cleaning, delivery, service
- [ ] Contact email
- [ ] Privacy policy URL
- [ ] Website URL (optional)

### 3. Content Rating
- [ ] Complete questionnaire
- [ ] Expected rating: **Everyone**

### 4. App Content
- [ ] Privacy policy (required)
- [ ] Ads declaration (Does your app contain ads?)
- [ ] Target audience and content
- [ ] News apps declaration (if applicable)
- [ ] COVID-19 contact tracing and status apps (if applicable)
- [ ] Data safety section
  - What data is collected
  - How data is used
  - Data sharing practices
  - Security practices

### 5. Pricing & Distribution
- [ ] Free or Paid
- [ ] Countries/regions to distribute
- [ ] Content guidelines compliance
- [ ] US export laws compliance
- [ ] Primarily child-directed (No)

### 6. App Access
- [ ] Provide test account credentials if login required
- [ ] Instructions for reviewers

## Release Information

### Production Release
- [ ] Upload `app-release.aab`
- [ ] Release name (e.g., "Version 1.0")
- [ ] Release notes (What's new)
  ```
  Initial release of Laundry Mate Customer App
  
  Features:
  - Book laundry pickup and delivery
  - Track orders in real-time
  - Manage multiple addresses
  - Wallet and points system
  - Referral program
  - Rate and review orders
  ```

### Internal Testing (Recommended First)
- [ ] Create internal testing track
- [ ] Add test users (email addresses)
- [ ] Upload AAB to internal testing
- [ ] Test thoroughly before production

### Closed Testing (Optional)
- [ ] Create closed testing track
- [ ] Add testers
- [ ] Gather feedback

### Open Testing (Optional)
- [ ] Create open testing track
- [ ] Public beta testing

## Required Assets

### App Icon
- **Size:** 512x512 pixels
- **Format:** 32-bit PNG
- **No transparency**

### Feature Graphic
- **Size:** 1024x500 pixels
- **Format:** PNG or JPEG
- **No transparency**

### Screenshots (Phone)
- **Minimum:** 2 screenshots
- **Maximum:** 8 screenshots
- **Format:** PNG or JPEG
- **Dimensions:** 
  - 16:9 ratio: 1920x1080, 1280x720
  - 9:16 ratio: 1080x1920, 720x1280

### Screenshots (Tablet) - Optional
- **7-inch:** 1024x600 or 600x1024
- **10-inch:** 1920x1200 or 1200x1920

## App Details for Listing

### Suggested App Name
**Laundry Mate - Pickup & Delivery**

### Suggested Short Description (80 chars max)
**Book laundry pickup & delivery. Track orders. Easy, fast, reliable.**

### Suggested Full Description
```
Laundry Mate makes laundry easy! Book pickup and delivery with just a few taps.

🧺 KEY FEATURES:
• Quick & Easy Booking - Schedule pickup in seconds
• Real-Time Tracking - Know exactly where your laundry is
• Multiple Addresses - Save home, office, and more
• Flexible Scheduling - Choose your convenient time
• Secure Payments - Multiple payment options
• Wallet & Points - Earn rewards on every order
• Referral Program - Invite friends and earn
• Rate & Review - Share your experience

📱 HOW IT WORKS:
1. Enter your location
2. Select laundry items
3. Choose pickup time
4. Track your order
5. Get fresh, clean laundry delivered

💰 TRANSPARENT PRICING:
• No hidden charges
• View prices before booking
• Multiple payment methods
• Wallet for easy payments

🎁 REWARDS:
• Earn points on every order
• Refer friends and earn
• Exclusive offers and discounts

🔒 SAFE & SECURE:
• Verified service partners
• Secure payment gateway
• Privacy protected

Download now and experience hassle-free laundry service!

Need help? Contact us at support@laundrymate.com
```

### Keywords/Tags
- laundry service
- laundry delivery
- dry cleaning
- pickup and delivery
- laundry app
- wash and fold
- cleaning service
- home service

## Privacy Policy Requirements

Your privacy policy must include:
- [ ] What data is collected
- [ ] How data is used
- [ ] How data is shared
- [ ] User rights (access, deletion)
- [ ] Contact information
- [ ] Data retention policy
- [ ] Security measures

## Data Safety Section

Declare what data you collect:
- [ ] Location (approximate/precise)
- [ ] Personal info (name, email, phone)
- [ ] Financial info (payment methods)
- [ ] Photos (if applicable)
- [ ] Device ID
- [ ] App activity

## Testing Before Submission

- [ ] Test on multiple Android versions
- [ ] Test on different screen sizes
- [ ] Test all user flows
- [ ] Test payment integration
- [ ] Test Google Sign-In
- [ ] Test offline behavior
- [ ] Check for crashes
- [ ] Verify all links work
- [ ] Test push notifications (if any)

## After Submission

- [ ] Wait for review (usually 1-3 days)
- [ ] Respond to any review feedback
- [ ] Monitor crash reports
- [ ] Check user reviews
- [ ] Plan for updates

## Version Updates

For each new version:
- [ ] Increment versionCode
- [ ] Update versionName
- [ ] Write release notes
- [ ] Test thoroughly
- [ ] Build new AAB
- [ ] Upload to appropriate track
- [ ] Submit for review

## Important Links

- **Google Play Console:** https://play.google.com/console
- **Android Developer Policy:** https://play.google.com/about/developer-content-policy/
- **App Quality Guidelines:** https://developer.android.com/quality
- **Asset Guidelines:** https://support.google.com/googleplay/android-developer/answer/9866151

---

## 🎯 Quick Launch Steps

1. ✅ Complete all checklist items above
2. ✅ Build AAB using `build-aab.bat`
3. ✅ Create app in Google Play Console
4. ✅ Fill in all required information
5. ✅ Upload AAB file
6. ✅ Submit for review
7. ✅ Wait for approval (1-3 days)
8. ✅ Publish to production!

---

**Good luck with your app launch! 🚀**
