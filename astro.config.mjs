import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import icon from 'astro-icon'

// import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config

// https://astro.build/config
export default defineConfig({
  site: "https://greenerdalii.top/",
  integrations: [tailwind(), icon()],
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
  }
  // output: "server",
  // adapter: cloudflare()
});