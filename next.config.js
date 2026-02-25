/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Dùng basePath nếu deploy vào subfolder
  // basePath: '/wedding',
};

module.exports = nextConfig;
