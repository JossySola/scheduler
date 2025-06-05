/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    webpack: (config) => {
        config.externals.push({
            'node:crypto': 'commonjs crypto',
        })
        return config;
    }
};

export default nextConfig;
