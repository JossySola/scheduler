/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    serverExternalPackages: ['argon2']
};

export default nextConfig;
