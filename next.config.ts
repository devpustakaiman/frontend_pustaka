import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  /**
   * Declarative 308 permanent redirects for legacy Google Sitelinks.
   *
   * Rules:
   * - `permanent: true`  → HTTP 308 (Next.js standard; SEO-equivalent to 301,
   *   preserves request method, and is cached by search engines indefinitely).
   * - Sources use exact-path regex anchors — no greedy wildcards — to guarantee
   *   zero collision with live routes (/katalog/[slug], /buku/*, /warta/*, etc.).
   * - `trailingSlash: true` is active, so Next.js normalises incoming URLs to
   *   the trailing-slash form BEFORE redirect matching; sources are written with
   *   trailing slash accordingly.
   * - Each legacy route gets one canonical rule. No duplicate trailing-slash
   *   variants are needed because the built-in trailingSlash normaliser handles
   *   the no-slash → slash rewrite transparently before these rules run.
   */
  async redirects() {
    return [
      // ── /shop → /katalog ──────────────────────────────────────────────────
      // The existing app/shop/page.tsx provides a JS fallback for client-side
      // navigation. This rule ensures Googlebot and curl receive a proper HTTP
      // 308 before any JS hydration occurs.
      {
        source: "/shop/",
        destination: "/katalog/",
        permanent: true,
      },

      // ── /penerbit-katalog-buku → /katalog ─────────────────────────────────
      // Legacy "Penerbit & Katalog Buku" sitelink.
      {
        source: "/penerbit-katalog-buku/",
        destination: "/katalog/",
        permanent: true,
      },

      // ── /buku-pustaka-iiman → /katalog ────────────────────────────────────
      // Legacy brand-specific deep link.
      {
        source: "/buku-pustaka-iiman/",
        destination: "/katalog/",
        permanent: true,
      },

      // ── /buku-baru → /katalog?filter=buku-baru ────────────────────────────
      // Routes users to the catalog with the "Buku Baru" filter pre-activated.
      // CatalogClient already reads this query param natively — no code change
      // required on that component.
      {
        source: "/buku-baru/",
        destination: "/katalog/?filter=buku-baru",
        permanent: true,
      },

      // ── /best-seller → /katalog ───────────────────────────────────────────
      // Feature not yet built. Graceful fallback keeps search traffic from
      // hitting a 404 while a dedicated page is developed.
      {
        source: "/best-seller/",
        destination: "/katalog/",
        permanent: true,
      },

      // ── /tentang → /tentang-kami ──────────────────────────────────────────
      // Supplements the existing app/tentang/page.tsx JS redirect with an HTTP-
      // level permanent redirect so crawlers consolidate PageRank correctly.
      {
        source: "/tentang/",
        destination: "/tentang-kami/",
        permanent: true,
      },

      // ── WooCommerce /product-category/* taxonomy routes ───────────────────
      // Legacy WordPress/WooCommerce category URLs indexed in Google SERP.
      // ORDERING RULE: specific slugs MUST precede the wildcard catch-all
      // (:slug*) — Next.js evaluates top-to-bottom and stops at first match.

      // /product-category/buku-baru/ → /katalog/?filter=buku-baru
      // Preserves the filter-activated catalog landing for fresh-release traffic.
      {
        source: "/product-category/buku-baru/",
        destination: "/katalog/?filter=buku-baru",
        permanent: true,
      },

      // /product-category/best-seller/ → /katalog/
      // Unbuilt feature; graceful fallback prevents 404.
      {
        source: "/product-category/best-seller/",
        destination: "/katalog/",
        permanent: true,
      },

      // /product-category/:slug*/ → /katalog/
      // Generic catch-all for any other legacy WooCommerce category slug.
      // Placed AFTER the specific rules above so they are never shadowed.
      {
        source: "/product-category/:slug*/",
        destination: "/katalog/",
        permanent: true,
      },

      // ── WooCommerce /product-tag/* taxonomy routes ────────────────────────

      // /product-tag/buku-pustaka-iiman/ → /katalog/
      // Named explicitly for clarity, though the wildcard below also covers it.
      {
        source: "/product-tag/buku-pustaka-iiman/",
        destination: "/katalog/",
        permanent: true,
      },

      // /product-tag/:slug*/ → /katalog/
      // Generic catch-all for any other legacy WooCommerce product-tag slug.
      {
        source: "/product-tag/:slug*/",
        destination: "/katalog/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

