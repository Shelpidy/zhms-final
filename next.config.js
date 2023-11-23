/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["https://picsum.photos","https://firebasestorage.googleapis.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },

    ],
    
  }
};

module.exports = nextConfig;
