@echo off
echo Replacing localhost URLs with API_URL variable...

powershell -Command "(Get-Content 'customer\src\pages\*.tsx' -Raw) -replace 'http://localhost:3000', '${API_URL}' | Set-Content 'customer\src\pages\*.tsx'"
powershell -Command "(Get-Content 'partner\src\app\**\*.tsx' -Raw) -replace 'http://localhost:3000', '${API_URL}' | Set-Content 'partner\src\app\**\*.tsx'"

echo Done!
pause
