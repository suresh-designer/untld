/**
 * Utility to extract a color palette from an image URL using the Canvas API.
 */
export async function extractPaletteFromImage(imageUrl: string, count: number = 5): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Crucial for cross-domain images

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve([]);
                return;
            }

            // Small scale for faster processing
            const scale = 50;
            canvas.width = scale;
            canvas.height = scale;

            ctx.drawImage(img, 0, 0, scale, scale);

            const imageData = ctx.getImageData(0, 0, scale, scale).data;
            const colorCounts: { [key: string]: number } = {};

            // Sample pixels
            for (let i = 0; i < imageData.length; i += 4) {
                const r = imageData[i];
                const g = imageData[i + 1];
                const b = imageData[i + 2];
                const a = imageData[i + 3];

                // Skip transparent or near-transparent pixels
                if (a < 128) continue;

                // Skip extremely dark or extremely light pixels (often background/noise)
                const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                if (brightness < 20 || brightness > 235) continue;

                // Group similar colors by rounding components
                const factor = 10;
                const roundedR = Math.round(r / factor) * factor;
                const roundedG = Math.round(g / factor) * factor;
                const roundedB = Math.round(b / factor) * factor;

                const hex = rgbToHex(roundedR, roundedG, roundedB);
                colorCounts[hex] = (colorCounts[hex] || 0) + 1;
            }

            // Sort by frequency and take top N
            const palette = Object.entries(colorCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, count)
                .map(entry => entry[0]);

            resolve(palette);
        };

        img.onerror = () => {
            console.warn('Failed to load image for color extraction:', imageUrl);
            resolve([]);
        };

        img.src = imageUrl;
    });
}

function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number) => {
        const hex = n.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
