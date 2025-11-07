const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function compressLogos() {
  const acsLogoPath = path.join(__dirname, 'src', 'assets', 'ACS LOGO.png');
  const urbanSteamLogoPath = path.join(__dirname, 'src', 'assets', 'LOGO MARK GRADIENT.png');

  // Compress to 400x400 pixels, target ~50KB each
  const acsCompressed = await sharp(acsLogoPath)
    .resize(400, 400, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png({ quality: 80, compressionLevel: 9 })
    .toBuffer();

  const urbanCompressed = await sharp(urbanSteamLogoPath)
    .resize(400, 400, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png({ quality: 80, compressionLevel: 9 })
    .toBuffer();

  const acsBase64 = acsCompressed.toString('base64');
  const urbanBase64 = urbanCompressed.toString('base64');

  const outputContent = `// Compressed logos for invoice (50x50px)
export const ACS_LOGO_BASE64 = 'data:image/png;base64,${acsBase64}';
export const URBAN_STEAM_LOGO_BASE64 = 'data:image/png;base64,${urbanBase64}';
`;

  fs.writeFileSync(path.join(__dirname, 'src', 'utils', 'invoiceAssets.ts'), outputContent);

  const totalSize = (acsBase64.length + urbanBase64.length) / 1024;
  console.log('✅ Logos compressed and saved');
  console.log(`ACS Logo: ${(acsBase64.length / 1024).toFixed(2)} KB`);
  console.log(`Urban Steam Logo: ${(urbanBase64.length / 1024).toFixed(2)} KB`);
  console.log(`Total: ${totalSize.toFixed(2)} KB`);
  
  if (totalSize > 100) {
    console.warn('⚠️  Warning: Total size exceeds 100KB, may cause issues');
  }
}

compressLogos().catch(console.error);
