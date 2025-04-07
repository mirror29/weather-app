import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["openweathermap.org"], // 添加这一行
  },
};

export default nextConfig;
