import withPWAInit from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GOOGLE_TRANSLATION_CONFIG: JSON.stringify({
      languages: [
        { title: "Français", name: "fr" },
        { title: "English", name: "en" },
        { title: "Swahili", name: "sw" },
        { title: "Lingala", name: "ln" },
      ],
      defaultLanguage: "fr",
    }),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ecom-test.kivugreen.cd",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "ecomv2.kivugreen.cd",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "kivugreen.cd",
        port: "",
        pathname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/sw1.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
};

const withPwa = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
    maximumFileSizeToCacheInBytes: 25 * 1024 * 1024, // 25 MB
  },
});

export default withPwa(nextConfig);
