import type { MetadataRoute } from "next";
import { buildRobotsManifest } from "@/lib/seo/sitemap-robots";

export default function robots(): MetadataRoute.Robots {
  return buildRobotsManifest();
}
