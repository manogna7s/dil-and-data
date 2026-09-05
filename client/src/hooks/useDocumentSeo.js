import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getSettings } from "../services/settings.service.js";
import { applySeo, seoFromSettings } from "../utils/applySeo.js";

let settingsCache = null;
let settingsPromise = null;

export function loadSiteSettings() {
  if (settingsCache) return Promise.resolve(settingsCache);
  if (!settingsPromise) {
    settingsPromise = getSettings()
      .then((data) => {
        settingsCache = data;
        return data;
      })
      .catch(() => null);
  }
  return settingsPromise;
}

/**
 * Apply SEO meta tags. Merges page overrides with Studio SEO defaults.
 *
 * @param {object|null|undefined} overrides — pass null to skip (e.g. while loading)
 * @param {object} [options]
 * @param {boolean} [options.skip=false]
 */
export function useDocumentSeo(overrides, { skip = false } = {}) {
  const { pathname } = useLocation();
  const [settings, setSettings] = useState(settingsCache);

  useEffect(() => {
    let cancelled = false;
    loadSiteSettings().then((data) => {
      if (!cancelled && data) setSettings(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (skip || overrides === null || !settings) return;

    const base = seoFromSettings(settings, { path: pathname });
    const cleaned = Object.fromEntries(
      Object.entries(overrides || {}).filter(([, v]) => v !== undefined)
    );
    const merged = {
      ...base,
      ...cleaned,
      path: cleaned.canonical ? undefined : cleaned.path || pathname,
    };

    if (cleaned.title) {
      merged.title = cleaned.title;
    }
    if (cleaned.description) {
      merged.description = cleaned.description;
      if (!cleaned.ogDescription) {
        merged.ogDescription = cleaned.description;
      }
    }

    applySeo(merged);
  }, [settings, overrides, pathname, skip]);
}

export default useDocumentSeo;
