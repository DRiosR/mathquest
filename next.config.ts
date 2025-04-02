import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignora los errores de ESLint durante el build
  },
};

export default nextConfig;
