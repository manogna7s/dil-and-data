import { Link } from "react-router-dom";
import { ROUTES, SITE } from "../../constants";
import LogoMark from "./LogoMark";
import styles from "./Logo.module.css";

/**
 * Logo — mark + wordmark lockup.
 * Why: one brand component for navbar, footer, empty states.
 * Variants: horizontal (default) | mark (symbol only)
 */
function Logo({
  variant = "horizontal",
  size = 32,
  to = ROUTES.HOME,
  className = "",
}) {
  const content = (
    <>
      <LogoMark size={size} className={styles.mark} />
      {variant === "horizontal" && (
        <span className={styles.wordmark}>{SITE.NAME}</span>
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
