import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  PageHeader,
  Section,
  Container,
  BlogCard,
  SearchBar,
  FilterChip,
  Pagination,
  EmptyState,
} from "../../components";
import {
  BLOGS,
  CATEGORIES,
  getPopularBlogs,
  toBlogCard,
  formatBlogDate,
} from "../../data";
import { ROUTES } from "../../constants";
import styles from "./Blogs.module.css";

const PAGE_SIZE = 6;

function Blogs() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const category = params.get("category") || "all";
  const sort = params.get("sort") || "newest";
  const page = Number(params.get("page") || 1);

  function updateParam(key, value) {
    const next = new URLSearchParams(params);
    if (!value || value === "all" || (key === "page" && value === 1)) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    if (key !== "page") next.delete("page");
    setParams(next);
  }

  const filtered = useMemo(() => {
    let list = [...BLOGS];

    if (category !== "all") {
      list = list.filter((b) => b.category === category);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          b.tags.some((t) => t.includes(q))
      );
    }

    list.sort((a, b) => {
      if (sort === "oldest") {
        return new Date(a.publishedAt) - new Date(b.publishedAt);
      }
      if (sort === "popular") {
        return Number(b.popular) - Number(a.popular);
      }
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });

    return list;
  }, [category, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered
    .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    .map(toBlogCard);

  const popular = getPopularBlogs(4);

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow="Writing"
        title="Stories from the journal"
        description="Essays, letters, travel notes, and soft observations — meant to be read slowly."
      />

      <Section>
        <Container size="lg">
          <div className={styles.toolbar}>
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={() => updateParam("q", query.trim() || null)}
              placeholder="Search stories…"
            />
            <label className={styles.sort}>
              <span className="visually-hidden">Sort by</span>
              <select
                value={sort}
                onChange={(e) => updateParam("sort", e.target.value)}
                aria-label="Sort stories"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Popular</option>
              </select>
            </label>
          </div>

          <div className={styles.chips} role="list" aria-label="Categories">
            <FilterChip
              label="All"
              active={category === "all"}
              onClick={() => updateParam("category", "all")}
            />
            {CATEGORIES.map((cat) => (
              <FilterChip
                key={cat.id}
                label={cat.name}
                active={category === cat.slug}
                onClick={() => updateParam("category", cat.slug)}
              />
            ))}
          </div>

          <div className={styles.layout}>
            <div>
              {pageItems.length === 0 ? (
                <EmptyState
                  title="No stories found"
                  description="Try another search or category — the journal is still growing."
                  actionLabel="Clear filters"
                  onAction={() => {
                    setQuery("");
                    setParams({});
                  }}
                />
              ) : (
                <div className={styles.grid}>
                  {pageItems.map((post) => (
                    <BlogCard key={post.id} {...post} />
                  ))}
                </div>
              )}
              <Pagination
                current={currentPage}
                total={totalPages}
                onChange={(p) => updateParam("page", p)}
              />
            </div>

            <aside className={styles.sidebar} aria-label="Popular stories">
              <h2 className={styles.sidebarTitle}>Popular</h2>
              <ul className={styles.popularList}>
                {popular.map((post) => (
                  <li key={post.id}>
                    <Link
                      to={`${ROUTES.BLOGS}/${post.slug}`}
                      className={styles.popularLink}
                    >
                      <span className={styles.popularTitle}>{post.title}</span>
                      <span className={styles.popularMeta}>
                        {formatBlogDate(post.publishedAt)} · {post.readingTime} min
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </Container>
      </Section>
    </div>
  );
}

export default Blogs;
