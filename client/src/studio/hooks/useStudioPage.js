import { useEffect, useRef } from "react";
import { useStudioChrome } from "../context/StudioChromeContext";

/**
 * Declares page title + breadcrumbs for the studio topbar.
 * Pass wide: true for editor layouts that need the full content rail.
 *
 * Breadcrumbs are compared by value (JSON) so inline arrays in callers
 * do not cause an infinite setState ↔ re-render loop that freezes clicks.
 */
function useStudioPage({ title, breadcrumbs, wide = false }) {
  const { setTitle, setBreadcrumbs, setWide } = useStudioChrome();
  const crumbsKey = JSON.stringify(breadcrumbs ?? null);
  const latestCrumbs = useRef(breadcrumbs);
  latestCrumbs.current = breadcrumbs;

  useEffect(() => {
    setTitle(title || "");
    setBreadcrumbs(
      latestCrumbs.current || [
        { label: "Studio", href: "/studio" },
        ...(title ? [{ label: title }] : []),
      ]
    );
    setWide(Boolean(wide));
    return () => setWide(false);
  }, [title, crumbsKey, wide, setTitle, setBreadcrumbs, setWide]);
}

export default useStudioPage;
