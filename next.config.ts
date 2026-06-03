import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/admin/login",
        permanent: true,
      },
      {
        source: "/register",
        destination: "/admin/register",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/admin/dashboard",
        permanent: true,
      },
      {
        source: "/dashboard/:path*",
        destination: "/admin/dashboard/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
