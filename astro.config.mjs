import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config

// https://astro.build/config
export default defineConfig({
  site: "https://greenerdalii.top/",
  integrations: [tailwind(),],
  vite: {
    ssr: {
      external: ["svgo"]
    }
  },
  // output: "server",
  // adapter: cloudflare()
});