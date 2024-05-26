/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    experimental: {
        optimizePackageImports: ['@tabler/icons-react'],
    },
    productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
