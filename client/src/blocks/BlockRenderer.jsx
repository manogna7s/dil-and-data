import { useEffect, useState } from "react";
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
  Divider,
} from "../components";
import {
  fetchFeaturedContent,
  fetchRecentContent,
  fetchPublicCategories,
  toCardProps,
} from "./fetchLive";
import { resolveSectionTone } from "./blockTypes";
import styles from "./blocks.module.css";

/**
 * Renders one CMS block. Live feed blocks fall back gracefully when API is empty.
 */
export function BlockView({ block }) {
  if (!block?.enabled) return null;
  const data = block.data || {};

  switch (block.type) {
    case "hero":
      return (
        <Hero
          eyebrow={data.eyebrow}
          title={data.title}
          tagline={data.tagline}
          ctaLabel={data.ctaLabel}
          ctaTo={data.ctaTo || "/blogs"}
        />
      );
    case "featuredStory":
      return <FeaturedStoryBlock data={data} />;
    case "photographyCarousel": {
      const photos = (data.items || [])
        .filter((item) => item?.src || item?.url)
        .map((item, i) => ({
          id: item.id || `ph-${i}`,
          title: item.title,
          location: item.location,
          src: item.src || item.url,
          alt: item.alt || item.title || "",
        }));
      if (!photos.length) return null;
      return (
        <PhotographyCarousel
          photos={photos}
          tone={resolveSectionTone(data.tone, "surface")}
        />
      );
    }
    case "latestStories":
      return <LatestStoriesBlock data={data} />;
    case "categories":
      return <CategoriesBlock data={data} />;
    case "quote":
      if (!String(data.text || "").trim()) return null;
      return (
        <Section tone={resolveSectionTone(data.tone, "default")}>
          <Container size="sm">
            {data.eyebrow && (
              <p className={`eyebrow ${styles.quoteLabel}`}>{data.eyebrow}</p>
            )}
            <QuoteBlock attribution={data.attribution}>{data.text}</QuoteBlock>
          </Container>
        </Section>
      );
    case "newsletter":
      return (
        <Newsletter
          title={data.title || undefined}
          description={data.description || undefined}
          tone={resolveSectionTone(data.tone, "surface")}
        />
      );
    case "aboutPreview":
      return (
        <Section tone={resolveSectionTone(data.tone, "surface")}>
          <Container size="lg">
            <div
              className={`${styles.aboutPreview} ${
                data.portrait ? "" : styles.aboutPreviewTextOnly
              }`}
            >
              {data.portrait && (
                <figure className={styles.aboutPortrait}>
                  <img src={data.portrait} alt={data.name || ""} loading="lazy" />
                </figure>
              )}
              <div>
                <SectionTitle>
                  {data.name ? `A note from ${data.name}` : "A note"}
                </SectionTitle>
                {data.role && <p className={styles.aboutRole}>{data.role}</p>}
                {data.intro && <p className={styles.aboutIntro}>{data.intro}</p>}
                {data.ctaTo && (
                  <Link to={data.ctaTo} className={styles.aboutCta}>
                    {data.ctaLabel || "Read more"}
                  </Link>
                )}
              </div>
            </div>
          </Container>
        </Section>
      );
    case "features": {
      const items = (data.items || []).filter((item) => item?.title);
      if (!items.length) return null;
      return (
        <Section tone={resolveSectionTone(data.tone, "default")}>
          <Container size="lg">
            {data.title && (
              <SectionTitle align="center">{data.title}</SectionTitle>
            )}
            <ul className={styles.features}>
              {items.map((item, i) => (
                <li key={`${item.title}-${i}`} className={styles.feature}>
                  <h3>{item.title}</h3>
                  {item.description && <p>{item.description}</p>}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      );
    }
    case "divider":
      return (
        <Section tone={resolveSectionTone(data.tone, "default")}>
          <Container size="sm">
            <Divider label={data.label || undefined} />
          </Container>
        </Section>
      );
    case "image":
      if (!data.url) return null;
      return (
        <Section tone={resolveSectionTone(data.tone, "default")}>
          <Container size="md">
            <figure className={styles.figure}>
              <img src={data.url} alt={data.alt || ""} loading="lazy" />
              {data.caption && <figcaption>{data.caption}</figcaption>}
            </figure>
          </Container>
        </Section>
      );
    case "gallery":
      return (
        <Section tone={resolveSectionTone(data.tone, "default")}>
          <Container size="lg">
            {data.title && <SectionTitle>{data.title}</SectionTitle>}
            <div className={styles.gallery}>
              {(data.items || []).map((item, i) => (
                <img
                  key={item.url || i}
                  src={item.url || item.src}
                  alt={item.alt || ""}
                  loading="lazy"
                />
              ))}
            </div>
          </Container>
        </Section>
      );
    case "video":
      if (!data.url) return null;
      return (
        <Section tone={resolveSectionTone(data.tone, "default")}>
          <Container size="md">
            {data.title && <SectionTitle>{data.title}</SectionTitle>}
            <video
              className={styles.video}
              src={data.url}
              poster={data.poster || undefined}
              controls
              playsInline
            />
          </Container>
        </Section>
      );
    case "richText":
      return (
        <Section tone={resolveSectionTone(data.tone, "default")}>
          <Container size="md">
            {data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}
            {data.title && <SectionTitle>{data.title}</SectionTitle>}
            <div
              className={styles.prose}
              dangerouslySetInnerHTML={{ __html: data.html || "" }}
            />
          </Container>
        </Section>
      );
    case "timeline":
      return (
        <Section tone={resolveSectionTone(data.tone, "surface")}>
          <Container size="md">
            {data.title && (
              <SectionTitle align="center">{data.title}</SectionTitle>
            )}
            <ol className={styles.timeline}>
              {(data.items || []).map((item, i) => (
                <li key={`${item.year}-${i}`} className={styles.timelineItem}>
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
      );
    case "bookshelf":
      return (
        <Section tone={resolveSectionTone(data.tone, "muted")}>
          <Container size="lg">
            {data.title && <SectionTitle>{data.title}</SectionTitle>}
            {data.note && <p className={styles.shelfNote}>{data.note}</p>}
            <div className={styles.bookshelf}>
              {(data.items || []).map((book, i) => (
                <article key={`${book.title}-${i}`} className={styles.book}>
                  {book.cover && (
                    <img src={book.cover} alt="" className={styles.bookCover} loading="lazy" />
                  )}
                  <h3 className={styles.bookTitle}>{book.title}</h3>
                  <p className={styles.bookAuthor}>{book.author}</p>
                  {book.note && <p className={styles.bookNote}>{book.note}</p>}
                </article>
              ))}
            </div>
          </Container>
        </Section>
      );
    case "faq":
      return (
        <Section tone={resolveSectionTone(data.tone, "surface")}>
          <Container size="md">
            {data.title && (
              <SectionTitle align="center">{data.title}</SectionTitle>
            )}
            <div className={styles.faq}>
              {(data.items || []).map((item, i) => (
                <details key={i} className={styles.faqItem}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </Container>
        </Section>
      );
    case "cta":
      return (
        <Section tone={resolveSectionTone(data.tone, "surface")}>
          <Container size="sm">
            <div className={styles.ctaBlock}>
              {data.title && <SectionTitle align="center">{data.title}</SectionTitle>}
              {data.description && <p className={styles.ctaDesc}>{data.description}</p>}
              {data.buttonTo && (
                <Link to={data.buttonTo} className={styles.ctaBtn}>
                  {data.buttonLabel || "Continue"}
                </Link>
              )}
            </div>
          </Container>
        </Section>
      );
    case "embed":
      if (!data.html) return null;
      return (
        <Section tone={resolveSectionTone(data.tone, "default")}>
          <Container size="md">
            <div
              className={styles.embed}
              dangerouslySetInnerHTML={{ __html: data.html }}
            />
            {data.caption && <p className={styles.caption}>{data.caption}</p>}
          </Container>
        </Section>
      );
    default:
      return null;
  }
}

function FeaturedStoryBlock({ data }) {
  const [post, setPost] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const items = await fetchFeaturedContent(1);
        const list = Array.isArray(items) ? items : [];
        if (!cancelled) setPost(toCardProps(list[0]));
      } catch {
        if (!cancelled) setPost(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [data.contentId, data.source]);

  if (!post) return null;
  return (
    <FeaturedStory
      post={post}
      tone={resolveSectionTone(data.tone, "default")}
    />
  );
}

function LatestStoriesBlock({ data }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const items = await fetchRecentContent(data.limit || 6);
        const list = (Array.isArray(items) ? items : []).map(toCardProps).filter(Boolean);
        if (!cancelled) setPosts(list);
      } catch {
        if (!cancelled) setPosts([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [data.limit, data.contentType]);

  if (!posts.length) return null;

  return (
    <Section tone={resolveSectionTone(data.tone, "default")}>
      <Container size="lg">
        <div className={styles.sectionHead}>
          <SectionTitle>{data.title || "Latest stories"}</SectionTitle>
          {data.seeAllTo && (
            <Link to={data.seeAllTo} className={`link-underline ${styles.seeAll}`}>
              {data.seeAllLabel || "View all"}
            </Link>
          )}
        </div>
        <div className={styles.grid}>
          {posts.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function CategoriesBlock({ data }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const items = await fetchPublicCategories();
        const list = (Array.isArray(items) ? items : []).map((cat) => ({
          id: cat._id || cat.id,
          name: cat.title || cat.name,
          count: cat.contentCount ?? cat.count ?? 0,
          image: cat.image || cat.coverImage || "",
          href: `/categories`,
        }));
        if (!cancelled) setCategories(list);
      } catch {
        if (!cancelled) setCategories([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!categories.length) return null;

  return (
    <Section tone={resolveSectionTone(data.tone, "muted")}>
      <Container size="lg">
        <SectionTitle align="center">{data.title || "Browse categories"}</SectionTitle>
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
  );
}

export function BlockRenderer({ blocks = [], preview = false }) {
  const list = preview
    ? blocks
    : blocks.filter((b) => b.enabled !== false);

  return (
    <>
      {list.map((block) => (
        <div
          key={block.id}
          data-block-id={block.id}
          data-block-type={block.type}
          className={block.enabled === false ? styles.disabledPreview : undefined}
        >
          <BlockView block={{ ...block, enabled: true }} />
        </div>
      ))}
    </>
  );
}

export default BlockRenderer;
