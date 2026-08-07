import Image, { type ImageProps } from "next/image";
import { BASE_PATH } from "@/lib/base-path";

/**
 * With `images.unoptimized: true` (required for static export), next/image
 * does not automatically prefix local `src` strings with `basePath` the way
 * next/link does for hrefs. This wrapper applies that prefix so images
 * resolve correctly once deployed under a subpath (GitHub Pages).
 */
export function AppImage({ src, ...props }: ImageProps) {
  const resolvedSrc =
    typeof src === "string" && src.startsWith("/") ? `${BASE_PATH}${src}` : src;
  return <Image src={resolvedSrc} {...props} />;
}
