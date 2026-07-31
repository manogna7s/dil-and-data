import { Link } from "react-router-dom";
import Badge from "../Badge/Badge";
import Container from "../Container/Container";
import Section from "../Section/Section";
import SectionTitle from "../SectionTitle/SectionTitle";
import { formatBlogDate } from "../../utils/formatDate.js";
import styles from "./FeaturedStory.module.css";

/**
 * FeaturedStory — large editorial teaser for the homepage.
 * Props map 1:1 to a future featured-post API payload.
 */
function FeaturedStory({ post }) {
  if (!post) return null;

  const href = `/blogs/${post.slug}`;

  return (
    <Section className={styles.section}>
      <Container size="lg">
        <SectionTitle>Featured story</SectionTitle>
        <article className={styles.layout}>
          {post.coverImage ? (
            <Link to={href} className={styles.media} tabIndex={-1} aria-hidden="true">
              <img
                src={post.coverImage}
                alt=""
                className={styles.image}
                loading="lazy"
              />
            </Link>
          ) : null}
          <div className={styles.body}>
            <div className={styles.meta}>
              <Badge>{post.categoryName}</Badge>
              <time dateTime={post.publishedAt}>
                {formatBlogDate(post.publishedAt)}
              </time>
              <span>{post.readingTime} min read</span>
            </div>
            <h3 className={styles.title}>
              <Link to={href}>{post.title}</Link>
            </h3>
            <p className={styles.excerpt}>{post.excerpt}</p>
            <Link to={href} className={`link-underline ${styles.read}`}>
              Read the story
            </Link>
          </div>
        </article>
      </Container>
    </Section>
  );
}

export default FeaturedStory;
