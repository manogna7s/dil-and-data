import Container from "../Container/Container";
import styles from "./PageContainer.module.css";

/**
 * PageContainer — standard page body wrapper.
 * Combines max-width container with vertical page padding.
 */
function PageContainer({ children, size = "lg", className = "" }) {
  return (
    <div className={`${styles.page} ${className}`}>
      <Container size={size}>{children}</Container>
    </div>
  );
}

export default PageContainer;
