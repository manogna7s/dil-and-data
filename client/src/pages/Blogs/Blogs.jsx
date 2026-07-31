import { useEffect, useState } from "react";
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
  Loader,
} from "../../components";
import { formatBlogDate } from "../../utils/formatDate.js";
import { ROUTES, SITE } from "../../constants";
import { listPublicContent } from "../../services/content.service.js";
import { listPublicCategories } from "../../services/category.service.js";
import { toCardProps } from "../../blocks/fetchLive";
import styles from "./Blogs.module.css";

const PAGE_SIZE = 6;

function Blogs() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const category = params.get("category") || "all";
  const sort = params.get("sort") || "newest";
  const page = Number(params.get("page") || 1);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [categories, setCategories] = useState([]);
  const [popular, setPopular] = useState([]);

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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cats = await listPublicCategories();
        if (!cancelled) setCategories(Array.isArray(cats) ? cats : []);
      } catch {
        if (!cancelled) setCategories([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const selectedCat = categories.find(
          (c) => c.slug === category || String(c._id) === category
        );
        const categoryId = selectedCat?._id || (category !== "all" ? category : "");

        const [list, popularList] = await Promise.all([
          listPublicContent({
            page,
            limit: PAGE_SIZE,
            sort,
            q: params.get("q") || "",
            category: categoryId,
            type: "blog",
          }),
          listPublicContent({ limit: 4, sort: "popular", type: "blog" }),
        ]);
        if (cancelled) return;
        setItems((list?.items || []).map(toCardProps).filter(Boolean));
        setPagination(list?.pagination || { total: 0, page: 1, totalPages: 1 });
        setPopular((popularList?.items || []).map(toCardProps).filter(Boolean));
      } catch {
        if (!cancelled) {
          setItems([]);
          setPopular([]);
          setPagination({ total: 0, page: 1, totalPages: 1 });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [category, sort, page, params, categories]);

  const totalPages = Math.max(1, pagination.totalPages || 1);
  const currentPage = Math.min(page, totalPages);

  return (
    <div className={styles.page}>
      <PageHeader
        eyebrow={SITE.BLOG_NAME}
        title="Stories from the journal"
        description="Essays, letters, and soft observations, published only when they feel ready."
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

          {categories.length > 0 && (
            <div className={styles.chips} role="list" aria-label="Categories">
              <FilterChip
                label="All"
                active={category === "all"}
                onClick={() => updateParam("category", "all")}
              />
              {categories.map((cat) => (
                <FilterChip
                  key={cat._id || cat.slug}
                  label={cat.title || cat.name}
                  active={category === cat.slug || category === String(cat._id)}
                  onClick={() => updateParam("category", cat.slug || cat._id)}
                />
              ))}
            </div>
          )}

          <div className={styles.layout}>
            <div>
              {loading ? (
                <Loader label="Opening the journal…" />
              ) : items.length === 0 ? (
                <EmptyState
                  title="No stories yet"
                  description="When Manogna publishes from Creator Studio, they'll appear here."
                  actionLabel={
                    params.toString() ? "Clear filters" : undefined
                  }
                  onAction={
                    params.toString()
                      ? () => {
                          setQuery("");
                          setParams({});
                        }
                      : undefined
                  }
                />
              ) : (
                <div className={styles.grid}>
                  {items.map((post) => (
                    <BlogCard key={post.id} {...post} />
                  ))}
                </div>
              )}
              {!loading && items.length > 0 && (
                <Pagination
                  current={currentPage}
                  total={totalPages}
                  onChange={(p) => updateParam("page", p)}
                />
              )}
            </div>

            <aside className={styles.sidebar} aria-label="Popular stories">
              <h2 className={styles.sidebarTitle}>Popular</h2>
              {popular.length === 0 ? (
                <p className={styles.popularMeta}>Nothing here yet.</p>
              ) : (
                <ul className={styles.popularList}>
                  {popular.map((post) => (
                    <li key={post.id}>
                      <Link
                        to={`${ROUTES.BLOGS}/${post.slug}`}
                        className={styles.popularLink}
                      >
                        <span className={styles.popularTitle}>{post.title}</span>
                        <span className={styles.popularMeta}>
                          {post.publishedAt
                            ? formatBlogDate(post.publishedAt)
                            : ""}
                          {post.readingTime ? ` · ${post.readingTime} min` : ""}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </aside>
          </div>
        </Container>
      </Section>
    </div>
  );
}

export default Blogs;
