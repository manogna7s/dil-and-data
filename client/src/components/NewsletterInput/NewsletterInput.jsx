import { useState } from "react";
import Button from "../Button/Button";
import { subscribe } from "../../services/subscriber.service.js";
import styles from "./NewsletterInput.module.css";

/**
 * NewsletterInput — email capture wired to /api/subscribers/subscribe.
 */
function NewsletterInput({
  placeholder = "Your email address",
  buttonLabel = "Subscribe",
  className = "",
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || busy) return;
    setBusy(true);
    setStatus("");
    try {
      await subscribe({ email: email.trim() });
      setEmail("");
      setStatus("You're on the list. Soft letters, rarely sent.");
    } catch (err) {
      setStatus(err.message || "Could not subscribe. Try again?");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={className}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
          disabled={busy}
        />
        <Button type="submit" size="md" className={styles.button} disabled={busy}>
          {busy ? "…" : buttonLabel}
        </Button>
      </form>
      {status && (
        <p className={styles.status} role="status">
          {status}
        </p>
      )}
    </div>
  );
}

export default NewsletterInput;
