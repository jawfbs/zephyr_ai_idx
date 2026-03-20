/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    SPARK_API_KEY: process.env.SPARK_API_KEY,
    SPARK_API_SECRET: process.env.SPARK_API_SECRET,
    SPARK_API_ENDPOINT: process.env.SPARK_API_ENDPOINT,
  },
}

module.exports = nextConfig
