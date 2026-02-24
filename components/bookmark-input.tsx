'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Loader2, Plus } from 'lucide-react';
import { Bookmark } from '@/types';

interface BookmarkInputProps {
    onAdd: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
    activeFolderId: string;
}

export function BookmarkInput({ onAdd, activeFolderId }: BookmarkInputProps) {
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isImageUrl = (url: string) => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'];
        try {
            const urlPath = new URL(url).pathname.toLowerCase();
            return imageExtensions.some(ext => urlPath.endsWith(ext));
        } catch {
            return false;
        }
    };

    const isColor = (str: string) => {
        const hexRegex = /^#([A-Fa-f0-9]{3}){1,2}$/;
        const rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
        const rgbaRegex = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([\d.]+)\s*\)$/;
        const hslRegex = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/;
        return hexRegex.test(str) || rgbRegex.test(str) || rgbaRegex.test(str) || hslRegex.test(str);
    };

    const fetchColorName = async (hex: string) => {
        try {
            const cleanHex = hex.replace('#', '');
            const res = await fetch(`https://www.thecolorapi.com/id?hex=${cleanHex}`);
            const data = await res.json();
            return data.name?.value || '';
        } catch (err) {
            console.error('Error fetching color name:', err);
            return '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim()) return;

        const trimmedValue = value.trim();

        // Color handling
        if (isColor(trimmedValue)) {
            setIsLoading(true);
            const colorName = await fetchColorName(trimmedValue);
            onAdd({
                url: '',
                title: colorName ? `${trimmedValue} - ${colorName}` : trimmedValue,
                favicon: '',
                image: `color:${trimmedValue}`,
                description: '',
                folderId: activeFolderId,
                type: 'color',
                colorName: colorName
            });
            setValue('');
            setIsLoading(false);
            return;
        }

        let url = trimmedValue;
        if (!url.startsWith('http')) {
            url = `https://${url}`;
        }

        // Direct image handling
        if (isImageUrl(url)) {
            onAdd({
                url: url,
                title: '',
                favicon: '',
                image: url,
                description: '',
                folderId: activeFolderId,
                type: 'image'
            });
            setValue('');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
            const data = await res.json();

            if (data.error) throw new Error(data.error);

            onAdd({
                url: data.url,
                title: data.title,
                favicon: data.favicon,
                image: data.image,
                description: '',
                folderId: activeFolderId,
                type: data.image ? 'image' : 'link'
            });
            setValue('');
        } catch (err) {
            console.error('Fetch error:', err);
            // Fallback for failed fetch or invalid URL that isn't a link
            if (!value.includes('.')) {
                // It's probably just plain text, treat as an internal note/title
                onAdd({
                    url: '',
                    title: value.trim(),
                    favicon: '',
                    image: '',
                    description: '',
                    folderId: activeFolderId,
                    type: 'link'
                });
                setValue('');
            } else {
                // Try to add with what we have
                try {
                    const domain = new URL(url).hostname;
                    onAdd({
                        url: url,
                        title: domain,
                        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
                        image: '',
                        description: '',
                        folderId: activeFolderId,
                        type: 'link'
                    });
                    setValue('');
                } catch (e) {
                    // Final fallback for truly invalid URLs
                    onAdd({
                        url: '',
                        title: value.trim(),
                        favicon: '',
                        image: '',
                        description: '',
                        folderId: activeFolderId,
                        type: 'link'
                    });
                    setValue('');
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative group">
            <Input
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                placeholder="Insert a link, color, or just plain text..."
                className="pr-10 h-12 bg-card border-border hover:border-border/80 transition-colors rounded-xl focus-visible:ring-1 focus-visible:ring-ring shadow-sm"
                disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                    <Plus className="h-5 w-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                )}
            </div>
        </form>
    );
}
