import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import icon from 'astro-icon';
import remarkGfm from 'remark-gfm';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';

// import cloudflare from "@astrojs/cloudflare";


// https://astro.build/config
import mdx from "@astrojs/mdx";

import playformCompress from "@playform/compress";

// https://astro.build/config
export default defineConfig({
  site: "https://greenerdalii.top/",
  integrations: [tailwind(), icon(), mdx(), playformCompress()],
  vite: {
    ssr: {
      external: ["svgo"]
    }
  },
  i18n: {
    defaultLocale: "zh",
    locales: ["zh", "en"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  markdown: {
    remarkPlugins: [remarkGfm, rehypeHeadingIds],
  }
  // output: "server",
  // adapter: cloudflare()
});