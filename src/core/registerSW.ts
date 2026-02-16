/**
 * Registers the service worker for offline caching.
 * Uses Vite's BASE_URL so the SW scope matches the app's base path.
 */
export function registerSW(): void {
  if (!("serviceWorker" in navigator)) {
    console.warn("[SW] Service workers not supported");
    return;
  }

  const base = import.meta.env.BASE_URL;
  const swUrl = `${base}sw.js`;

  const doRegister = () => {
    navigator.serviceWorker
      .register(swUrl, { scope: base })
      .then((reg) => {
        console.log("[SW] Registered", reg.scope);
        reg.update();
      })
      .catch((err) => {
        console.error("[SW] Registration failed:", err);
      });
  };

  if (document.readyState === "complete") {
    doRegister();
  } else {
    window.addEventListener("load", doRegister);
  }
}
