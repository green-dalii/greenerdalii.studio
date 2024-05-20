// adapted from https://github.com/withastro/astro.build/blob/112bdc723b3ba305997c95d7ce02304624d0d3ce/src/data/showcase/index.ts

import type { MemberInfo } from "~/types";
import memberInfo from "./memberInfo.json";

const allImages = import.meta.glob<ImageMetadata>("./photos/*.{png,jpg,jpeg}", {
  eager: true,
  import: "default",
});

let _loadMember: Promise<Array<MemberInfo>>;

async function loadMember(): Promise<Array<MemberInfo>> {
  const members = await Promise.all(
    memberInfo.map(async (member) => {
      if (!(member.image in allImages)) {
        console.error(
          `Image for "${member.name}" not found (provided: "${member.image}")`
        );
      }

      const image = await allImages[member.image];

      return {
        ...member,
        image,
      };
    })
  );

  return members;
}

export async function getMember() {
  _loadMember = _loadMember || loadMember();
  return _loadMember;
}
