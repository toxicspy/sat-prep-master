import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * SEOHead — sets document <title>, meta description, canonical URL,
 * and injects JSON-LD structured data per page.
 * Drop into any page: <SEOHead title="…" description="…" />
 */
interface SEOHeadProps {
  title: string;
  description: string;
  /** Override canonical path (defaults to current pathname) */
  canonical?: string;
  /** JSON-LD structured data object */
  jsonLd?: Record<string, unknown>;
}

const SITE_URL = "https://satacepro.com";

const SEOHead = ({ title, description, canonical, jsonLd }: SEOHeadProps) => {
  const { pathname } = useLocation();
  const canonicalUrl = `${SITE_URL}${canonical ?? pathname}`;

  useEffect(() => {
    // Title
    document.title = title;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // Canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);

    // OG tags
    const setOg = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };
    setOg("og:title", title);
    setOg("og:description", description);
    setOg("og:url", canonicalUrl);
    setOg("og:type", "website");

    // JSON-LD
    const existingLd = document.querySelector('script[data-seo-ld]');
    if (existingLd) existingLd.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("data-seo-ld", "true");
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const ld = document.querySelector('script[data-seo-ld]');
      if (ld) ld.remove();
    };
  }, [title, description, canonicalUrl, jsonLd]);

  return null;
};

export default SEOHead;
