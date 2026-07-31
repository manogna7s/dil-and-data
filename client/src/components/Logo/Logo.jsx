import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES, SITE } from "../../constants";
import { getSettings } from "../../services/settings.service.js";
import LogoMark from "./LogoMark";
import styles from "./Logo.module.css";

/**
 * Logo — mark + wordmark lockup (settings logo URL when configured).
 */
function Logo({
  variant = "horizontal",
  size = 32,
  to = ROUTES.HOME,
  className = "",
}) {
  const [brand, setBrand] = useState({
    name: SITE.NAME,
    logo: "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getSettings();
        if (cancelled || !data) return;
        setBrand({
          name: data.siteName || SITE.NAME,
          logo: data.logo || "",
        });
      } catch {
        /* keep defaults */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const content = (
    <>
      {brand.logo ? (
        <img
          src={brand.logo}
          alt=""
          className={styles.customMark}
          style={{ height: size, width: "auto" }}
        />
      ) : (
        <LogoMark size={size} className={styles.mark} />
      )}
      {variant === "horizontal" && (
        <span className={styles.wordmark}>{brand.name}</span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`${styles.logo} ${styles[variant]} ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <div className={`${styles.logo} ${styles[variant]} ${className}`}>
      {content}
    </div>
  );
}

export default Logo;
export { LogoMark };
