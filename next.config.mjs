/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/wasi-platform-next",
  images: {
    unoptimized: true,
  },
  // Disable server features for static export
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
