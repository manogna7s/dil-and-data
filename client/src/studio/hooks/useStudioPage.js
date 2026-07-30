import { useEffect } from "react";
import { useStudioChrome } from "../context/StudioChromeContext";

/**
 * Declares page title + breadcrumbs for the studio topbar.
 * Pass wide: true for editor layouts that need the full content rail.
 */
function useStudioPage({ title, breadcrumbs, wide = false }) {
  const { setTitle, setBreadcrumbs, setWide } = useStudioChrome();

  useEffect(() => {
    setTitle(title || "");
    setBreadcrumbs(
      breadcrumbs || [
        { label: "Studio", href: "/studio" },
        ...(title ? [{ label: title }] : []),
      ]
    );
    setWide(Boolean(wide));
    return () => setWide(false);
  }, [title, breadcrumbs, wide, setTitle, setBreadcrumbs, setWide]);
}

export default useStudioPage;
