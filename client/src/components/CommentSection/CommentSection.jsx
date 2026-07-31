import { useEffect, useState } from "react";
import Button from "../Button/Button";
import Input from "../Input/Input";
import TextArea from "../TextArea/TextArea";
import {
  listPublicComments,
  createComment,
} from "../../services/comment.service.js";
import styles from "./CommentSection.module.css";

/** Public comments — create + list approved notes for a story. */
function CommentSection({ contentId }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!contentId) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const items = await listPublicComments(contentId);
        const list = Array.isArray(items) ? items : items?.items || [];
        if (!cancelled) setComments(list);
      } catch {
        if (!cancelled) setComments([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [contentId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!contentId || !name.trim() || !message.trim() || busy) return;
    setBusy(true);
    setStatus("");
    try {
      await createComment({
        content: contentId,
        authorName: name.trim(),
        authorEmail: email.trim() || "",
        body: message.trim(),
      });
      setName("");
      setEmail("");
      setMessage("");
      setStatus("Thank you. Your note awaits a quiet approval.");
    } catch (err) {
      setStatus(err.message || "Could not send your note.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={styles.section} aria-labelledby="comments-heading">
      <h2 id="comments-heading" className={styles.title}>
        Leave a note
      </h2>
      <p className={styles.note}>
        Comments are a soft conversation. Kind words welcome.
      </p>

      {comments.length > 0 && (
        <ul className={styles.list}>
          {comments.map((c) => (
            <li key={c._id} className={styles.item}>
              <p className={styles.author}>{c.authorName}</p>
              <p className={styles.body}>{c.body}</p>
            </li>
          ))}
        </ul>
      )}

      {status && (
        <p className={styles.success} role="status">
          {status}
        </p>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          label="Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Email (optional)"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextArea
          label="Note"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          required
        />
        <Button type="submit" disabled={busy || !contentId}>
          {busy ? "Sending…" : "Send note"}
        </Button>
      </form>
    </section>
  );
}

export default CommentSection;
