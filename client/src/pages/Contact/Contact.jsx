import {
  PageHeader,
  Section,
  Container,
  SocialIcon,
  Input,
  TextArea,
  Button,
} from "../../components";
import { CONTACT_SOCIALS, ABOUT } from "../../data";
import styles from "./Contact.module.css";

function Contact() {
  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Contact"
        title="Say hello"
        description="A letter, a kind note, or a soft hello — I read every one."
      />

      <Section>
        <Container size="lg">
          <div className={styles.split}>
            <div className={styles.story}>
              <p className={styles.handwritten}>dear reader,</p>
              <p>
                If something here made you pause, smile, or feel a little less alone —
                I would love to hear from you. No pitch decks required. Just words.
              </p>
              <p>
                {ABOUT.name} writes slowly and replies the same way. Tell me about a book
                you loved, a mountain you climbed, or a morning that felt like a poem.
              </p>
              <p className={styles.signoff}>with warmth,</p>
              <p className={styles.signature}>{ABOUT.name}</p>

              <ul className={styles.socialList}>
                {CONTACT_SOCIALS.map((s) => (
                  <li key={s.id}>
                    <SocialIcon name={s.id} href={s.href} label={s.label} />
                    <div>
                      <a href={s.href} className={styles.socialLabel}>
                        {s.label}
                      </a>
                      <p className={styles.handle}>{s.handle}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <p className={styles.formEyebrow}>Write a note</p>
              <Input label="Name" name="name" placeholder="Your name" required />
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@email.com"
                required
              />
              <TextArea
                label="Message"
                name="message"
                placeholder="Something kind, curious, or quietly brave…"
                rows={6}
                required
              />
              <Button type="submit" fullWidth>
                Send letter
              </Button>
              <p className={styles.formHint}>
                Or email directly —{" "}
                <a href="mailto:manognasamayam@gmail.com" className="link-underline">
                  manognasamayam@gmail.com
                </a>
              </p>
            </form>
          </div>
        </Container>
      </Section>
    </div>
  );
}

export default Contact;
