export interface CompatibilityItem {
  icon: string;
  title: string;
  url: string;
}

export interface FeatureItem {
  description: string;
  icon: string;
  title: string;
}

export interface FooterLink {
  description: string;
  icon: string;
  url: string;
}

export interface NavItem {
  title: string;
  titleZh: string;
  url: string;
}

export interface ShowcaseSite {
  title: string;
  titleEN: string;
  image: ImageMetadata;
  url: string;
  industry: string;
  client: string;
  year: string;
}

export interface WorkImage {
  title: string;
  imagePath: ImageMetadata;
  alt: string;
}

export interface InsightSite {
  title: string;
  describe: string;
  image: string;
  url: string;
}

export interface MemberInfo {
  name: string;
  occupation: string;
  image: ImageMetadata;
}