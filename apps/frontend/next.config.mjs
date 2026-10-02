/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "azzunique-fintech-node.s3.ap-south-1.amazonaws.com",
        pathname: "/ticket-booking/**",
      },
    ],
  },
};

export default nextConfig;