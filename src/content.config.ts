// Astro v6+ moved collection config out of src/content/config.ts into
// src/content.config.ts at the src/ root, and requires an explicit loader.
// Migration reference:
//   https://docs.astro.build/en/guides/upgrade-to/v6/#removed-legacy-content-collections
import { z, defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";

const insightCollection = defineCollection({
  // `glob` loader replaces the legacy `type: 'content'` for filesystem-based
  // markdown collections. The base is the directory holding the markdown files.
  loader: glob({ pattern: "**/*.md", base: "./src/content/insight" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    author: z.string(),
    occupation: z.string(),
    heroImage: z.string(),
    heroImageAlt: z.string(),
    tags: z.array(z.string()),
    relatedPosts: z.array(reference("insight")),
  }),
});

export const collections = {
  insight: insightCollection,
};

// Side-effect export consumed by insight pages; unchanged.
export const blogImages = import.meta.glob("/src/data/insight/*/*.jpg", {
  eager: true,
});