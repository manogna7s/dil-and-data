import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
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
import { ROUTES } from "../../constants";
import { listPublicCategories } from "../../services/category.service.js";
import { listPublicContent } from "../../services/content.service.js";
import { toCardProps } from "../../blocks/fetchLive";
import styles from "./Categories.module.css";

function Categories() {
  const [params] = useSearchParams();
  const selected = params.get("category");
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Topics"
        title="Browse by category"
        description="Shelves appear here once you create categories in Creator Studio."
      />

      <Section>
        <Container size="lg">
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
                  href={`${ROUTES.CATEGORIES}?category=${cat.slug || cat._id}`}
                />
              ))}
            </div>
          )}
        </Container>
      </Section>

      {selected && (
        <Section tone="surface">
          <Container size="lg">
            <div className={styles.filterHead}>
              <SectionTitle>
                {activeCategory?.title || activeCategory?.name || "Category"}
              </SectionTitle>
              <Link to={ROUTES.CATEGORIES} className={`link-underline ${styles.clear}`}>
                Clear filter
              </Link>
            </div>
            {activeCategory?.description && (
              <p className={styles.desc}>{activeCategory.description}</p>
            )}

            {!filtered?.length ? (
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
