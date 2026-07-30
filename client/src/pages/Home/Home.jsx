import { Link } from "react-router-dom";
import {
  Hero,
  FeaturedStory,
  PhotographyCarousel,
  Section,
  SectionTitle,
  Container,
  BlogCard,
  CategoryCard,
  QuoteBlock,
  Newsletter,
  Avatar,
  OutlineButton,
} from "../../components";
import {
  getFeaturedBlog,
  getLatestBlogs,
  getFeaturedQuote,
  getCategoriesWithCounts,
  PHOTOGRAPHY,
  ABOUT,
  toBlogCard,
} from "../../data";
import { ROUTES } from "../../constants";
import styles from "./Home.module.css";

/**
 * Home — premium editorial landing page.
 * All content from data/; swap to API services later without changing layout.
 */
function Home() {
  const featured = getFeaturedBlog();
  const latest = getLatestBlogs(6).map(toBlogCard);
  const quote = getFeaturedQuote();
  const categories = getCategoriesWithCounts();

  return (
    <div className={styles.page}>
      <Hero />

      <FeaturedStory post={featured} />

      <PhotographyCarousel photos={PHOTOGRAPHY} />

      <Section>
        <Container size="lg">
          <div className={styles.sectionHead}>
            <SectionTitle>Latest stories</SectionTitle>
            <Link to={ROUTES.BLOGS} className={`link-underline ${styles.seeAll}`}>
              View all
            </Link>
          </div>
          <div className={styles.grid}>
            {latest.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container size="lg">
          <SectionTitle align="center">Browse categories</SectionTitle>
          <div className={styles.categoryGrid}>
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                name={cat.name}
                count={cat.count}
                image={cat.image}
                href={cat.href}
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="sm">
          <p className={`eyebrow ${styles.quoteLabel}`}>Quote of the week</p>
          <QuoteBlock attribution={quote.attribution}>{quote.text}</QuoteBlock>
        </Container>
      </Section>

      <Section tone="surface">
        <Container size="lg">
          <div className={styles.aboutPreview}>
            <Avatar src={ABOUT.portrait} alt={ABOUT.name} size="xl" />
            <div>
              <SectionTitle>A note from {ABOUT.name}</SectionTitle>
              <p className={styles.aboutRole}>{ABOUT.role}</p>
              <p className={styles.aboutIntro}>{ABOUT.intro}</p>
              <Link to={ROUTES.ABOUT}>
                <OutlineButton>Read more about me</OutlineButton>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Newsletter />
    </div>
  );
}

export default Home;
