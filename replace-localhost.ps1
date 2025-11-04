# Replace localhost URLs in customer app
Get-ChildItem -Path "customer\src" -Recurse -Include *.tsx,*.ts | ForEach-Object {
    (Get-Content $_.FullName) -replace "http://localhost:3000", '${API_URL}' | Set-Content $_.FullName
    (Get-Content $_.FullName) -replace "fetch\(`\$\{API_URL\}", "import { API_URL } from '@/config/api';`n`nfetch(`${API_URL}" | Set-Content $_.FullName -Force
}

# Replace localhost URLs in partner app
Get-ChildItem -Path "partner\src" -Recurse -Include *.tsx,*.ts | ForEach-Object {
    (Get-Content $_.FullName) -replace "http://localhost:3000", '${API_URL}' | Set-Content $_.FullName
}

Write-Host "Replacement complete!"
