import { createContext, useContext, useMemo, useState } from "react";

const StudioChromeContext = createContext(null);

export function StudioChromeProvider({ children }) {
  const [title, setTitle] = useState("");
  const [breadcrumbs, setBreadcrumbs] = useState([
    { label: "Studio", href: "/studio" },
  ]);
  const [wide, setWide] = useState(false);

  const value = useMemo(
    () => ({ title, setTitle, breadcrumbs, setBreadcrumbs, wide, setWide }),
    [title, breadcrumbs, wide]
  );

  return (
    <StudioChromeContext.Provider value={value}>
      {children}
    </StudioChromeContext.Provider>
  );
}

export function useStudioChrome() {
  const ctx = useContext(StudioChromeContext);
  if (!ctx) {
    throw new Error("useStudioChrome must be used within StudioChromeProvider");
  }
  return ctx;
}
