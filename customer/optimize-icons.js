import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

const inputIcon = path.join(__dirname, 'src', 'assets', 'APP ICON.png');
const baseDir = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');

async function optimizeIcons() {
  console.log('Starting icon optimization...');
  
  for (const [folder, size] of Object.entries(sizes)) {
    const outputDir = path.join(baseDir, folder);
    
    // Create ic_launcher.png
    await sharp(inputIcon)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png({ quality: 80, compressionLevel: 9 })
      .toFile(path.join(outputDir, 'ic_launcher.png'));
    
    // Create ic_launcher_round.png
    await sharp(inputIcon)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png({ quality: 80, compressionLevel: 9 })
      .toFile(path.join(outputDir, 'ic_launcher_round.png'));
    
    // Create ic_launcher_foreground.png
    await sharp(inputIcon)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png({ quality: 80, compressionLevel: 9 })
      .toFile(path.join(outputDir, 'ic_launcher_foreground.png'));
    
    console.log(`✓ Created ${folder} icons (${size}x${size})`);
  }
  
  console.log('\n✅ All icons optimized successfully!');
}

optimizeIcons().catch(console.error);
