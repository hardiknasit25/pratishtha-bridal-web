# 🎯 Centralized App Configuration Guide

## 📋 Overview

Your Pratishtha Bridal application now uses a **centralized configuration system** located in `src/config/app.ts`. This means you can change your app name, colors, and other settings in **one place** and it will update everywhere!

## 🔧 How to Change Your App Name

### **Step 1: Update the Configuration**

Open `src/config/app.ts` and change the app name:

```typescript
export const APP_CONFIG = {
  // App Information
  name: "Your New App Name", // ← Change this
  shortName: "YourApp", // ← Change this
  description: "Your new description", // ← Change this

  // ... rest of the config
} as const;
```

### **Step 2: Update Static Files**

Run the update script to update all static files:

```bash
npm run update-app-name
```

This will automatically update:

- ✅ `public/manifest.json`
- ✅ `index.html`
- ✅ `public/offline.html`
- ✅ `public/sw.js`

## 🎨 Available Configuration Options

### **App Information**

```typescript
name: "Pratishtha Bridal"; // Full app name
shortName: "Pratishtha"; // Short name for PWA
description: "Bridal wear management system..."; // App description
```

### **Brand Colors**

```typescript
primaryColor: "#ec4899"; // Main brand color (Pink)
secondaryColor: "#f472b6"; // Secondary color (Light Pink)
accentColor: "#8b5cf6"; // Accent color (Purple)
backgroundColor: "#fdf2f8"; // Background color
themeColor: "#ec4899"; // PWA theme color
```

### **Contact Information**

```typescript
contact: {
  email: "info@pratishthabridal.com",
  phone: "+91-XXXXXXXXXX",
  address: "Your Business Address",
  website: "https://pratishthabridal.com"
}
```

### **Social Media**

```typescript
social: {
  facebook: "https://facebook.com/pratishthabridal",
  instagram: "https://instagram.com/pratishthabridal",
  twitter: "https://twitter.com/pratishthabridal"
}
```

### **PWA Settings**

```typescript
pwa: {
  displayMode: "standalone",        // App-like experience
  orientation: "portrait-primary",  // Screen orientation
  categories: ["business", "productivity"],
  lang: "en"
}
```

### **API Configuration**

```typescript
api: {
  baseURL: "http://localhost:3000/api",
  timeout: 10000,
  retryAttempts: 3
}
```

### **Storage Keys**

```typescript
storage: {
  authToken: "pratishtha_auth_token",
  userData: "pratishtha_user_data",
  theme: "pratishtha_theme",
  language: "pratishtha_language"
}
```

## 🚀 How to Use in Your Components

### **Import the Configuration**

```typescript
import { APP_CONFIG, getAppName, getPrimaryColor } from "../config/app";
```

### **Use Helper Functions**

```typescript
// Get app name
const appName = getAppName(); // "Pratishtha Bridal"

// Get colors
const primaryColor = getPrimaryColor(); // "#ec4899"

// Use in JSX
<h1>{getAppName()}</h1>;
```

### **Use Direct Configuration**

```typescript
// Access any config value
const themeColor = APP_CONFIG.themeColor;
const contactEmail = APP_CONFIG.contact.email;
const socialLinks = APP_CONFIG.social;
```

## 📱 What Gets Updated Automatically

When you run `npm run update-app-name`, these files are updated:

### **1. PWA Manifest** (`public/manifest.json`)

- App name and short name
- Description
- Theme colors
- Icons configuration

### **2. HTML Files**

- Page titles
- Meta descriptions
- Theme colors
- Apple mobile web app settings

### **3. Service Worker** (`public/sw.js`)

- Cache names
- Notification messages
- App name references

### **4. Offline Page** (`public/offline.html`)

- Page title
- App name references

## 🔄 Complete Workflow Example

### **Scenario: Change App Name to "Royal Bridal"**

1. **Update Configuration** (`src/config/app.ts`):

```typescript
export const APP_CONFIG = {
  name: "Royal Bridal", // Changed
  shortName: "Royal", // Changed
  description: "Royal bridal wear management system", // Changed
  // ... rest stays the same
} as const;
```

2. **Run Update Script**:

```bash
npm run update-app-name
```

3. **Result**: All files automatically updated with "Royal Bridal"!

## 🛠️ Manual Updates (If Needed)

If you need to update specific files manually:

### **React Components**

```typescript
import { getAppName } from "../config/app";

// Use in your component
<h1>Welcome to {getAppName()}</h1>;
```

### **CSS Variables**

```typescript
import { getPrimaryColor } from "../config/app";

// Use in styled components or CSS-in-JS
const primaryColor = getPrimaryColor();
```

### **API Calls**

```typescript
import { APP_CONFIG } from "../config/app";

// Use in API service
const apiUrl = `${APP_CONFIG.api.baseURL}/products`;
```

## 📋 Best Practices

### **✅ Do's**

- Always use the centralized config for app-wide settings
- Use helper functions for common values
- Run `npm run update-app-name` after changing the config
- Keep the config file organized and well-documented

### **❌ Don'ts**

- Don't hardcode app names or colors in components
- Don't forget to run the update script after config changes
- Don't modify static files directly (use the script instead)

## 🔍 Troubleshooting

### **Script Not Working?**

1. Make sure you're in the project root directory
2. Check that `scripts/update-app-name.js` exists
3. Ensure Node.js is installed and accessible

### **Changes Not Reflecting?**

1. Clear your browser cache
2. Restart your development server
3. Check that the config file was saved properly

### **PWA Not Updating?**

1. Clear browser cache and service worker
2. Uninstall and reinstall the PWA
3. Check the manifest.json file was updated

## 🎯 Quick Reference

### **Common Changes**

```bash
# Change app name
npm run update-app-name

# Start development server
npm run dev

# Build for production
npm run build
```

### **Config File Location**

```
src/config/app.ts
```

### **Update Script Location**

```
scripts/update-app-name.js
```

---

## 🎉 Benefits

- **🔄 Easy Updates**: Change app name in one place
- **🎨 Consistent Branding**: All colors and styles centralized
- **📱 PWA Ready**: Automatic manifest and service worker updates
- **🛠️ Developer Friendly**: Clear helper functions and documentation
- **🚀 Future Proof**: Easy to maintain and extend

Your app is now fully configurable from a single source of truth! 🚀
