@echo off
echo Optimizing app icons for smaller APK size...

REM Using ImageMagick or similar tool would be ideal, but we'll use a simpler approach
REM Create properly sized icons for each density

echo.
echo Installing sharp package for image optimization...
call npm install --save-dev sharp

echo.
echo Creating optimize script...
node optimize-icons.js

echo.
echo Done! Icons optimized.
pause
