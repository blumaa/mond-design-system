/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@comp-lib-proto/ui", "@comp-lib-proto/tokens"],
};

module.exports = nextConfig;
