import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { STUDIO } from "../../../constants";
import { getSettings, updateSettings } from "../../../services/settings.service.js";
import useStudioPage from "../../hooks/useStudioPage";
import { useToast, TableSkeleton } from "../../components/ux";
import MediaPicker from "../../components/media/MediaPicker";
import { useKeyboardShortcuts, useUnsavedWarning } from "../../hooks/useStudioUx";
import desk from "../../styles/desk.module.css";

function blankSocial() {
  return { id: crypto.randomUUID(), label: "", href: "", handle: "" };
}

function blankNav() {
  return { label: "", href: "/", enabled: true };
}

function SettingsDesk() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saveLabel, setSaveLabel] = useState("Ready");
  const [picker, setPicker] = useState(null);
  const timer = useRef(null);

  const [form, setForm] = useState({
    siteName: "",
    tagline: "",
    about: "",
    logo: "",
    favicon: "",
    footerText: "",
    footerCredit: "",
    contactEmail: "",
    contactPhone: "",
    contactLocation: "",
    contactNote: "",
    gaId: "",
    plausibleDomain: "",
    socials: [],
    navigation: [],
  });

  useStudioPage({
    title: "Settings",
    breadcrumbs: [
      { label: "Studio", href: STUDIO.DASHBOARD },
      { label: "Settings" },
    ],
  });

  useUnsavedWarning(dirty);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSettings();
      setForm({
        siteName: data.siteName || "",
        tagline: data.tagline || "",
        about: data.about || "",
        logo: data.logo || "",
        favicon: data.favicon || "",
        footerText: data.footer?.text || "",
        footerCredit: data.footer?.credit || "",
        contactEmail: data.contact?.email || "",
        contactPhone: data.contact?.phone || "",
        contactLocation: data.contact?.location || "",
        contactNote: data.contact?.note || "",
        gaId: data.analytics?.googleAnalyticsId || "",
        plausibleDomain: data.analytics?.plausibleDomain || "",
        socials: Array.isArray(data.socials) ? data.socials : [],
        navigation: Array.isArray(data.navigation) ? data.navigation : [],
      });
      setDirty(false);
      setSaveLabel("Loaded");
    } catch (err) {
      toast.error(err.message || "Could not load settings");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const buildPayload = useCallback(
    (state) => ({
      siteName: state.siteName,
      tagline: state.tagline,
      about: state.about,
      logo: state.logo,
      favicon: state.favicon,
      footer: { text: state.footerText, credit: state.footerCredit },
      contact: {
        email: state.contactEmail,
        phone: state.contactPhone,
        location: state.contactLocation,
        note: state.contactNote,
      },
      analytics: {
        googleAnalyticsId: state.gaId,
        plausibleDomain: state.plausibleDomain,
      },
      socials: state.socials,
      navigation: state.navigation,
    }),
    []
  );

  const save = useCallback(
    async (silent = false, state = form) => {
      setSaving(true);
      try {
        await updateSettings(buildPayload(state));
        setDirty(false);
        setSaveLabel(
          `Saved ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
        );
        if (!silent) toast.success("Settings saved");
      } catch (err) {
        toast.error(err.message || "Save failed");
        setSaveLabel("Save failed");
      } finally {
        setSaving(false);
      }
    },
    [form, buildPayload, toast]
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
      timer.current = setTimeout(() => save(true, next), 1600);
      return next;
    });
  }

  if (loading) return <TableSkeleton rows={5} />;

  return (
    <div className={desk.page}>
      <header className={desk.header}>
        <div>
          <p className={desk.eyebrow}>Site identity</p>
          <h1 className={desk.title}>Settings</h1>
          <p className={desk.lede}>
            Name, mark, footer, socials, contact, and analytics — classic desk, no cards.
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
        <p className={desk.sectionRule}>Brand</p>
        <label className={desk.field}>
          <span>Website name</span>
          <input value={form.siteName} onChange={(e) => patch({ siteName: e.target.value })} />
        </label>
        <label className={desk.field}>
          <span>Tagline</span>
          <input value={form.tagline} onChange={(e) => patch({ tagline: e.target.value })} />
        </label>
        <label className={desk.field}>
          <span>About blurb</span>
          <textarea rows={3} value={form.about} onChange={(e) => patch({ about: e.target.value })} />
        </label>
        <label className={desk.field}>
          <span>Logo URL</span>
          <div className={desk.toolbar}>
            <input
              value={form.logo}
              onChange={(e) => patch({ logo: e.target.value })}
              style={{ flex: 1 }}
            />
            <button type="button" className={desk.btn} onClick={() => setPicker("logo")}>
              Library
            </button>
          </div>
        </label>
        <label className={desk.field}>
          <span>Favicon URL</span>
          <div className={desk.toolbar}>
            <input
              value={form.favicon}
              onChange={(e) => patch({ favicon: e.target.value })}
              style={{ flex: 1 }}
            />
            <button type="button" className={desk.btn} onClick={() => setPicker("favicon")}>
              Library
            </button>
          </div>
        </label>

        <p className={desk.sectionRule}>Footer</p>
        <label className={desk.field}>
          <span>Footer text</span>
          <textarea
            rows={2}
            value={form.footerText}
            onChange={(e) => patch({ footerText: e.target.value })}
          />
        </label>
        <label className={desk.field}>
          <span>Footer credit</span>
          <input
            value={form.footerCredit}
            onChange={(e) => patch({ footerCredit: e.target.value })}
          />
        </label>

        <p className={desk.sectionRule}>Navigation</p>
        <p className={desk.hint}>
          Optional override links. Leave empty to use CMS pages from{" "}
          <Link to={STUDIO.PAGES}>Pages</Link> (show in nav).
        </p>
        {form.navigation.map((item, index) => (
          <div key={index} className={desk.toolbar}>
            <input
              placeholder="Label"
              value={item.label}
              onChange={(e) => {
                const navigation = [...form.navigation];
                navigation[index] = { ...item, label: e.target.value };
                patch({ navigation });
              }}
            />
            <input
              placeholder="/path"
              value={item.href}
              onChange={(e) => {
                const navigation = [...form.navigation];
                navigation[index] = { ...item, href: e.target.value };
                patch({ navigation });
              }}
            />
            <button
              type="button"
              className={desk.dangerBtn}
              onClick={() =>
                patch({ navigation: form.navigation.filter((_, i) => i !== index) })
              }
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className={desk.btn}
          onClick={() => patch({ navigation: [...form.navigation, blankNav()] })}
        >
          Add nav link
        </button>

        <p className={desk.sectionRule}>Social links</p>
        {form.socials.map((item, index) => (
          <div key={item.id || index} className={desk.toolbar}>
            <input
              placeholder="Label"
              value={item.label}
              onChange={(e) => {
                const socials = [...form.socials];
                socials[index] = { ...item, label: e.target.value };
                patch({ socials });
              }}
            />
            <input
              placeholder="https://"
              value={item.href}
              onChange={(e) => {
                const socials = [...form.socials];
                socials[index] = { ...item, href: e.target.value };
                patch({ socials });
              }}
            />
            <button
              type="button"
              className={desk.dangerBtn}
              onClick={() => patch({ socials: form.socials.filter((_, i) => i !== index) })}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className={desk.btn}
          onClick={() => patch({ socials: [...form.socials, blankSocial()] })}
        >
          Add social
        </button>

        <p className={desk.sectionRule}>Contact</p>
        <label className={desk.field}>
          <span>Email</span>
          <input
            value={form.contactEmail}
            onChange={(e) => patch({ contactEmail: e.target.value })}
          />
        </label>
        <label className={desk.field}>
          <span>Phone</span>
          <input
            value={form.contactPhone}
            onChange={(e) => patch({ contactPhone: e.target.value })}
          />
        </label>
        <label className={desk.field}>
          <span>Location</span>
          <input
            value={form.contactLocation}
            onChange={(e) => patch({ contactLocation: e.target.value })}
          />
        </label>
        <label className={desk.field}>
          <span>Note</span>
          <textarea
            rows={2}
            value={form.contactNote}
            onChange={(e) => patch({ contactNote: e.target.value })}
          />
        </label>

        <p className={desk.sectionRule}>Analytics</p>
        <label className={desk.field}>
          <span>Google Analytics ID</span>
          <input value={form.gaId} onChange={(e) => patch({ gaId: e.target.value })} placeholder="G-…" />
        </label>
        <label className={desk.field}>
          <span>Plausible domain</span>
          <input
            value={form.plausibleDomain}
            onChange={(e) => patch({ plausibleDomain: e.target.value })}
            placeholder="dilanddata.com"
          />
        </label>
      </div>

      <MediaPicker
        open={Boolean(picker)}
        title={picker === "favicon" ? "Choose favicon" : "Choose logo"}
        mode="single"
        accept="image"
        initialFolder="profile"
        onClose={() => setPicker(null)}
        onSelect={(item) => {
          const media = Array.isArray(item) ? item[0] : item;
          if (!media?.url) return;
          if (picker === "logo") patch({ logo: media.url });
          if (picker === "favicon") patch({ favicon: media.url });
          setPicker(null);
        }}
      />
    </div>
  );
}

export default SettingsDesk;
