/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  trailingSlash: false,
  // Timeout de geração de páginas estáticas (em segundos)
  staticPageGenerationTimeout: 1000,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        
      },
      {
        protocol: "https",
        hostname: "viagenseoutrashistorias.com.br",
      },
      {
        protocol: "https",
        hostname: "www.viagenscinematograficas.com.br",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "img.clerk.com"
      },
      {
        protocol: "https",
        hostname: "images.sympla.com.br"
      },
      {
        protocol: "https",
        hostname: "gregarious-civet-174.convex.cloud",
        pathname: "/api/storage/**"
      },
      {
        protocol: "https",
        hostname: "placehold.co"
      }

    ]
  }
};

export default nextConfig;
