import { useEffect, useMemo, useState } from "react";
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
import { ROUTES, SITE, categoryPath } from "../../constants";
import {
  getContentBySlug,
  listPublicContent,
} from "../../services/content.service.js";
import { toCardProps } from "../../blocks/fetchLive";
import useDocumentSeo from "../../hooks/useDocumentSeo.js";
import {
  useJsonLd,
  blogPostingJsonLd,
  breadcrumbJsonLd,
} from "../../utils/jsonLd.js";
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
          limit: 6,
          sort: "newest",
          type: "blog",
          category: item?.category?.slug || item?.category?._id || "",
        });
        if (cancelled) return;
        const cards = (more?.items || [])
          .filter((p) => p.slug !== slug)
          .slice(0, 5)
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

  const categoryName =
    post?.category?.title || post?.category?.name || "";
  const categorySlug = post?.category?.slug || "";
  const author = post?.author || { name: SITE.AUTHOR, avatar: "", bio: "" };
  const canonicalPath = `/blogs/${post?.slug || slug}`;

  useDocumentSeo(
    post
      ? {
          title: post.seo?.title || post.title,
          description: post.seo?.description || post.excerpt || undefined,
          image: post.seo?.image || post.coverImage || undefined,
          ogImage: post.seo?.image || post.coverImage || undefined,
          ogType: "article",
          publishedTime: post.publishedAt || undefined,
          modifiedTime: post.updatedAt || post.publishedAt || undefined,
          authorName: author.name || SITE.AUTHOR,
          section: categoryName || undefined,
          path: canonicalPath,
        }
      : null,
    { skip: !post }
  );

  const articleLd = useMemo(() => {
    if (!post) return null;
    return blogPostingJsonLd({
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt || "",
      url: `${SITE.CANONICAL_BASE}${canonicalPath}`,
      image: post.seo?.image || post.coverImage || "",
      datePublished: post.publishedAt || undefined,
      dateModified: post.updatedAt || post.publishedAt || undefined,
      authorName: author.name || SITE.AUTHOR,
      authorUrl: `${SITE.CANONICAL_BASE}/about`,
      publisherName: SITE.NAME,
    });
  }, [post, canonicalPath, author.name]);

  const crumbsLd = useMemo(() => {
    if (!post) return null;
    const items = [
      { name: "Home", url: `${SITE.CANONICAL_BASE}/` },
      { name: "Stories", url: `${SITE.CANONICAL_BASE}/blogs` },
    ];
    if (categoryName && categorySlug) {
      items.push({
        name: categoryName,
        url: `${SITE.CANONICAL_BASE}${categoryPath(categorySlug)}`,
      });
    }
    items.push({
      name: post.title,
      url: `${SITE.CANONICAL_BASE}${canonicalPath}`,
    });
    return breadcrumbJsonLd(items);
  }, [post, categoryName, categorySlug, canonicalPath]);

  useJsonLd("article", articleLd);
  useJsonLd("article-breadcrumbs", crumbsLd);

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

  const polaroidMode =
    isPolaroidCategory(post.category) &&
    Array.isArray(post.polaroidItems) &&
    post.polaroidItems.length > 0;

  const crumbItems = [
    { label: "Home", href: ROUTES.HOME },
    { label: "Stories", href: ROUTES.BLOGS },
  ];
  if (categoryName && categorySlug) {
    crumbItems.push({
      label: categoryName,
      href: categoryPath(categorySlug),
    });
  }
  crumbItems.push({ label: post.title });

  return (
    <article className={styles.page} itemScope itemType="https://schema.org/BlogPosting">
      <ReadingProgress />

      <header className={styles.hero}>
        <Container size="md">
          <Breadcrumb items={crumbItems} />
          <div className={styles.meta}>
            {categoryName && categorySlug ? (
              <Link to={categoryPath(categorySlug)} className={styles.catLink}>
                <Badge>{categoryName}</Badge>
              </Link>
            ) : categoryName ? (
              <Badge>{categoryName}</Badge>
            ) : null}
            {post.publishedAt && (
              <time dateTime={post.publishedAt} itemProp="datePublished">
                {formatBlogDate(post.publishedAt)}
              </time>
            )}
            {post.readingTime ? <span>{post.readingTime} min read</span> : null}
          </div>
          <h1 className={styles.title} itemProp="headline">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className={styles.excerpt} itemProp="description">
              {post.excerpt}
            </p>
          )}
          <div className={styles.author} itemProp="author" itemScope itemType="https://schema.org/Person">
            <Avatar src={author.avatar} alt={author.name || SITE.AUTHOR} size="sm" />
            <div>
              <p className={styles.authorName} itemProp="name">
                {author.name || SITE.AUTHOR}
              </p>
              {author.bio ? <p className={styles.authorBio}>{author.bio}</p> : null}
            </div>
          </div>
        </Container>
      </header>

      {post.coverImage && !polaroidMode ? (
        <div className={styles.cover}>
          <img
            src={optimizeImageUrl(post.coverImage, { width: 1600 })}
            alt={post.title || ""}
            className={styles.coverImage}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={1600}
            height={900}
            itemProp="image"
          />
        </div>
      ) : null}

      <Container size="md" className={styles.bodyLayout}>
        <div className={styles.article} itemProp="articleBody">
          {polaroidMode ? (
            <PolaroidBucketList items={post.polaroidItems} />
          ) : (
            <ArticleContent html={optimizeHtmlImages(post.body || "")} />
          )}

          {categoryName && categorySlug && (
            <p className={styles.shelfNote}>
              Filed under{" "}
              <Link to={categoryPath(categorySlug)} className="link-underline">
                {categoryName}
              </Link>
              .
            </p>
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
          <h2 className={styles.relatedTitle}>
            {categoryName ? `More from ${categoryName}` : "Continue reading"}
          </h2>
          <div className={styles.relatedGrid}>
            {related.map((item) => (
              <BlogCard key={item.id} {...item} />
            ))}
          </div>
          <p className={styles.back}>
            <Link to={ROUTES.BLOGS} className="link-underline">
              All stories
            </Link>
            {categorySlug && (
              <>
                {" · "}
                <Link to={categoryPath(categorySlug)} className="link-underline">
                  {categoryName} shelf
                </Link>
              </>
            )}
          </p>
        </Container>
      )}
    </article>
  );
}

export default SingleBlog;
