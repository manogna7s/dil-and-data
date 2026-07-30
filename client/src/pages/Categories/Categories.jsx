import { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  PageHeader,
  Section,
  Container,
  CategoryCard,
  BlogCard,
  SectionTitle,
  EmptyState,
} from "../../components";
import {
  getCategoriesWithCounts,
  getBlogsByCategory,
  getCategoryBySlug,
  toBlogCard,
  BLOGS,
} from "../../data";
import { ROUTES } from "../../constants";
import styles from "./Categories.module.css";

function Categories() {
  const [params] = useSearchParams();
  const selected = params.get("category");
  const categories = getCategoriesWithCounts();

  const filtered = useMemo(() => {
    if (!selected) return null;
    return getBlogsByCategory(selected).map(toBlogCard);
  }, [selected]);

  const activeCategory = selected ? getCategoryBySlug(selected) : null;

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Topics"
        title="Browse by category"
        description="Every shelf in the journal — journal notes, travel, books, photography, and curiosity."
      />

      <Section>
        <Container size="lg">
          <div className={styles.grid}>
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                name={cat.name}
                count={cat.count}
                image={cat.image}
                href={`${ROUTES.CATEGORIES}?category=${cat.slug}`}
              />
            ))}
          </div>
        </Container>
      </Section>

      {selected && (
        <Section tone="surface">
          <Container size="lg">
            <div className={styles.filterHead}>
              <SectionTitle>
                {activeCategory?.name || "Category"}
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
                description="Check back soon — new pages are always being written."
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

      {!selected && (
        <Section>
          <Container size="md">
            <p className={styles.hint}>
              {BLOGS.length} stories across {categories.length} categories — pick a
              shelf above to begin.
            </p>
          </Container>
        </Section>
      )}
    </div>
  );
}

export default Categories;
