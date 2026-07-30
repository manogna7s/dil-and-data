import {
  PageHeader,
  Section,
  SectionTitle,
  Container,
  Avatar,
  QuoteBlock,
  Divider,
} from "../../components";
import {
  ABOUT,
  TIMELINE,
  BOOKS,
  FAQ,
  getFeaturedQuote,
} from "../../data";
import styles from "./About.module.css";

function About() {
  const quote = getFeaturedQuote();

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="About"
        title={`Hello, I'm ${ABOUT.name}`}
        description={ABOUT.intro}
      />

      <Section>
        <Container size="lg">
          <div className={styles.intro}>
            <div className={styles.portraitWrap}>
              <img
                src={ABOUT.portrait}
                alt={`${ABOUT.name} — portrait`}
                className={styles.portrait}
                loading="lazy"
              />
            </div>
            <div className={styles.introCopy}>
              <p className={styles.role}>{ABOUT.role}</p>
              {ABOUT.story.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className={styles.story}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="surface">
        <Container size="md">
          <SectionTitle align="center">A quiet timeline</SectionTitle>
          <ol className={styles.timeline}>
            {TIMELINE.map((item) => (
              <li key={item.id} className={styles.timelineItem}>
                <span className={styles.year}>{item.year}</span>
                <div>
                  <h3 className={styles.timelineTitle}>{item.title}</h3>
                  <p className={styles.timelineDesc}>{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container size="lg">
          <SectionTitle align="center">Things I love</SectionTitle>
          <ul className={styles.loves}>
            {ABOUT.loves.map((love) => (
              <li key={love.id} className={styles.love}>
                <h3>{love.label}</h3>
                <p>{love.detail}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="muted">
        <Container size="lg">
          <SectionTitle>Bookshelf</SectionTitle>
          <p className={styles.shelfNote}>
            A few companions that still live on my nightstand and in my margins.
          </p>
          <div className={styles.bookshelf}>
            {BOOKS.map((book) => (
              <article key={book.id} className={styles.book}>
                <img
                  src={book.cover}
                  alt=""
                  className={styles.bookCover}
                  loading="lazy"
                />
                <h3 className={styles.bookTitle}>{book.title}</h3>
                <p className={styles.bookAuthor}>{book.author}</p>
                <p className={styles.bookNote}>{book.note}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="md">
          <SectionTitle align="center">Fun facts</SectionTitle>
          <ul className={styles.facts}>
            {ABOUT.funFacts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="surface">
        <Container size="md">
          <SectionTitle align="center">FAQ</SectionTitle>
          <div className={styles.faq}>
            {FAQ.map((item) => (
              <details key={item.id} className={styles.faqItem}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="sm">
          <Divider label="A closing note" />
          <QuoteBlock attribution={quote.attribution}>{quote.text}</QuoteBlock>
        </Container>
      </Section>
    </div>
  );
}

export default About;
