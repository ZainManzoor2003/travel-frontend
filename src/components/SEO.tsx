type SEOProps = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string; // website, article, etc.
  siteName?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  canonical?: string;
  locale?: string; // e.g., en_US
  noindex?: boolean;
  jsonLd?: Record<string, any> | Record<string, any>[];
};

const defaultMeta = {
  title: 'Travel Beyond Tours – Discover Your Next Adventure',
  description: 'Explore breathtaking destinations and curated tours. Book unforgettable travel experiences with Travel Beyond Tours.',
  image: '/Logo.webp',
  type: 'website',
  siteName: 'Travel Beyond Tours',
  twitterCard: 'summary_large_image' as const,
};

export default function SEO(props: SEOProps) {
  const meta = { ...defaultMeta, ...props };
  return (
    <>
      {meta.title && <title>{meta.title}</title>}
      {meta.description && <meta name="description" content={meta.description} />}
      {meta.noindex && <meta name="robots" content="noindex,nofollow" />}
      {meta.canonical && <link rel="canonical" href={meta.canonical} />}

      {/* Open Graph */}
      <meta property="og:type" content={meta.type!} />
      {meta.title && <meta property="og:title" content={meta.title} />}
      {meta.description && <meta property="og:description" content={meta.description} />}
      {meta.url && <meta property="og:url" content={meta.url} />}
      {meta.siteName && <meta property="og:site_name" content={meta.siteName} />} 
      {meta.image && <meta property="og:image" content={meta.image} />}
      {meta.locale && <meta property="og:locale" content={meta.locale} />}

      {/* Twitter */}
      <meta name="twitter:card" content={meta.twitterCard!} />
      {meta.title && <meta name="twitter:title" content={meta.title} />}
      {meta.description && <meta name="twitter:description" content={meta.description} />}
      {meta.image && <meta name="twitter:image" content={meta.image} />}

      {/* JSON-LD Structured Data */}
      {meta.jsonLd && (
        Array.isArray(meta.jsonLd) ? (
          meta.jsonLd.map((node, i) => (
            <script key={i} type="application/ld+json">{JSON.stringify(node)}</script>
          ))
        ) : (
          <script type="application/ld+json">{JSON.stringify(meta.jsonLd)}</script>
        )
      )}
    </>
  );
}


