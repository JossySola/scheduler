/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    transpilePackages: ["geist"],
    runtime: 'nodejs'
};

export default nextConfig;
