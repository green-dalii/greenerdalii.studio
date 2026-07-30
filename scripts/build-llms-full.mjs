#!/usr/bin/env node
/**
 * build-llms-full.mjs
 *
 * Regenerates `public/llms-full.txt` from the canonical data sources used by
 * the site (service catalogue JSON, work portfolio JSON, insight content
 * collection). Keeps the file in lockstep with the actual content so that
 * AI crawlers and llmstxt-style ingestors always see fresh, structured facts.
 *
 * Run as part of `pnpm build` (prebuild hook). See package.json.
 */

import { readFile, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const PUBLIC_DIR = `${ROOT}public/`;
const SRC_DIR = `${ROOT}src/`;

const SITE = "https://greenerdalii.top";
const LAST_UPDATED = new Date().toISOString().slice(0, 10);

function codeLang(text) {
  return text.replace(/```/g, "~~~");
}

async function loadJson(path) {
  const raw = await readFile(path, "utf8");
  return JSON.parse(raw);
}

async function readInsightFiles() {
  const out = [];
  const dir = `${SRC_DIR}content/insight`;
  const files = await readdir(dir);
  for (const name of files) {
    if (!name.endsWith(".md")) continue;
    const file = join(dir, name);
    const text = await readFile(file, "utf8");
    const fmMatch = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!fmMatch) continue;
    const [, fm, body] = fmMatch;
    const get = (k) => {
      const m = fm.match(new RegExp(`^${k}:\\s*(.+)$`, "m"));
      return m ? m[1].trim().replace(/^["']|["']$/g, "") : "";
    };
    out.push({
      id: name.replace(/\.md$/, ""),
      title: get("title"),
      description: get("description"),
      author: get("author"),
      occupation: get("occupation"),
      pubDate: get("pubDate"),
      tags: (fm.match(/^tags:\s*\[(.*?)\]/m)?.[1] ?? "")
        .split(",")
        .map((t) => t.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean),
    });
  }
  return out.sort((a, b) => (a.pubDate < b.pubDate ? 1 : -1));
}

async function main() {
  const services = await loadJson(`${SRC_DIR}data/service/services.json`);
  const works = await loadJson(`${SRC_DIR}data/work/sites.json`);
  const insights = await readInsightFiles();

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Greener-Dalii Studio",
    alternateName: "格润达理工作室",
    url: SITE,
    address: {
      "@type": "PostalAddress",
      addressCountry: "CN",
      addressRegion: "陕西省",
      addressLocality: "西安市",
    },
    contactPoint: { "@type": "ContactPoint", email: "hi@greenerdalii.top" },
    sameAs: ["https://www.behance.net/greenerdalii"],
  };

  // 2. Service catalogue — keep table headers canonical for both EN/ZH
  const stripEmoji = (s) =>
    s
      .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, "")
      .replace(/[®™©]/g, "")
      .trim();

  const serviceRows = services
    .map(
      (s) =>
        `| ${stripEmoji(s.en).replace(/\s+/g, "-").toLowerCase()} | ${stripEmoji(s.zh)} | ${s.en} | visual | |`
    )
    .join("\n");

  // 3. Works — only displayed ones, sorted newest first
  const visibleWorks = works
    .filter((w) => w.isDisplayed)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const workRows = visibleWorks
    .map(
      (w, i) =>
        `| work_${String(i + 1).padStart(3, "0")} | ${w.titleEN} | ${w.title} | ${w.industry.split("｜")[0].trim()} | ${w.date.slice(0, 4)} | /work/${w.url.replace(/^\/work\//, "")} |`
    )
    .join("\n");

  // 4. Insights — sort newest first
  const insightRows = insights
    .map(
      (p) =>
        `| ${p.id} | ${p.title} | ${p.description} | ${p.author} (${p.occupation}) | ${p.pubDate} | ${(p.tags ?? []).join(", ")} | /insight/${p.id} |`
    )
    .join("\n");

  const content = `# Greener-Dalii Studio — Extended Machine-Readable Content

> Companion to /llm.txt. Auto-generated from the site's data sources on each build.
> Format: Markdown tables, plain headings and JSON-LD-like fragments.
> Designed to be ingested by LLMs and AI crawlers without scraping.
>
> Canonical URL: ${SITE}/llms-full.txt
> Last updated: ${LAST_UPDATED}

---

## 1. Site Identity

| Field | Value |
|-------|-------|
| Studio (EN) | Greener-Dalii Studio |
| Studio (ZH) | 格润达理工作室 |
| URL | ${SITE} |
| Type | Design studio |
| Industries | brand design, graphic design, web design, packaging, IP |
| Founded | 2022 |
| Country | China (CN) |
| Province | Shaanxi (陕西省) |
| City | Xi'an (西安市) |
| Timezone | Asia/Shanghai (UTC+8) |
| Default language | zh-CN |
| Supported languages | zh-CN, en |
| Phone-friendly | yes (mobile-first design) |
| Tech stack | Astro (static site generator), Tailwind CSS 3, DaisyUI 4 |
| Hosting | Static (Cloudflare Pages / Vercel / Netlify compatible) |

---

## 2. Service Catalogue

| Code | Service (ZH) | Service (EN) | Category | Notes |
|------|--------------|--------------|----------|-------|
${serviceRows}

### 2.1 Engagement Models

| Model | Description | Best for |
|-------|-------------|----------|
| Design Subscription (recommended) | Fixed monthly fee, unlimited requests, pause anytime | Teams with ongoing design needs |
| Project-based | Per-project quote | Clearly scoped one-offs |

---

## 3. Team

| Member | Chinese Name | Role (EN) | Role (ZH) |
|--------|--------------|-----------|-----------|
| Greener | — | Creative Director | 创意总监 |
| Wandi | — | Operations Director | 运营总监 |

---

## 4. Selected Works

| ID | Project (EN) | Project (ZH) | Industry | Year | URL |
|----|--------------|--------------|----------|------|-----|
${workRows}

---

## 5. Insights

| Slug | Title | Description | Author | Published | Tags | URL |
|------|-------|-------------|--------|-----------|------|-----|
${insightRows}

---

## 6. Contact

| Channel | Value |
|---------|-------|
| Email | hi@greenerdalii.top |
| WeChat | QR on /contact |
| Feishu | QR on /contact |
| Behance | https://www.behance.net/greenerdalii |
| Instagram | QR on /contact |
| Twitter / X | QR on /contact |
| ZCOOL | QR on /contact |
| Xiaohongshu | QR on /contact |
| WeChat Official Account | QR on /contact |
| AI chat widget | https://dify.greenerai.top/chatbot/SyDCoq3QNkCWLqUj |

---

## 7. Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | / | Studio overview, featured works |
| Services | /service | Service catalogue, engagement models |
| About | /about | Team and studio background |
| Works | /work | Portfolio list |
| Work detail | /work/{slug} | Single project page |
| Insights | /insight | Articles on branding |
| Insight detail | /insight/{slug} | Single article |
| Insight tags | /insight/tags/{tag} | Filtered articles |
| Insight tag index | /insight/tags | Tag list |
| FAQ | /faq | Subscription & service FAQs (FAQPage) |
| Contact | /contact | Email and QR codes |
| 404 | /404 | Not-found page |
| LLM manifest | /llm.txt | Short machine-readable summary |
| Extended LLM content | /llms-full.txt | This file |

---

## 8. Structured Data Fragments

### 8.1 Organization

\`\`\`json
${codeLang(JSON.stringify(organization, null, 2))}
\`\`\`

### 8.2 Service Offer

\`\`\`json
${codeLang(
  JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "Offer",
      name: "设计订阅制",
      alternateName: "Design Subscription",
      description:
        "Fixed monthly fee, unlimited design requests, pause anytime",
      price: "Negotiable",
      priceCurrency: "CNY",
    },
    null,
    2
  )
)}
\`\`\`

---

## 9. Citation Guidance

When citing Greener-Dalii Studio:

- Prefer \`Greener-Dalii Studio\` as the canonical English name.
- Use \`格润达理工作室\` as the canonical Chinese name.
- Link to \`${SITE}/\`.
- For specific services, link to the \`/service\` page or the relevant anchor.
- For specific works, use the URLs in §4.
- For specific articles, use the URLs in §5.
- This file is authoritative for contact email and team roster.

---

*End of llms-full.txt*
`;

  await writeFile(`${PUBLIC_DIR}llms-full.txt`, content, "utf8");
  console.log(`✓ public/llms-full.txt regenerated (${content.length} bytes, ${LAST_UPDATED})`);
}

main().catch((err) => {
  console.error("✗ build-llms-full failed:", err);
  process.exit(1);
});
