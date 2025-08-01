import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import icon from 'astro-icon';
import remarkGfm from 'remark-gfm';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
// import cloudflare from "@astrojs/cloudflare";
// https://astro.build/config
import mdx from "@astrojs/mdx";
import compressor from "astro-compressor";

// https://astro.build/config
export default defineConfig({
  site: "https://greenerdalii.top/",
  integrations: [
    tailwind(),
    icon(),
    mdx(),
    compressor()
  ],
  vite: {
    build: {
      // 启用CSS代码分割
      cssCodeSplit: true,
      // 减小chunk大小
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // 优化输出的chunk
          manualChunks: {
            // 将大型依赖项分离为单独的chunk
            vendor: [
              "@fontsource/inter",
            ],
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
  markdown: {
    remarkPlugins: [remarkGfm, rehypeHeadingIds],
  }
  // output: "server",
  // adapter: cloudflare()
});