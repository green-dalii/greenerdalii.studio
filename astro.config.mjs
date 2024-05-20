import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import icon from 'astro-icon';
import remarkGfm from 'remark-gfm';
import { remarkMarkdownRender } from '@astrojs/markdown-remark';

// import cloudflare from "@astrojs/cloudflare";


// https://astro.build/config
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://greenerdalii.top/",
  integrations: [tailwind(), icon(), mdx()],
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
    remarkPlugins: [remarkGfm],
    remarkRenders: [remarkMarkdownRender]
  }
  // output: "server",
  // adapter: cloudflare()
});