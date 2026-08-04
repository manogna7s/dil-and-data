import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { STUDIO } from "../../../constants";
import { getSettings, updateSettings } from "../../../services/settings.service.js";
import { API_BASE_URL } from "../../../services/api.js";
import useStudioPage from "../../hooks/useStudioPage";
import { useToast } from "../../components/ux";
import { useKeyboardShortcuts, useUnsavedWarning } from "../../hooks/useStudioUx";
import { TableSkeleton } from "../../components/ux";
import desk from "../../styles/desk.module.css";

const EMPTY = {
  title: "",
  description: "",
  image: "",
  canonicalBase: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  robots: "index, follow",
  twitterCard: "summary_large_image",
};

function SeoDesk() {
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [sitemap, setSitemap] = useState({
    enabled: true,
    includePages: true,
    includeContent: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saveLabel, setSaveLabel] = useState("Ready");
  const timer = useRef(null);

  useStudioPage({
    title: "SEO",
    breadcrumbs: [
      { label: "Studio", href: STUDIO.DASHBOARD },
      { label: "SEO" },
    ],
  });

  useUnsavedWarning(dirty);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSettings();
      setForm({ ...EMPTY, ...(data.seoDefaults || {}) });
      setSitemap({
        enabled: data.sitemap?.enabled !== false,
        includePages: data.sitemap?.includePages !== false,
        includeContent: data.sitemap?.includeContent !== false,
      });
      setDirty(false);
      setSaveLabel("Loaded");
    } catch (err) {
      toast.error(err.message || "Could not load SEO settings");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    async (silent = false) => {
      setSaving(true);
      try {
        await updateSettings({
          seoDefaults: form,
          sitemap,
        });
        setDirty(false);
        setSaveLabel(
          `Saved ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
        );
        if (!silent) toast.success("SEO settings saved");
      } catch (err) {
        toast.error(err.message || "Save failed");
        setSaveLabel("Save failed");
      } finally {
        setSaving(false);
      }
    },
    [form, sitemap, toast]
  );

  const shortcuts = useMemo(
    () => ({
      "ctrl+s": () => save(false),
      "meta+s": () => save(false),
    }),
    [save]
  );
  useKeyboardShortcuts(shortcuts);

  function patch(partial) {
    setForm((prev) => {
      const next = { ...prev, ...partial };
      setDirty(true);
      setSaveLabel("Unsaved changes");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        updateSettings({ seoDefaults: next, sitemap })
          .then(() => {
            setDirty(false);
            setSaveLabel(
              `Saved ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
            );
          })
          .catch((err) => {
            toast.error(err.message || "Save failed");
            setSaveLabel("Save failed");
          });
      }, 1600);
      return next;
    });
  }

  function patchSitemap(partial) {
    setSitemap((prev) => {
      const next = { ...prev, ...partial };
      setDirty(true);
      setSaveLabel("Unsaved changes");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        updateSettings({ seoDefaults: form, sitemap: next })
          .then(() => {
            setDirty(false);
            setSaveLabel(
              `Saved ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
            );
          })
          .catch((err) => {
            toast.error(err.message || "Save failed");
            setSaveLabel("Save failed");
          });
      }, 1600);
      return next;
    });
  }

  if (loading) return <TableSkeleton rows={4} />;

  const robotsUrl = `${API_BASE_URL}/seo/robots.txt`;
  const sitemapUrl = `${API_BASE_URL}/seo/sitemap.xml`;

  return (
    <div className={desk.page}>
      <header className={desk.header}>
        <div>
          <p className={desk.eyebrow}>Discovery</p>
          <h1 className={desk.title}>SEO</h1>
          <p className={desk.lede}>
            Meta titles, Open Graph, robots, and the sitemap. Edit without touching code.
          </p>
        </div>
        <div className={desk.saveBar}>
          <span className={desk.saveStatus}>{saving ? "Saving…" : saveLabel}</span>
          <button
            type="button"
            className={desk.primaryBtn}
            disabled={saving}
            onClick={() => save(false)}
          >
            Save
          </button>
        </div>
      </header>

      <p className={desk.hint}>Autosaves as you pause · Ctrl/Cmd+S to save now</p>

      <div className={desk.formStack}>
        <p className={desk.sectionRule}>Meta defaults</p>
        <label className={desk.field}>
          <span>Meta title</span>
          <input value={form.title} onChange={(e) => patch({ title: e.target.value })} />
        </label>
        <label className={desk.field}>
          <span>Meta description</span>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => patch({ description: e.target.value })}
          />
        </label>
        <label className={desk.field}>
          <span>Canonical base URL</span>
          <input
            value={form.canonicalBase}
            onChange={(e) => patch({ canonicalBase: e.target.value })}
            placeholder="https://www.dilanddata.in"
          />
        </label>

        <p className={desk.sectionRule}>Open Graph</p>
        <label className={desk.field}>
          <span>OG title</span>
          <input value={form.ogTitle} onChange={(e) => patch({ ogTitle: e.target.value })} />
        </label>
        <label className={desk.field}>
          <span>OG description</span>
          <textarea
            rows={3}
            value={form.ogDescription}
            onChange={(e) => patch({ ogDescription: e.target.value })}
          />
        </label>
        <label className={desk.field}>
          <span>OG image URL</span>
          <input value={form.ogImage || form.image} onChange={(e) => patch({ ogImage: e.target.value, image: e.target.value })} />
        </label>
        <label className={desk.field}>
          <span>Twitter card</span>
          <select
            value={form.twitterCard}
            onChange={(e) => patch({ twitterCard: e.target.value })}
          >
            <option value="summary">summary</option>
            <option value="summary_large_image">summary_large_image</option>
          </select>
        </label>

        <p className={desk.sectionRule}>Robots</p>
        <label className={desk.field}>
          <span>Robots directive</span>
          <select value={form.robots} onChange={(e) => patch({ robots: e.target.value })}>
            <option value="index, follow">index, follow</option>
            <option value="noindex, follow">noindex, follow</option>
            <option value="index, nofollow">index, nofollow</option>
            <option value="noindex, nofollow">noindex, nofollow</option>
          </select>
        </label>
        <p className={desk.hint}>
          Live robots.txt:{" "}
          <a href={robotsUrl} target="_blank" rel="noreferrer">
            {robotsUrl}
          </a>
        </p>

        <p className={desk.sectionRule}>Sitemap</p>
        <label className={desk.field}>
          <span>
            <input
              type="checkbox"
              checked={sitemap.enabled}
              onChange={(e) => patchSitemap({ enabled: e.target.checked })}
            />{" "}
            Enable sitemap
          </span>
        </label>
        <label className={desk.field}>
          <span>
            <input
              type="checkbox"
              checked={sitemap.includePages}
              onChange={(e) => patchSitemap({ includePages: e.target.checked })}
            />{" "}
            Include CMS pages
          </span>
        </label>
        <label className={desk.field}>
          <span>
            <input
              type="checkbox"
              checked={sitemap.includeContent}
              onChange={(e) => patchSitemap({ includeContent: e.target.checked })}
            />{" "}
            Include published stories
          </span>
        </label>
        <p className={desk.hint}>
          Live sitemap:{" "}
          <a href={sitemapUrl} target="_blank" rel="noreferrer">
            {sitemapUrl}
          </a>
        </p>
      </div>
    </div>
  );
}

export default SeoDesk;
