/** @type {import('next').NextConfig} */
const nextConfig = {}

// module.exports = nextConfig


// const nextConfig = {
//     reactStrictMode: true,
//   };
  
  module.exports = {
    ...nextConfig,
    images: {
      domains: ['jivemdoma.intrumnet.com','volgograd.vladis.ru',"",'localhost:3000'],
      // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    },
    env: {
      URL: process.env.HOST,
    }
  };
  
