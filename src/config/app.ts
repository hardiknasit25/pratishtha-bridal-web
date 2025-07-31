// App Configuration Constants
// Change these values to update your app branding across the entire application

export const APP_CONFIG = {
  // App Information
  name: "Velleta Heritage",
  shortName: "Velleta",
  description: "Bridal wear management system for Velleta Heritage",

  // Brand Colors
  primaryColor: "#ec4899", // Pink
  secondaryColor: "#f472b6", // Light Pink
  accentColor: "#8b5cf6", // Purple
  backgroundColor: "#fdf2f8", // Light Pink Background

  // Theme Colors for PWA
  themeColor: "#ec4899",
  pwaBackgroundColor: "#ffffff",

  // App URLs
  startUrl: "/",
  scope: "/",

  // Contact Information
  contact: {
    email: "info@velletaheritage.com",
    phone: "+91-XXXXXXXXXX",
    address: "Your Business Address",
    website: "https://velletaheritage.com",
  },

  // Social Media
  social: {
    facebook: "https://facebook.com/velletaheritage",
    instagram: "https://instagram.com/velletaheritage",
    twitter: "https://twitter.com/velletaheritage",
  },

  // App Features
  features: {
    enableNotifications: true,
    enableOfflineMode: true,
    enablePWAInstall: true,
    enableAutoSync: true,
  },

  // PWA Settings
  pwa: {
    displayMode: "standalone",
    orientation: "portrait-primary",
    categories: ["business", "productivity"],
    lang: "en",
  },

  // API Configuration
  api: {
    baseURL: "http://localhost:3000/api",
    timeout: 10000,
    retryAttempts: 3,
  },

  // Local Storage Keys
  storage: {
    authToken: "velleta_heritage_auth_token",
    userData: "velleta_heritage_user_data",
    theme: "velleta_heritage_theme",
    language: "velleta_heritage_language",
  },

  // Cache Configuration
  cache: {
    name: "velleta-heritage-v1",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxSize: 50 * 1024 * 1024, // 50MB
  },
} as const;

// Helper functions to get specific config values
export const getAppName = () => APP_CONFIG.name;
export const getAppShortName = () => APP_CONFIG.shortName;
export const getAppDescription = () => APP_CONFIG.description;
export const getThemeColor = () => APP_CONFIG.themeColor;
export const getPrimaryColor = () => APP_CONFIG.primaryColor;
export const getSecondaryColor = () => APP_CONFIG.secondaryColor;
export const getAccentColor = () => APP_CONFIG.accentColor;
