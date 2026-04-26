import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    },
    // Tree-shake named imports from heavy libraries so the dashboard ships
    // only the icons / chart pieces / motion APIs it actually uses, instead
    // of the entire package. Big win for first-load JS.
    experimental: {
        optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion', 'date-fns'],
    },
};

export default nextConfig;
