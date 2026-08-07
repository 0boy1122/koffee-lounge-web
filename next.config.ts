import type { NextConfig } from "next";
import { BASE_PATH } from "./src/lib/base-path";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: BASE_PATH,
  assetPrefix: `${BASE_PATH}/`,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
