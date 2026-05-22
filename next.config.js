/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@mysten/sui/jsonRpc': false,
      '@mysten/sui': false,
      '@solana/web3.js': false,
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
      'fsevents': false,
    };
    return config;
  }
};

export default nextConfig;
