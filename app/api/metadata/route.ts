import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error('Failed to fetch URL');
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        const title = $('title').text() || $('meta[property="og:title"]').attr('content') || url;
        const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';

        // Favicon logic
        const domain = new URL(url).hostname;
        const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

        return NextResponse.json({
            title: title.trim(),
            description: description.trim(),
            favicon,
            url
        });
    } catch (error) {
        console.error('Metadata fetch error:', error);
        // Return partial data if possible
        try {
            const domain = new URL(url).hostname;
            return NextResponse.json({
                title: domain,
                description: '',
                favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
                url
            });
        } catch (e) {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }
    }
}
