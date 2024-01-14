const Dotenv = require("dotenv-webpack");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    // The condition is to have the plugin on build time, not to perturb live refresh
    config.plugins.push(new Dotenv());
    return config;
  },
};

module.exports = nextConfig;
