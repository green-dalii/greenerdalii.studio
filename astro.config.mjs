// Tailwind v3 is loaded via postcss.config.cjs (the @astrojs/tailwind
// integration is unmaintained and incompatible with Astro v6+/v7).
import { defineConfig } from "astro/config";
import icon from 'astro-icon';
// import cloudflare from "@astrojs/cloudflare";
// https://astro.build/config
import mdx from "@astrojs/mdx";
import compressor from "astro-compressor";

// https://astro.build/config
export default defineConfig({
  site: "https://greenerdalii.top/",
  integrations: [
    icon({
      iconify: {
        collections: {
          ic: () => import('@iconify-json/ic/icons.json').then((m) => m.default),
          mdi: () => import('@iconify-json/mdi/icons.json').then((m) => m.default),
          ri: () => import('@iconify-json/ri/icons.json').then((m) => m.default),
        },
      },
    }),
    mdx(),
    compressor(),
  ],
  vite: {
    build: {
      // 启用CSS代码分割
      cssCodeSplit: true,
      // 减小chunk大小
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // 优化输出的chunk。Vite 8 / Rollup 4 要求 manualChunks 为函数，
          // 不再支持对象字面量；用函数形式将 @fontsource/inter 抽出到 vendor chunk。
          manualChunks(id) {
            if (id.includes("node_modules/@fontsource/inter/")) {
              return "vendor";
            }
          },
        },
      },
    },
    // 优化CSS处理
    css: {
      // 启用CSS代码压缩
      minify: true,
      // 启用CSS模块
      modules: {
        // 生成更短的类名
        generateScopedName: "[hash:base64:5]",
      },
    },
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
  // output: "server",
  // adapter: cloudflare()
});