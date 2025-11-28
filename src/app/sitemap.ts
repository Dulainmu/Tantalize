import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://tantalize.lk';

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
            images: [
                'https://tantalize.lk/hero-poster.webp',
                'https://tantalize.lk/Tanata Logo.webp',
                'https://tantalize.lk/2024_Crowd.webp',
            ],
        },
        // Add other routes here if/when they become separate pages
        // For now, since it's a single-page app with sections, we mainly index the root
    ];
}
