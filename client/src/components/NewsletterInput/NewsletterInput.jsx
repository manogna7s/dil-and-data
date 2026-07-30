import { useState } from "react";
import Button from "../Button/Button";
import styles from "./NewsletterInput.module.css";

/**
 * NewsletterInput — email capture for footer / homepage.
 * UI only in Phase 2 — submit handler is a no-op placeholder.
 */
function NewsletterInput({
  onSubmit,
  placeholder = "Your email address",
  buttonLabel = "Subscribe",
  className = "",
}) {
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.(email);
  }

  return (
    <form
      className={`${styles.form} ${className}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <label htmlFor="newsletter-email" className="visually-hidden">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
        autoComplete="email"
        required
      />
      <Button type="submit" size="md" className={styles.button}>
        {buttonLabel}
      </Button>
    </form>
  );
}

export default NewsletterInput;
