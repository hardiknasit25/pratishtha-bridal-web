import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App configuration - this should match your src/config/app.ts
const APP_CONFIG = {
  name: "Velleta Heritage",
  shortName: "Velleta",
  description: "Bridal wear management system for Velleta Heritage",
  themeColor: "#ec4899",
  pwaBackgroundColor: "#ffffff",
};

// Files to update
const filesToUpdate = [
  {
    path: "public/manifest.json",
    type: "json",
  },
  {
    path: "index.html",
    type: "html",
  },
  {
    path: "public/offline.html",
    type: "html",
  },
];

// Update manifest.json
function updateManifest() {
  const manifestPath = path.join(__dirname, "../public/manifest.json");
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

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log("✅ Updated manifest.json");
}

// Update HTML files
function updateHtmlFiles() {
  const htmlFiles = [
    { path: "index.html", title: APP_CONFIG.name },
    { path: "public/offline.html", title: `Offline - ${APP_CONFIG.name}` },
  ];

  htmlFiles.forEach((file) => {
    const filePath = path.join(__dirname, "..", file.path);
    let content = fs.readFileSync(filePath, "utf8");

    // Update title
    content = content.replace(
      /<title>.*?<\/title>/g,
      `<title>${file.title}</title>`
    );

    // Update description - be more specific
    content = content.replace(
      /content="Bridal wear management system for .*?"/g,
      `content="${APP_CONFIG.description}"`
    );

    // Update theme color - be more specific
    content = content.replace(
      /<meta name="theme-color" content="#ec4899" \/>/g,
      `<meta name="theme-color" content="${APP_CONFIG.themeColor}" />`
    );

    // Update apple-mobile-web-app-title - be more specific
    content = content.replace(
      /<meta name="apple-mobile-web-app-title" content=".*?" \/>/g,
      `<meta name="apple-mobile-web-app-title" content="${APP_CONFIG.name}" />`
    );

    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${file.path}`);
  });
}

// Update service worker
function updateServiceWorker() {
  const swPath = path.join(__dirname, "../public/sw.js");
  let content = fs.readFileSync(swPath, "utf8");

  // Update cache name
  content = content.replace(
    /const CACHE_NAME = ".*?";/g,
    `// App configuration - this should match your src/config/app.ts
const APP_CONFIG = {
  name: "${APP_CONFIG.name}",
  shortName: "${APP_CONFIG.shortName}",
  cacheName: "velleta-heritage-v1"
};

const CACHE_NAME = APP_CONFIG.cacheName;`
  );

  // Update notification text
  content = content.replace(
    /"New notification from .*?"/g,
    `"New notification from ${APP_CONFIG.name}"`
  );

  // Update notification title
  content = content.replace(
    /self\.registration\.showNotification\(".*?"/g,
    `self.registration.showNotification(APP_CONFIG.name`
  );

  fs.writeFileSync(swPath, content);
  console.log("✅ Updated service worker");
}

// Main execution
console.log("🔄 Updating app configuration...");
console.log(`📝 App Name: ${APP_CONFIG.name}`);
console.log(`🎨 Theme Color: ${APP_CONFIG.themeColor}`);

updateManifest();
updateHtmlFiles();
updateServiceWorker();

console.log("✅ All files updated successfully!");
console.log(
  "💡 To change the app name, update the APP_CONFIG in src/config/app.ts and run this script again."
);
