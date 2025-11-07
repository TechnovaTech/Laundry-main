# Invoice Download Error Guide

## Common Errors & Solutions

### Error 1: "Failed to generate invoice"
**Cause**: Image loading fails on mobile
**Solution**: Updated code to skip images on mobile, use text instead

### Error 2: App crashes when clicking download
**Cause**: Permission issues or file system errors
**Solution**: 
- Using `Directory.Cache` (no permissions needed)
- Proper blob to base64 conversion
- Error handling at each step

### Error 3: "Share failed"
**Cause**: Share plugin not available
**Solution**: Check if share is available before using it

### Error 4: Nothing happens when clicking download
**Cause**: Silent error in PDF generation
**Solution**: Added alerts to show what's happening

## What the Fix Does:

1. **Skips Logo Images on Mobile** - Prevents image loading crashes
2. **Uses Cache Directory** - No storage permissions required
3. **Proper Blob Conversion** - FileReader for reliable base64 encoding
4. **Share Capability Check** - Only shares if device supports it
5. **Better Error Messages** - Shows exactly what went wrong

## Testing Steps:

1. Rebuild app:
   ```bash
   cd customer
   npm run build
   npx cap sync android
   ```

2. Open in Android Studio:
   ```bash
   npx cap open android
   ```

3. Build and install APK

4. Test invoice download:
   - Open any order
   - Click "Download Invoice"
   - Should see share dialog
   - Choose where to save

## If Still Failing:

Check Android Logcat for errors:
```bash
adb logcat | grep -i "invoice\|error\|filesystem\|share"
```

Look for:
- "Invoice error:" - Main error message
- "Share error:" - Share plugin issues
- "Failed to read PDF" - Blob conversion failed
