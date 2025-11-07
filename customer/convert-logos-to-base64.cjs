const fs = require('fs');
const path = require('path');

// Convert images to base64
const acsLogoPath = path.join(__dirname, 'src', 'assets', 'ACS LOGO.png');
const urbanSteamLogoPath = path.join(__dirname, 'src', 'assets', 'LOGO MARK GRADIENT.png');

const acsLogoBase64 = fs.readFileSync(acsLogoPath).toString('base64');
const urbanSteamLogoBase64 = fs.readFileSync(urbanSteamLogoPath).toString('base64');

const outputContent = `// Base64 encoded logos for invoice generation
// These are embedded at build time to work in Capacitor

export const ACS_LOGO_BASE64 = 'data:image/png;base64,${acsLogoBase64}';

export const URBAN_STEAM_LOGO_BASE64 = 'data:image/png;base64,${urbanSteamLogoBase64}';
`;

fs.writeFileSync(path.join(__dirname, 'src', 'utils', 'invoiceAssets.ts'), outputContent);

console.log('✅ Logos converted to base64 and saved to src/utils/invoiceAssets.ts');
console.log(`ACS Logo size: ${(acsLogoBase64.length / 1024).toFixed(2)} KB`);
console.log(`Urban Steam Logo size: ${(urbanSteamLogoBase64.length / 1024).toFixed(2)} KB`);
