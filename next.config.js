/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: [
      "t3chat-development.s3.ap-northeast-1.amazonaws.com",
      "t3chat-production.s3.ap-northeast-1.amazonaws.com",
    ],
  },
};

export default config;
