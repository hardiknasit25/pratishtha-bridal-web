import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App configuration
const APP_CONFIG = {
  name: "Velleta Heritage",
  shortName: "Velleta",
  primaryColor: "#ec4899", // Pink
  secondaryColor: "#f472b6", // Light Pink
  accentColor: "#8b5cf6", // Purple
  backgroundColor: "#ffffff", // White
};

// Icon sizes for PWA
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, "../public/icons");
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate main app icon SVG
function generateMainIconSVG(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${
        APP_CONFIG.primaryColor
      };stop-opacity:1" />
      <stop offset="100%" style="stop-color:${
        APP_CONFIG.accentColor
      };stop-opacity:1" />
    </linearGradient>
    <pattern id="subtlePattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <rect width="10" height="10" fill="${
        APP_CONFIG.backgroundColor
      }" opacity="0.1"/>
    </pattern>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="url(#mainGradient)"/>
  <rect width="${size}" height="${size}" fill="url(#subtlePattern)"/>
  
  <!-- Main "V" symbol -->
  <path d="M ${size * 0.25} ${size * 0.3} L ${size * 0.5} ${size * 0.75} L ${
    size * 0.75
  } ${size * 0.3}" 
        stroke="${APP_CONFIG.backgroundColor}" 
        stroke-width="${size * 0.08}" 
        stroke-linecap="round" 
        fill="none"/>
  
  <!-- Decorative dot -->
  <circle cx="${size * 0.5}" cy="${size * 0.85}" r="${size * 0.08}" fill="${
    APP_CONFIG.secondaryColor
  }"/>
</svg>`;
}

// Generate products icon SVG
function generateProductsIconSVG() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="productsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${APP_CONFIG.primaryColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${APP_CONFIG.secondaryColor};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="96" height="96" fill="url(#productsGradient)" rx="12"/>
  
  <!-- Package/Box -->
  <rect x="30" y="25" width="36" height="46" fill="${APP_CONFIG.backgroundColor}" stroke="${APP_CONFIG.primaryColor}" stroke-width="2" rx="4"/>
  
  <!-- Package lines -->
  <line x1="30" y1="47" x2="66" y2="47" stroke="${APP_CONFIG.primaryColor}" stroke-width="1"/>
  <line x1="30" y1="55" x2="66" y2="55" stroke="${APP_CONFIG.primaryColor}" stroke-width="1"/>
</svg>`;
}

// Generate orders icon SVG
function generateOrdersIconSVG() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ordersGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${APP_CONFIG.accentColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#a78bfa;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="96" height="96" fill="url(#ordersGradient)" rx="12"/>
  
  <!-- Document -->
  <rect x="25" y="20" width="46" height="56" fill="${APP_CONFIG.backgroundColor}" stroke="${APP_CONFIG.accentColor}" stroke-width="2" rx="4"/>
  
  <!-- Document lines -->
  <line x1="35" y1="35" x2="61" y2="35" stroke="${APP_CONFIG.accentColor}" stroke-width="1"/>
  <line x1="35" y1="43" x2="61" y2="43" stroke="${APP_CONFIG.accentColor}" stroke-width="1"/>
  <line x1="35" y1="51" x2="61" y2="51" stroke="${APP_CONFIG.accentColor}" stroke-width="1"/>
  <line x1="35" y1="59" x2="61" y2="59" stroke="${APP_CONFIG.accentColor}" stroke-width="1"/>
</svg>`;
}

// Convert SVG to PNG using Sharp
async function convertSVGtoPNG(svgContent, outputPath, size) {
  try {
    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toFile(outputPath);
    return true;
  } catch (error) {
    console.error(`Error converting to PNG: ${error.message}`);
    return false;
  }
}

// Generate all icons
async function generateAllIcons() {
  console.log("🎨 Generating PWA icons for Velleta Heritage...");
  console.log(`📱 Creating ${ICON_SIZES.length} icon sizes...`);

  // Generate main app icons
  for (const size of ICON_SIZES) {
    try {
      const svgContent = generateMainIconSVG(size);

      // Save SVG
      const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
      fs.writeFileSync(svgPath, svgContent);
      console.log(`✅ Generated icon-${size}x${size}.svg`);

      // Convert to PNG
      const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      const success = await convertSVGtoPNG(svgContent, pngPath, size);
      if (success) {
        console.log(`✅ Generated icon-${size}x${size}.png`);
      }
    } catch (error) {
      console.error(`❌ Error generating ${size}x${size} icon:`, error);
    }
  }

  // Generate shortcut icons
  try {
    const productsSVG = generateProductsIconSVG();
    const productsSVGPath = path.join(iconsDir, "product-icon-96x96.svg");
    fs.writeFileSync(productsSVGPath, productsSVG);
    console.log("✅ Generated product-icon-96x96.svg");

    const productsPNGPath = path.join(iconsDir, "product-icon-96x96.png");
    const productsSuccess = await convertSVGtoPNG(
      productsSVG,
      productsPNGPath,
      96
    );
    if (productsSuccess) {
      console.log("✅ Generated product-icon-96x96.png");
    }

    const ordersSVG = generateOrdersIconSVG();
    const ordersSVGPath = path.join(iconsDir, "order-icon-96x96.svg");
    fs.writeFileSync(ordersSVGPath, ordersSVG);
    console.log("✅ Generated order-icon-96x96.svg");

    const ordersPNGPath = path.join(iconsDir, "order-icon-96x96.png");
    const ordersSuccess = await convertSVGtoPNG(ordersSVG, ordersPNGPath, 96);
    if (ordersSuccess) {
      console.log("✅ Generated order-icon-96x96.png");
    }
  } catch (error) {
    console.error("❌ Error generating shortcut icons:", error);
  }

  console.log("🎉 All icons generated successfully!");
  console.log("📁 Icons saved in: public/icons/");
  console.log("📱 Both SVG and PNG formats are available");
}

// Run the icon generation
generateAllIcons().catch(console.error);
