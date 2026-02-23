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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim()) return;

        // Check if it's a URL
        let url = value.trim();
        if (!url.startsWith('http')) {
            url = `https://${url}`;
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
                description: data.description,
                folderId: activeFolderId,
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
                    description: '',
                    folderId: activeFolderId
                });
                setValue('');
            } else {
                // Try to add with what we have
                const domain = new URL(url).hostname;
                onAdd({
                    url: url,
                    title: domain,
                    favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
                    description: '',
                    folderId: activeFolderId,
                });
                setValue('');
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
