import styles from "./SearchBar.module.css";

/**
 * SearchBar — quiet search field for blogs / archives.
 */
function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search stories…",
  className = "",
}) {
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.(value);
  }

  return (
    <form className={`${styles.form} ${className}`} onSubmit={handleSubmit} role="search">
      <label htmlFor="site-search" className="visually-hidden">
        Search
      </label>
      <span className={styles.icon} aria-hidden="true">
        ⌕
      </span>
      <input
        id="site-search"
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
      />
    </form>
  );
}

export default SearchBar;
