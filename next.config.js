/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.allrecipes.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'imagesvc.meredithcorp.io',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '**'
      }
    ]
  }
};

module.exports = nextConfig;
