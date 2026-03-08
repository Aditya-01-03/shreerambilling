/** @type {import('next').NextConfig} */
const nextConfig = {
    outputFileTracingIncludes: {
        '/api/**/*': ['./*.db', './prisma/*.db'],
    },
};

export default nextConfig;
