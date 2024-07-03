// adapted from https://github.com/withastro/astro.build/blob/112bdc723b3ba305997c95d7ce02304624d0d3ce/src/data/showcase/index.ts

import type { ShowcaseSite } from "../../types";
import sitesData from "../work/sites.json";

sitesData.sort((a, b) => {
  const [yearA, monthA] = a.date.split('.');
  const [yearB, monthB] = b.date.split('.');

  const dateA = new Date(parseInt(yearA, 10), parseInt(monthA, 10) - 1);
  const dateB = new Date(parseInt(yearB, 10), parseInt(monthB, 10) - 1);
  
  return dateB.getTime() - dateA.getTime(); // 时间戳大的在前，实现降序
});


const allImages = import.meta.glob<ImageMetadata>("../work/images/*.{png,jpg,jpeg}", {
  eager: true,
  import: "default",
});

let _loadShowcase: Promise<Array<ShowcaseSite>>;

async function loadShowcase(): Promise<Array<ShowcaseSite>> {
  const sites = await Promise.all(
    sitesData.map(async (site) => {
      let _url = '../work' + site.image.substring(1)
      if (!(_url in allImages)) {
        console.error(
          `Image for "${site.title}" not found (provided: "${site.image}")`
        );
      }

      const image = await allImages[_url];

      return {
        ...site,
        image,
      };
    })
  );

  return sites;
}

export async function getShowcase() {
  _loadShowcase = _loadShowcase || loadShowcase();
  return _loadShowcase;
}
