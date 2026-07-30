import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumb,
  Badge,
  Container,
  BlogCard,
  Newsletter,
  EmptyState,
  Avatar,
} from "../../components";
import ReadingProgress from "../../components/ReadingProgress/ReadingProgress";
import ArticleContent from "../../components/ArticleContent/ArticleContent";
import ArticleActions from "../../components/ArticleActions/ArticleActions";
import CommentSection from "../../components/CommentSection/CommentSection";
import {
  getBlogBySlug,
  getAdjacentBlogs,
  getRelatedBlogs,
  formatBlogDate,
  toBlogCard,
} from "../../data";
import { ROUTES } from "../../constants";
import styles from "./SingleBlog.module.css";

function SingleBlog() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = getBlogBySlug(slug);

  if (!post) {
    return (
      <Container size="md">
        <EmptyState
          title="Story not found"
          description="This chapter may have moved — or not been written yet."
          actionLabel="Browse stories"
          onAction={() => navigate(ROUTES.BLOGS)}
        />
      </Container>
    );
  }

  const { previous, next } = getAdjacentBlogs(slug);
  const related = getRelatedBlogs(slug, 3).map(toBlogCard);

  return (
    <article className={styles.page}>
      <ReadingProgress />

      <header className={styles.hero}>
        <Container size="md">
          <Breadcrumb
            items={[
              { label: "Home", href: ROUTES.HOME },
              { label: "Blogs", href: ROUTES.BLOGS },
              { label: post.title },
            ]}
          />
          <div className={styles.meta}>
            <Badge>{post.categoryName}</Badge>
            <time dateTime={post.publishedAt}>
              {formatBlogDate(post.publishedAt)}
            </time>
            <span>{post.readingTime} min read</span>
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.excerpt}>{post.excerpt}</p>
          <div className={styles.author}>
            <Avatar src={post.author.avatar} alt={post.author.name} size="sm" />
            <div>
              <p className={styles.authorName}>{post.author.name}</p>
              <p className={styles.authorBio}>{post.author.bio}</p>
            </div>
          </div>
        </Container>
      </header>

      <div className={styles.cover}>
        <img
          src={post.coverImage}
          alt=""
          className={styles.coverImage}
          loading="eager"
        />
      </div>

      <Container size="lg" className={styles.bodyLayout}>
        <aside className={styles.toc} aria-label="Table of contents">
          <p className={styles.tocTitle}>On this page</p>
          <ol>
            {post.headings.map((h) => (
              <li key={h.id}>
                <a href={`#${h.id}`}>{h.text}</a>
              </li>
            ))}
          </ol>
        </aside>

        <div className={styles.article}>
          <ArticleContent blocks={post.content} />
          <ArticleActions title={post.title} slug={post.slug} />
          <CommentSection />
        </div>
      </Container>

      <Newsletter />

      <Container size="lg" className={styles.navArticles}>
        <div className={styles.prevNext}>
          {previous ? (
            <Link to={`/blogs/${previous.slug}`} className={styles.adjacent}>
              <span className={styles.adjacentLabel}>Previous</span>
              <span className={styles.adjacentTitle}>{previous.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to={`/blogs/${next.slug}`}
              className={`${styles.adjacent} ${styles.adjacentNext}`}
            >
              <span className={styles.adjacentLabel}>Next</span>
              <span className={styles.adjacentTitle}>{next.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </div>

        {related.length > 0 && (
          <section className={styles.related} aria-labelledby="related-heading">
            <h2 id="related-heading" className={styles.relatedTitle}>
              Related stories
            </h2>
            <div className={styles.relatedGrid}>
              {related.map((item) => (
                <BlogCard key={item.id} {...item} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </article>
  );
}

export default SingleBlog;
