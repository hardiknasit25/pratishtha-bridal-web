// PWA Utility Functions
import { getAppName } from "../config/app";

export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered successfully:", registration);
      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }
};

export const checkForAppUpdate = (registration: ServiceWorkerRegistration) => {
  registration.addEventListener("updatefound", () => {
    const newWorker = registration.installing;
    if (newWorker) {
      newWorker.addEventListener("statechange", () => {
        if (
          newWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          // New content is available, show update prompt
          showUpdatePrompt(registration);
        }
      });
    }
  });
};

export const showUpdatePrompt = (registration: ServiceWorkerRegistration) => {
  if (
    confirm(`New version of ${getAppName()} available! Click OK to update.`)
  ) {
    registration.waiting?.postMessage({ type: "SKIP_WAITING" });
    window.location.reload();
  }
};

export const requestNotificationPermission = async () => {
  if ("Notification" in window) {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  return false;
};

export const showNotification = (
  title: string,
  options?: NotificationOptions
) => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-72x72.png",
      ...options,
    });
  }
};

export const installPWA = () => {
  const deferredPrompt = (window as any).deferredPrompt;
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      (window as any).deferredPrompt = null;
    });
  }
};

export const isPWAInstalled = () => {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
};

export const isOnline = () => {
  return navigator.onLine;
};

export const addNetworkListeners = (
  onOnline: () => void,
  onOffline: () => void
) => {
  window.addEventListener("online", onOnline);
  window.addEventListener("offline", onOffline);
};

export const removeNetworkListeners = (
  onOnline: () => void,
  onOffline: () => void
) => {
  window.removeEventListener("online", onOnline);
  window.removeEventListener("offline", onOffline);
};
