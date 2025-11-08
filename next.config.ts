import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // ...
  },
  images: {
    remotePatterns: [
        {
        protocol: 'https',
        // PHẢI CÓ *. để chấp nhận các subdomain ngẫu nhiên (ví dụ: ifmh1596xx)
        hostname: '*.ufs.sh', 
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        // Đây cũng là một miền UploadThing thường dùng, nên thêm vào
        hostname: 'uploadthing-content.io', 
        port: '',
        pathname: '/**',
      },
      // ... thêm các remotePatterns khác nếu cần
    ]
  }
};

export default nextConfig;
