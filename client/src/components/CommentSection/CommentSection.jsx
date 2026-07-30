import { useState } from "react";
import Button from "../Button/Button";
import Input from "../Input/Input";
import TextArea from "../TextArea/TextArea";
import styles from "./CommentSection.module.css";

/** Comment UI — local state only until comments API exists. */
function CommentSection() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitted(true);
    setName("");
    setMessage("");
  }

  return (
    <section className={styles.section} aria-labelledby="comments-heading">
      <h2 id="comments-heading" className={styles.title}>
        Leave a note
      </h2>
      <p className={styles.note}>
        Comments are a soft conversation — kind words welcome. (UI only for now.)
      </p>

      {submitted && (
        <p className={styles.success} role="status">
          Thank you — your note is ready for when comments go live.
        </p>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          label="Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
        />
        <TextArea
          label="Message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="A thoughtful line or two…"
          rows={4}
          required
        />
        <Button type="submit">Send note</Button>
      </form>
    </section>
  );
}

export default CommentSection;
