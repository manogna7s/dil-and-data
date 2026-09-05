import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import {
  PageHeader,
  Section,
  Container,
  CategoryCard,
  BlogCard,
  SectionTitle,
  EmptyState,
  Loader,
} from "../../components";
import { ROUTES, categoryPath } from "../../constants";
import { listPublicCategories } from "../../services/category.service.js";
import { listPublicContent } from "../../services/content.service.js";
import { toCardProps } from "../../blocks/fetchLive";
import useDocumentSeo from "../../hooks/useDocumentSeo.js";
import {
  useJsonLd,
  collectionPageJsonLd,
  breadcrumbJsonLd,
} from "../../utils/jsonLd.js";
import { SITE } from "../../constants";
import styles from "./Categories.module.css";

function Categories() {
  const { slug: routeSlug } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const querySlug = params.get("category");
  const selected = routeSlug || querySlug || "";

  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState(null);
  const [loading, setLoading] = useState(true);

  // Legacy ?category= → canonical /categories/:slug
  useEffect(() => {
    if (querySlug && !routeSlug) {
      navigate(categoryPath(querySlug), { replace: true });
    }
  }, [querySlug, routeSlug, navigate]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const cats = await listPublicCategories();
        if (!cancelled) setCategories(Array.isArray(cats) ? cats : []);
      } catch {
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!selected) {
      setFiltered(null);
      return undefined;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    (async () => {
      try {
        const match = categories.find(
          (c) => c.slug === selected || String(c._id) === selected
        );
        const list = await listPublicContent({
          category: match?._id || selected,
          limit: 24,
          type: "blog",
        });
        if (!cancelled) {
          setFiltered((list?.items || []).map(toCardProps).filter(Boolean));
        }
      } catch {
        if (!cancelled) setFiltered([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selected, categories]);

  const activeCategory = selected
    ? categories.find((c) => c.slug === selected || String(c._id) === selected)
    : null;

  const catTitle = activeCategory?.title || activeCategory?.name || selected;
  const catDesc =
    activeCategory?.description ||
    (selected
      ? `Stories filed under ${catTitle} in DIL & DATA — an independent personal publication.`
      : "Browse the shelves of DIL & DATA: travel, books, diary notes, and whatever else grows here.");

  useDocumentSeo(
    selected
      ? {
          title: `${catTitle} | Stories`,
          description: catDesc.slice(0, 160),
          path: categoryPath(activeCategory?.slug || selected),
        }
      : {
          title: "Categories | Stories, Travel, Culture & Ideas",
          description:
            "Browse DIL & DATA by topic — stories, travel, culture, books, and the curious corners of everyday life.",
          path: ROUTES.CATEGORIES,
        }
  );

  useJsonLd(
    "category-page",
    collectionPageJsonLd({
      name: selected ? catTitle : "Categories",
      description: catDesc,
      url: selected
        ? `${SITE.CANONICAL_BASE}${categoryPath(activeCategory?.slug || selected)}`
        : `${SITE.CANONICAL_BASE}/categories`,
    })
  );

  useJsonLd(
    "category-breadcrumbs",
    selected
      ? breadcrumbJsonLd([
          { name: "Home", url: `${SITE.CANONICAL_BASE}/` },
          { name: "Categories", url: `${SITE.CANONICAL_BASE}/categories` },
          {
            name: catTitle,
            url: `${SITE.CANONICAL_BASE}${categoryPath(activeCategory?.slug || selected)}`,
          },
        ])
      : breadcrumbJsonLd([
          { name: "Home", url: `${SITE.CANONICAL_BASE}/` },
          { name: "Categories", url: `${SITE.CANONICAL_BASE}/categories` },
        ])
  );

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Topics"
        title={selected ? catTitle : "Browse by category"}
        description={
          selected
            ? activeCategory?.description || undefined
            : "Shelves for stories that belong together."
        }
      />

      {selected && (
        <Section tone="surface">
          <Container size="lg">
            <div className={styles.filterHead}>
              <SectionTitle>{catTitle}</SectionTitle>
              <Link to={ROUTES.CATEGORIES} className={`link-underline ${styles.clear}`}>
                All categories
              </Link>
            </div>
            {activeCategory?.description && (
              <p className={styles.desc}>{activeCategory.description}</p>
            )}

            {filtered === null ? (
              <Loader label="Loading stories…" />
            ) : !filtered.length ? (
              <EmptyState
                title="No stories in this category yet"
                description="Publish from Creator Studio and they'll land here."
              />
            ) : (
              <div className={styles.posts}>
                {filtered.map((post) => (
                  <BlogCard key={post.id} {...post} />
                ))}
              </div>
            )}
          </Container>
        </Section>
      )}

      <Section>
        <Container size="lg">
          {selected && <SectionTitle>All categories</SectionTitle>}
          {loading ? (
            <Loader label="Loading shelves…" />
          ) : categories.length === 0 ? (
            <EmptyState
              title="No categories yet"
              description="Add categories from Studio when you're ready to organize the journal."
            />
          ) : (
            <div className={styles.grid}>
              {categories.map((cat) => (
                <CategoryCard
                  key={cat._id || cat.slug}
                  name={cat.title || cat.name}
                  count={cat.contentCount ?? cat.count ?? 0}
                  image={cat.image || cat.coverImage || ""}
                  href={categoryPath(cat.slug || cat._id)}
                />
              ))}
            </div>
          )}
        </Container>
      </Section>

      {!selected && !loading && categories.length > 0 && (
        <Section>
          <Container size="md">
            <p className={styles.hint}>
              Pick a shelf above to begin. Only published stories appear.
            </p>
          </Container>
        </Section>
      )}
    </div>
  );
}

export default Categories;
