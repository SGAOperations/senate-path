/** @type {import('next').NextConfig} */
const { version } = require('./package.json');

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  env: {
    version: version,
  },
}

module.exports = nextConfig
