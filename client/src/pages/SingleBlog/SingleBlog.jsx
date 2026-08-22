import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumb,
  Badge,
  Container,
  BlogCard,
  Newsletter,
  EmptyState,
  Avatar,
  Loader,
  PolaroidBucketList,
} from "../../components";
import ReadingProgress from "../../components/ReadingProgress/ReadingProgress";
import ArticleContent from "../../components/ArticleContent/ArticleContent";
import ArticleActions from "../../components/ArticleActions/ArticleActions";
import CommentSection from "../../components/CommentSection/CommentSection";
import { formatBlogDate } from "../../utils/formatDate.js";
import { optimizeImageUrl, optimizeHtmlImages } from "../../utils/optimizeImage.js";
import { isPolaroidCategory } from "../../utils/categoryLayout.js";
import { ROUTES, SITE } from "../../constants";
import {
  getContentBySlug,
  listPublicContent,
} from "../../services/content.service.js";
import { toCardProps } from "../../blocks/fetchLive";
import useDocumentSeo from "../../hooks/useDocumentSeo.js";
import styles from "./SingleBlog.module.css";

function SingleBlog() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setMissing(false);
      setRelated([]);
      try {
        const item = await getContentBySlug(slug);
        if (cancelled) return;
        setPost(item);
        setLoading(false);

        const more = await listPublicContent({
          limit: 4,
          sort: "newest",
          type: "blog",
          category: item?.category?.slug || item?.category?._id || "",
        });
        if (cancelled) return;
        const cards = (more?.items || [])
          .filter((p) => p.slug !== slug)
          .slice(0, 3)
          .map(toCardProps)
          .filter(Boolean);
        setRelated(cards);
      } catch {
        if (!cancelled) {
          setPost(null);
          setRelated([]);
          setMissing(true);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useDocumentSeo(
    post
      ? {
          title: post.seo?.title || post.title,
          description: post.seo?.description || post.excerpt || undefined,
          image: post.seo?.image || post.coverImage || undefined,
          ogImage: post.seo?.image || post.coverImage || undefined,
        }
      : null,
    { skip: !post }
  );

  if (loading) {
    return (
      <Container size="md">
        <Loader label="Opening the story…" />
      </Container>
    );
  }

  if (missing || !post) {
    return (
      <Container size="md">
        <EmptyState
          title="Story not found"
          description="This chapter may have moved, or not been written yet."
          actionLabel="Browse stories"
          onAction={() => navigate(ROUTES.BLOGS)}
        />
      </Container>
    );
  }

  const categoryName =
    post.category?.title || post.category?.name || "Journal";
  const author = post.author || { name: SITE.AUTHOR, avatar: "", bio: "" };
  const polaroidMode =
    isPolaroidCategory(post.category) &&
    Array.isArray(post.polaroidItems) &&
    post.polaroidItems.length > 0;

  return (
    <article className={styles.page}>
      <ReadingProgress />

      <header className={styles.hero}>
        <Container size="md">
          <Breadcrumb
            items={[
              { label: "Home", href: ROUTES.HOME },
              { label: SITE.BLOG_NAME, href: ROUTES.BLOGS },
              { label: post.title },
            ]}
          />
          <div className={styles.meta}>
            <Badge>{categoryName}</Badge>
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {formatBlogDate(post.publishedAt)}
              </time>
            )}
            {post.readingTime ? <span>{post.readingTime} min read</span> : null}
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
          <div className={styles.author}>
            <Avatar src={author.avatar} alt={author.name || SITE.AUTHOR} size="sm" />
            <div>
              <p className={styles.authorName}>{author.name || SITE.AUTHOR}</p>
              {author.bio ? <p className={styles.authorBio}>{author.bio}</p> : null}
            </div>
          </div>
        </Container>
      </header>

      {post.coverImage && !polaroidMode ? (
        <div className={styles.cover}>
          <img
            src={optimizeImageUrl(post.coverImage, { width: 1600 })}
            alt=""
            className={styles.coverImage}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      ) : null}

      <Container size="md" className={styles.bodyLayout}>
        <div className={styles.article}>
          {polaroidMode ? (
            <PolaroidBucketList items={post.polaroidItems} />
          ) : (
            <ArticleContent html={optimizeHtmlImages(post.body || "")} />
          )}
          <ArticleActions
            title={post.title}
            slug={post.slug}
            contentId={post._id}
            initialLikes={post.likesCount || 0}
          />
          <CommentSection contentId={post._id} />
        </div>
      </Container>

      <Newsletter />

      {related.length > 0 && (
        <Container size="lg" className={styles.related}>
          <h2 className={styles.relatedTitle}>Continue reading</h2>
          <div className={styles.relatedGrid}>
            {related.map((item) => (
              <BlogCard key={item.id} {...item} />
            ))}
          </div>
          <p className={styles.back}>
            <Link to={ROUTES.BLOGS} className="link-underline">
              All of {SITE.BLOG_NAME}
            </Link>
          </p>
        </Container>
      )}
    </article>
  );
}

export default SingleBlog;
