import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@prisma/client"],
  turbopack: {
     resolveAlias: {
      "@/*": "./src/*"
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io', // <--- THÊM DÒNG NÀY (Domain phổ biến nhất của UploadThing)
        port: '',
        pathname: '/**', // Cho phép tất cả các đường dẫn
      },
      {
        protocol: 'https',
        hostname: '*.ufs.sh', // Domain mới (App specific regions)
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'uploadthing-content.io', // Domain cũ
        port: '',
        pathname: '/**',
      },
    ]
  }
};

export default nextConfig;
