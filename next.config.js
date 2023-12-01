/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  async redirects() {
    return [
      {
        source: '/sunum',
        destination: 'https://docs.google.com/presentation/d/1d0OuFMDVLGNuIk-j_7KbjkL30AnrN8dmfL8AjjPhgBw/edit?usp=sharing',
        permanent: true,
      },
    ]
  },
};

export default config;
