import { useEffect } from "react";

/**
 * Inject JSON-LD into document head. Removes previous node with same id on update.
 */
export function useJsonLd(id, data) {
  useEffect(() => {
    if (!id || !data) return undefined;

    const scriptId = `jsonld-${id}`;
    let el = document.getElementById(scriptId);
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = scriptId;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);

    return () => {
      const node = document.getElementById(scriptId);
      if (node) node.remove();
    };
  }, [id, data]);
}

export function websiteJsonLd({ name, url, description, searchUrl }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
  };
  if (searchUrl) {
    data.potentialAction = {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: searchUrl,
      },
      "query-input": "required name=search_term_string",
    };
  }
  return data;
}

export function personJsonLd({ name, url, description, image }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url,
  };
  if (description) data.description = description;
  if (image) data.image = image;
  return data;
}

export function blogPostingJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName,
  authorUrl,
  publisherName,
  publisherLogo,
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
  };
  if (description) data.description = description;
  if (image) data.image = [image];
  if (datePublished) data.datePublished = datePublished;
  if (dateModified || datePublished) data.dateModified = dateModified || datePublished;
  if (authorName) {
    data.author = {
      "@type": "Person",
      name: authorName,
      ...(authorUrl ? { url: authorUrl } : {}),
    };
  }
  if (publisherName) {
    data.publisher = {
      "@type": "Organization",
      name: publisherName,
      ...(publisherLogo
        ? { logo: { "@type": "ImageObject", url: publisherLogo } }
        : {}),
    };
  }
  return data;
}

export function breadcrumbJsonLd(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

export function collectionPageJsonLd({ name, description, url }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url,
  };
  if (description) data.description = description;
  return data;
}

export default useJsonLd;
