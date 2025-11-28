import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/', // Example of a disallowed path
        },
        sitemap: 'https://tantalize.lk/sitemap.xml',
    };
}
