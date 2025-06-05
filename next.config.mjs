/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    webpack: (config) => {
        config.resolve.alias['@node-rs/argon2/browser'] = false;
        return config;
    }
};

export default nextConfig;
