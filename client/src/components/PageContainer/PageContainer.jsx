import styles from "./PageContainer.module.css";

/**
 * Constrains page content to a readable max width.
 * Every page should wrap its content in this component.
 */
function PageContainer({ children }) {
  return <div className={styles.container}>{children}</div>;
}

export default PageContainer;
