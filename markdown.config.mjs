// Astro v6+ removed the top-level `markdown` config key from astro.config.mjs.
// Move remark/rehype plugins here instead.
// Reference: https://docs.astro.build/en/guides/upgrade-to/v6/#legacy-markdown-config
import remarkGfm from "remark-gfm";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";

export default {
  remarkPlugins: [remarkGfm, rehypeHeadingIds],
};