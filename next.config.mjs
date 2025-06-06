/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    serverExternalPackages: ['argon2'],
    webpack: (config, { isServer, dev }) => {
        if (isServer) {
            // Mark argon2 as external for server builds
            config.externals = config.externals || [];
            config.externals.push({
                'argon2': 'commonjs argon2'
            });
        } else {
            // Prevent client-side bundling
            config.resolve.fallback = {
                ...config.resolve.fallback,
                'argon2': false,
            };
        }
        return config;
    },
};

export default nextConfig;
