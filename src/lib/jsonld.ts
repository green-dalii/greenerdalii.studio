// Centralized JSON-LD builders. Each function returns a schema.org graph
// fragment as a string ready to be embedded inside <script type="application/ld+json">.
// All builders use the canonical site origin so relative URLs resolve correctly.

import type { ImageMetadata } from "astro";
import { SITE_URL } from "./site-config";

export interface JsonLdObject {
  [key: string]: unknown;
}

const SITE = SITE_URL;

export function organizationLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE}/#organization`,
    name: "Greener-Dalii Studio",
    alternateName: "格润达理工作室",
    url: SITE,
    logo: `${SITE}/logomark.svg`,
    description:
      "Multidisciplinary branding studio in Xi'an, China. Brand strategy, visual identity, packaging, web and IP design. Subscription-based and project-based engagements.",
    foundingDate: "2022",
    address: {
      "@type": "PostalAddress",
      addressCountry: "CN",
      addressRegion: "陕西省",
      addressLocality: "西安市",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "hi@greenerdalii.top",
        contactType: "customer support",
        availableLanguage: ["zh-Hans", "en"],
      },
    ],
    sameAs: [
      "https://www.behance.net/greenerdalii",
      "https://www.instagram.com/greenerdalii/",
      "https://twitter.com/greenerdalii",
      "https://x.com/myGreenerDalii",
      "https://www.zcool.com.cn/u/25439603",
      "https://okjk.co/cBOIlq",
      "https://github.com/green-dalii/greenerdalii.studio",
    ],
  };
}

export function websiteLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: SITE,
    name: "Greener-Dalii Studio",
    inLanguage: ["zh-CN", "en"],
    publisher: { "@id": `${SITE}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE}/insight?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function professionalServiceLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE}/service#service`,
    name: "Greener-Dalii Studio · Design Services",
    url: `${SITE}/service`,
    image: `${SITE}/social.svg`,
    description:
      "Brand strategy, visual identity, packaging, web and IP design. Subscription-based design with unlimited requests and pause-anytime.",
    priceRange: "¥¥",
    provider: { "@id": `${SITE}/#organization` },
    areaServed: [
      { "@type": "Country", name: "China" },
      { "@type": "AdministrativeArea", name: "Shaanxi" },
      { "@type": "City", name: "Xi'an" },
    ],
    serviceType: [
      "Brand Strategy",
      "Visual Identity Design",
      "Graphic Design",
      "Packaging Design",
      "Web Design",
      "IP Design",
    ],
  };
}

export interface ServiceItem {
  code: string;
  nameZh: string;
  nameEn: string;
  category: string;
  description?: string;
}

export function serviceListLd(services: ServiceItem[]): JsonLdObject[] {
  return services.map((s) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE}/service#${s.code}`,
    name: s.nameEn,
    alternateName: s.nameZh,
    category: s.category,
    serviceType: s.nameEn,
    provider: { "@id": `${SITE}/#organization` },
    areaServed: { "@type": "Country", name: "China" },
    description: s.description,
    url: `${SITE}/service#${s.code}`,
  }));
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbLd(items: BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export interface CreativeWorkInput {
  slug: string;
  titleZh: string;
  titleEn: string;
  description: string;
  client?: string;
  industry?: string;
  pubDate: string; // ISO
  imageUrl?: string;
}

export function creativeWorkLd(work: CreativeWorkInput): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    "@id": `${SITE}/work/${work.slug}#work`,
    name: work.titleZh,
    alternateName: work.titleEn,
    description: work.description,
    dateCreated: work.pubDate,
    creator: { "@id": `${SITE}/#organization` },
    publisher: { "@id": `${SITE}/#organization` },
    about: work.industry,
    image: work.imageUrl,
    url: `${SITE}/work/${work.slug}`,
    inLanguage: ["zh-CN", "en"],
  };
}

export interface ArticleInput {
  slug: string;
  title: string;
  description: string;
  author: string;
  occupation: string;
  pubDate: string; // ISO
  imageUrl?: string;
  tags?: string[];
}

export function articleLd(article: ArticleInput): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE}/insight/${article.slug}#article`,
    headline: article.title,
    description: article.description,
    datePublished: article.pubDate,
    author: {
      "@type": "Person",
      name: article.author,
      jobTitle: article.occupation,
      worksFor: { "@id": `${SITE}/#organization` },
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "Greener-Dalii Studio",
      logo: { "@type": "ImageObject", url: `${SITE}/logomark.svg` },
    },
    mainEntityOfPage: `${SITE}/insight/${article.slug}`,
    image: article.imageUrl,
    keywords: (article.tags ?? []).join(", "),
    inLanguage: ["zh-CN", "en"],
  };
}

export interface FaqPair {
  question: string;
  answer: string;
}

export function faqPageLd(faqs: FaqPair[], url: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    url,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export interface PersonInput {
  name: string;
  jobTitleZh: string;
  jobTitleEn: string;
  imageUrl?: string;
}

export function personLd(p: PersonInput): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    jobTitle: p.jobTitleEn,
    alternateName: p.jobTitleZh,
    image: p.imageUrl,
    worksFor: { "@id": `${SITE}/#organization` },
  };
}

/** Render a JSON-LD graph (one or many entities) into a single inline <script>. */
export function jsonLdScript(items: JsonLdObject | JsonLdObject[]): string {
  const graph = Array.isArray(items)
    ? { "@context": "https://schema.org", "@graph": items }
    : items;
  return JSON.stringify(graph)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
