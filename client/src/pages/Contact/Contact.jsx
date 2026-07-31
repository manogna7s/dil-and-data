import { useEffect, useState } from "react";
import {
  PageHeader,
  Section,
  Container,
  SocialIcon,
  Input,
  TextArea,
  Button,
} from "../../components";
import { SITE } from "../../constants";
import { getSettings } from "../../services/settings.service.js";
import styles from "./Contact.module.css";

function Contact() {
  const [site, setSite] = useState({
    author: SITE.AUTHOR,
    email: "",
    note: "",
    socials: [],
  });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getSettings();
        if (cancelled || !data) return;
        setSite({
          author: SITE.AUTHOR,
          email: data.contact?.email || "",
          note: data.contact?.note || "",
          socials: Array.isArray(data.socials) ? data.socials : [],
        });
        document.title = `Contact · ${data.siteName || SITE.NAME}`;
      } catch {
        /* keep defaults */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("Please fill in every field.");
      return;
    }

    const to = site.email;
    if (!to) {
      setStatus(
        "No contact email is configured yet. Add one in Studio → Settings."
      );
      return;
    }

    const subject = encodeURIComponent(`Letter from ${form.name.trim()}`);
    const body = encodeURIComponent(
      `${form.message.trim()}\n\n${form.name.trim()}\n${form.email.trim()}`
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    setStatus("Opening your email app…");
  }

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Contact"
        title="Say hello"
        description={
          site.note ||
          "A letter, a kind note, or a soft hello. I read every one."
        }
      />

      <Section>
        <Container size="lg">
          <div className={styles.split}>
            <div className={styles.story}>
              <p className={styles.handwritten}>dear reader,</p>
              <p>
                If something here made you pause, smile, or feel a little less alone,
                I would love to hear from you. No pitch decks required. Just words.
              </p>
              <p>
                {site.author} writes slowly and replies the same way. Tell me about a book
                you loved, a mountain you climbed, or a morning that felt like a poem.
              </p>
              <p className={styles.signoff}>with warmth,</p>
              <p className={styles.signature}>{site.author}</p>

              {site.socials.length > 0 && (
                <ul className={styles.socialList}>
                  {site.socials.map((s) => (
                    <li key={s.id || s.href || s.label}>
                      <SocialIcon
                        name={s.id || "link"}
                        href={s.href}
                        label={s.label}
                      />
                      <div>
                        <a href={s.href} className={styles.socialLabel}>
                          {s.label}
                        </a>
                        {s.handle && <p className={styles.handle}>{s.handle}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <p className={styles.formEyebrow}>Write a note</p>
              <Input
                label="Name"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
              <TextArea
                label="Message"
                name="message"
                placeholder="Something kind, curious, or quietly brave…"
                rows={6}
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                required
              />
              <Button type="submit" fullWidth>
                Send letter
              </Button>
              {status && <p className={styles.formHint}>{status}</p>}
              {site.email && (
                <p className={styles.formHint}>
                  Or email directly:{" "}
                  <a href={`mailto:${site.email}`} className="link-underline">
                    {site.email}
                  </a>
                </p>
              )}
            </form>
          </div>
        </Container>
      </Section>
    </div>
  );
}

export default Contact;
