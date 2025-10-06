import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      cesium: path.resolve(__dirname, "node_modules/cesium"),
    };

    config.module.rules.push({
      test: /\.js$/,
      enforce: "pre",
      include: path.resolve(__dirname, "node_modules/cesium"),
      use: ["source-map-loader"],
    });

    return config;
  },
  images: {
    unoptimized: true,
  },


};

export default nextConfig;
