#!/bin/bash

# Script to add Privacy Manifests to Google Sign-In related frameworks
# Run this after 'pod install'

PODS_DIR="ios/App/Pods"

echo "Adding Privacy Manifests to Google Sign-In frameworks..."

# Copy Privacy Manifests to framework bundles
cp "$PODS_DIR/GTMAppAuth/PrivacyInfo.xcprivacy" "$PODS_DIR/GTMAppAuth/Frameworks/GTMAppAuth.framework/" 2>/dev/null || echo "GTMAppAuth: Already exists or path not found"
cp "$PODS_DIR/GTMSessionFetcher/PrivacyInfo.xcprivacy" "$PODS_DIR/GTMSessionFetcher/Frameworks/GTMSessionFetcher.framework/" 2>/dev/null || echo "GTMSessionFetcher: Already exists or path not found"
cp "$PODS_DIR/GoogleSignIn/PrivacyInfo.xcprivacy" "$PODS_DIR/GoogleSignIn/Frameworks/GoogleSignIn.framework/" 2>/dev/null || echo "GoogleSignIn: Already exists or path not found"

echo "✅ Privacy Manifests added successfully!"
echo "Now build and archive your app in Xcode."
