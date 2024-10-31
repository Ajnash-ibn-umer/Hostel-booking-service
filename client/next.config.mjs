/** @type {import("next").NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    // domains: ["localhost","ajn-p1-2024.s3.amazonaws.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "ajn-p1-2024.s3.ap-south-1.amazonaws.com",
        port: "",
      },
    ],
  },
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
    API_ENDPOINT: process.env.API_ENDPOINT,
    S3_BUCKET: process.env.S3_BUCKET,
    REGION: process.env.REGION,
    ACCESS_KEY: process.env.ACCESS_KEY,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
  },
};

export default nextConfig;
