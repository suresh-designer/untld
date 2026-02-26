import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { ItemType } from '@/types';
import { cn } from '@/lib/utils';

interface UnifiedInputProps {
    onAdd: (item: any) => Promise<any>;
}

const HINTS = [
    "You can paste anything",
    "#EEEEE - example for color code",
    "Link",
    "Notes",
    "Images",
    "Make interesting content"
];

export function UnifiedInput({ onAdd }: UnifiedInputProps) {
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hintIndex, setHintIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setHintIndex((prev) => (prev + 1) % HINTS.length);
                setIsTransitioning(false);
            }, 500);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

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
            const success = await onAdd({
                type: 'color',
                content: trimmed,
                color_hex: trimmed,
                color_name: colorName || 'Unnamed Color'
            });
            if (success) {
                setValue('');
            }
            setIsLoading(false);
            return;
        }

        // 2. Font Check (Example: "Font: Roboto")
        if (trimmed.toLowerCase().startsWith('font:')) {
            const fontName = trimmed.substring(5).trim();
            const success = await onAdd({
                type: 'font',
                content: fontName,
                title: fontName
            });
            if (success) {
                setValue('');
            }
            setIsLoading(false);
            return;
        }

        // 3. URL Check
        let url = trimmed;
        if (trimmed.startsWith('www.') || (trimmed.includes('.') && !trimmed.includes(' '))) {
            if (!url.startsWith('http')) {
                url = `https://${url}`;
            }

            try {
                new URL(url); // Validate URL

                // Image Check
                if (isImageUrl(url)) {
                    const success = await onAdd({
                        type: 'image',
                        content: url,
                        image_url: url
                    });
                    if (success) {
                        setValue('');
                    }
                } else {
                    // Fetch Metadata for Link
                    const res = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
                    const metadata = await res.json();

                    const success = await onAdd({
                        type: 'link',
                        content: url,
                        title: metadata.title || url,
                        favicon: metadata.favicon || '',
                        image_url: metadata.image || ''
                    });
                    if (success) {
                        setValue('');
                    }
                }
                setIsLoading(false);
                return;
            } catch {
                // Not a valid URL, treat as text
            }
        }

        // 4. Default: Text
        const success = await onAdd({
            type: 'text',
            content: trimmed
        });

        if (success) {
            setValue('');
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="relative group">
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full bg-muted/50 border border-border/50 rounded-2xl py-6 px-14 text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all"
                    disabled={isLoading}
                />
                {!value && (
                    <div className={cn(
                        "absolute left-14 top-1/2 -translate-y-1/2 pointer-events-none text-lg text-muted-foreground/40 transition-all duration-500",
                        isTransitioning ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-[-50%]"
                    )}>
                        {HINTS[hintIndex]}
                    </div>
                )}
            </div>
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
