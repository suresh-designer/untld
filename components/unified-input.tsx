'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { ItemType } from '@/types';

interface UnifiedInputProps {
    onAdd: (item: any) => Promise<any>;
}

export function UnifiedInput({ onAdd }: UnifiedInputProps) {
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isColor = (str: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(str);

    const isImageUrl = (url: string) => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'];
        try {
            const urlPath = new URL(url).pathname.toLowerCase();
            return imageExtensions.some(ext => urlPath.endsWith(ext));
        } catch {
            return false;
        }
    };

    const fetchColorName = async (hex: string) => {
        try {
            const cleanHex = hex.replace('#', '');
            const response = await fetch(`https://www.thecolorapi.com/id?hex=${cleanHex}`);
            const data = await response.json();
            return data.name?.value || null;
        } catch {
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = value.trim();
        if (!trimmed) return;

        setIsLoading(true);

        // 1. Color Check
        if (isColor(trimmed)) {
            const colorName = await fetchColorName(trimmed);
            await onAdd({
                type: 'color',
                content: trimmed,
                color_hex: trimmed,
                color_name: colorName || 'Unnamed Color'
            });
            setValue('');
            setIsLoading(false);
            return;
        }

        // 2. URL Check
        let url = trimmed;
        if (trimmed.startsWith('www.') || (trimmed.includes('.') && !trimmed.includes(' '))) {
            if (!url.startsWith('http')) {
                url = `https://${url}`;
            }

            try {
                new URL(url); // Validate URL

                // Image Check
                if (isImageUrl(url)) {
                    await onAdd({
                        type: 'image',
                        content: url,
                        image_url: url
                    });
                } else {
                    // Fetch Metadata for Link
                    const res = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
                    const metadata = await res.json();

                    await onAdd({
                        type: 'link',
                        content: url,
                        title: metadata.title || url,
                        favicon: metadata.favicon || '',
                        image_url: metadata.image || ''
                    });
                }
                setValue('');
                setIsLoading(false);
                return;
            } catch {
                // Not a valid URL, treat as text
            }
        }

        // 3. Default: Text
        await onAdd({
            type: 'text',
            content: trimmed
        });

        setValue('');
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="relative group">
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Paste link, image, color or type something..."
                className="w-full bg-muted/50 border border-border/50 rounded-2xl py-6 px-14 text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all placeholder:text-muted-foreground/40"
                disabled={isLoading}
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary/40 transition-colors">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
            </div>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none">
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    <span className="text-xs">⏎</span> ENTER
                </kbd>
            </div>
        </form>
    );
}
