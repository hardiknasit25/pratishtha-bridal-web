const fs = require("fs");
const path = require("path");

// Import the app config (we'll need to compile this)
const APP_CONFIG = {
  name: "Pratishtha Bridal",
  shortName: "Pratishtha",
  description: "Bridal wear management system for Pratishtha Bridal",
  themeColor: "#ec4899",
  pwaBackgroundColor: "#ffffff",
};

const manifest = {
  name: APP_CONFIG.name,
  short_name: APP_CONFIG.shortName,
  description: APP_CONFIG.description,
  start_url: "/",
  display: "standalone",
  background_color: APP_CONFIG.pwaBackgroundColor,
  theme_color: APP_CONFIG.themeColor,
  orientation: "portrait-primary",
  scope: "/",
  lang: "en",
  categories: ["business", "productivity"],
  icons: [
    {
      src: "/icons/icon-72x72.png",
      sizes: "72x72",
      type: "image/png",
      purpose: "maskable any",
    },
    {
      src: "/icons/icon-96x96.png",
      sizes: "96x96",
      type: "image/png",
      purpose: "maskable any",
    },
    {
      src: "/icons/icon-128x128.png",
      sizes: "128x128",
      type: "image/png",
      purpose: "maskable any",
    },
    {
      src: "/icons/icon-144x144.png",
      sizes: "144x144",
      type: "image/png",
      purpose: "maskable any",
    },
    {
      src: "/icons/icon-152x152.png",
      sizes: "152x152",
      type: "image/png",
      purpose: "maskable any",
    },
    {
      src: "/icons/icon-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable any",
    },
    {
      src: "/icons/icon-384x384.png",
      sizes: "384x384",
      type: "image/png",
      purpose: "maskable any",
    },
    {
      src: "/icons/icon-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable any",
    },
  ],
  shortcuts: [
    {
      name: "Products",
      short_name: "Products",
      description: "View and manage products",
      url: "/products",
      icons: [
        {
          src: "/icons/product-icon-96x96.png",
          sizes: "96x96",
        },
      ],
    },
    {
      name: "Orders",
      short_name: "Orders",
      description: "View and manage orders",
      url: "/orders",
      icons: [
        {
          src: "/icons/order-icon-96x96.png",
          sizes: "96x96",
        },
      ],
    },
  ],
};

// Write the manifest file
const manifestPath = path.join(__dirname, "../public/manifest.json");
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log("✅ Manifest file generated successfully!");
console.log(`📝 App Name: ${APP_CONFIG.name}`);
console.log(`🎨 Theme Color: ${APP_CONFIG.themeColor}`);
