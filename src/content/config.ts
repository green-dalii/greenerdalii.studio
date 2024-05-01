// 从 `astro:content` 导入辅助工具
// import { string } from "astro/zod";
import { z, defineCollection } from "astro:content";
import { getCollection } from "astro:content";

// 为每一个集合定义一个 `type` 和 `schema`
const insightCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    author: z.string(),
    occupation: z.string(),
    heroImage: z.string(),
    heroImageAlt: z.string(),
    tags: z.array(z.string())
  // schema: ({ image }) => z.object({
  //   title: z.string(),
  //   pubDate: z.date(),
  //   description: z.string(),
  //   author: z.string(),
  //   occupation: z.string(),
  //   image: image().refine((img) => img.width >= 1080, {
  //     message: "封面图片必须至少 1080 像素宽！",
  //   }),
  //   imageAlt: z.string(),
  //   tags: z.array(z.string()),
  // }),
  })
});

// 导出一个单独的 `collections` 对象来注册你的集合
export const collections = {
  insight: insightCollection,
};

// 获取所有Blog
// export const allPosts = await getCollection("insight");
// 获取Blog所有图片
export const blogImages = import.meta.glob("/src/data/insight/*/*.jpg", { eager: true });