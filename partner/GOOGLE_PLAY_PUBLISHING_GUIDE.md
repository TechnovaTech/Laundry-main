# 🚀 Partner App - Google Play Store Publishing Guide

## ✅ Pre-Publishing Checklist (COMPLETED)
- [x] AAB file built and signed
- [x] Production API URL configured (`https://acsgroup.cloud`)
- [x] Google Auth properly configured
- [x] App version: 1.4 (Build 6)
- [x] App ID: `com.urbansteam.deliverypartner`
- [x] App Name: "Urban Steam Captain"

## 📱 Ready AAB Files
- **Latest**: `Urban-Steam-Captain-Partner-v1.4-GOOGLE-AUTH-FIXED.aab`
- **Alternative**: Use `build-final-aab.bat` to build fresh

## 🎯 Google Play Console Steps

### 1. Create App in Google Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Click "Create app"
3. Fill in details:
   - **App name**: Urban Steam Captain
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free

### 2. Upload AAB
1. Go to "Release" → "Production"
2. Click "Create new release"
3. Upload your AAB file
4. Add release notes

### 3. Store Listing
Fill in the following information:

#### App Details
- **App name**: Urban Steam Captain
- **Short description**: Laundry delivery partner app for pickup and delivery management
- **Full description**:
```
Urban Steam Captain is the official partner app for Urban Steam laundry service delivery partners. 

Key Features:
• Check service availability by pincode
• Manage pickup and delivery orders
• Real-time order tracking
• Hub drop-off management
• Partner profile and KYC management
• Earnings tracking

Perfect for delivery partners who want to efficiently manage their laundry pickup and delivery operations with Urban Steam.
```

#### Graphics
You'll need to create:
- **App icon**: 512 x 512 px
- **Feature graphic**: 1024 x 500 px
- **Screenshots**: At least 2 phone screenshots (16:9 or 9:16 ratio)

#### Categorization
- **App category**: Business
- **Content rating**: Everyone
- **Target audience**: 18+

### 4. Content Rating
1. Complete the content rating questionnaire
2. Select "Everyone" rating
3. Apply rating

### 5. Target Audience
- **Target age**: 18+
- **Appeals to children**: No

### 6. App Content
- **Privacy Policy**: Required (provide URL)
- **App access**: Not restricted
- **Ads**: Declare if you show ads
- **In-app purchases**: None

### 7. Release Management
1. Go to "Release" → "Production"
2. Upload your AAB
3. Add release notes:
```
Initial release of Urban Steam Captain partner app.

Features:
- Service availability check
- Order management
- Real-time tracking
- Partner profile management
- Google authentication
```

### 8. Review and Publish
1. Review all sections (must be green checkmarks)
2. Click "Send for review"
3. Wait for Google's approval (usually 1-3 days)

## 🔧 Technical Details
- **Package Name**: com.urbansteam.deliverypartner
- **Version Code**: 6
- **Version Name**: 1.4
- **Min SDK**: 22 (Android 5.1)
- **Target SDK**: 34 (Android 14)

## 📋 Required Assets Checklist
- [ ] App icon (512x512 px)
- [ ] Feature graphic (1024x500 px)
- [ ] Phone screenshots (at least 2)
- [ ] Privacy policy URL
- [ ] App description
- [ ] Release notes

## 🚨 Important Notes
1. **First Review**: Can take 7+ days for new developer accounts
2. **Privacy Policy**: Required for all apps
3. **Target API Level**: Must target API 33+ (Android 13)
4. **App Bundle**: Use AAB format (not APK)
5. **Testing**: Test thoroughly before publishing

## 🔄 Update Process (Future)
1. Increment version code in `android/app/build.gradle`
2. Build new AAB
3. Upload to Google Play Console
4. Add release notes
5. Submit for review

## 📞 Support
If you encounter issues:
1. Check Google Play Console help
2. Review app policies
3. Contact Google Play support if needed

---
**Ready to publish!** 🎉
Your AAB file is production-ready and can be uploaded to Google Play Console.