/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/mint',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
