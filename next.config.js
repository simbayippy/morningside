/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "czrsqvfoxplmypvmfykr.supabase.co",
        pathname: "/storage/v1/object/public/events/event-images/**",
      },
      {
        protocol: "https",
        hostname: "czrsqvfoxplmypvmfykr.supabase.co",
        pathname: "/storage/v1/object/public/events/membership-images/**",
      },
      {
        protocol: "https",
        hostname: "czrsqvfoxplmypvmfykr.supabase.co",
        pathname: "/storage/v1/object/public/events/news-images/**",
      },
    ],
  },
};

export default config;
