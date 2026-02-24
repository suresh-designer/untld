'use client';

import {
    ExternalLink,
    MoreVertical,
    Trash2,
    Pencil,
    Calendar,
    Globe,
    Download,
    Copy,
    Check
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Bookmark } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface BookmarkItemProps {
    bookmark: Bookmark;
    view: 'list' | 'grid';
    onDelete: (id: string) => void;
    onEdit: (bookmark: Bookmark) => void;
}

export function BookmarkItem({ bookmark, view, onDelete, onEdit }: BookmarkItemProps) {
    const [isCopied, setIsCopied] = useState(false);
    const domain = bookmark.url ? new URL(bookmark.url).hostname : '';
    const dateStr = format(bookmark.createdAt, 'MMM d, yyyy');
    const isColorBookmark = bookmark.type === 'color';
    const isImageBookmark = bookmark.type === 'image';
    const colorCode = isColorBookmark ? bookmark.image?.replace('color:', '') : null;

    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => setIsCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isCopied]);

    const handleCopyColor = () => {
        if (colorCode) {
            navigator.clipboard.writeText(colorCode);
            setIsCopied(true);
        }
    };

    if (view === 'grid') {
        return (
            <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-border/80 transition-all hover:shadow-md flex flex-col">
                <div className="relative w-full bg-muted overflow-hidden flex items-center justify-center">
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <BookmarkActions bookmark={bookmark} onDelete={onDelete} onEdit={onEdit} />
                    </div>

                    {isColorBookmark ? (
                        <div
                            className="w-full aspect-video"
                            style={{ backgroundColor: colorCode || 'transparent' }}
                        />
                    ) : isImageBookmark && bookmark.image ? (
                        <img
                            src={bookmark.image}
                            alt=""
                            className="w-full h-auto object-cover transition-transform group-hover:scale-105 rounded-t-xl"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.classList.add('flex-col');
                            }}
                        />
                    ) : bookmark.image ? (
                        <div className="relative aspect-video w-full overflow-hidden">
                            <img
                                src={bookmark.image}
                                alt=""
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center aspect-video space-y-2 opacity-40">
                            {bookmark.favicon ? (
                                <img src={bookmark.favicon} alt="" className="h-8 w-8" />
                            ) : (
                                <Globe className="h-8 w-8" />
                            )}
                        </div>
                    )}
                </div>

                <div className="p-4 flex-1 flex flex-col">
                    {!isImageBookmark && (
                        <div className="space-y-1 mb-4">
                            <div className="flex items-center gap-2 mb-1">
                                {bookmark.favicon && (
                                    <img src={bookmark.favicon} alt="" className="h-3 w-3 rounded-sm" />
                                )}
                                {domain && <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium truncate">{domain}</p>}
                            </div>
                            <h3 className="font-medium text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors">{bookmark.title}</h3>
                        </div>
                    )}

                    <div className="mt-auto">
                        {bookmark.type === 'link' && bookmark.url && (
                            <a
                                href={bookmark.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full p-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg border border-transparent hover:border-border transition-all"
                            >
                                View Link <ExternalLink className="h-3 w-3" />
                            </a>
                        )}

                        {bookmark.type === 'image' && bookmark.image && (
                            <button
                                onClick={async () => {
                                    try {
                                        const response = await fetch(bookmark.image!);
                                        const blob = await response.blob();
                                        const url = window.URL.createObjectURL(blob);
                                        const link = document.createElement('a');
                                        link.href = url;
                                        const filename = bookmark.image!.split('/').pop()?.split('?')[0] || 'image';
                                        link.download = filename.includes('.') ? filename : `${filename}.jpg`;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                        window.URL.revokeObjectURL(url);
                                    } catch (error) {
                                        window.open(bookmark.image, '_blank');
                                    }
                                }}
                                className="flex items-center justify-center gap-2 w-full p-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg border border-transparent hover:border-border transition-all"
                            >
                                Download Image <Download className="h-3 w-3" />
                            </button>
                        )}

                        {bookmark.type === 'color' && colorCode && (
                            <button
                                onClick={handleCopyColor}
                                className="flex items-center justify-center gap-2 w-full p-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg border border-transparent hover:border-border transition-all"
                            >
                                {isCopied ? (
                                    <>Copied! <Check className="h-3 w-3 text-green-500" /></>
                                ) : (
                                    <>Copy Color Code <Copy className="h-3 w-3" /></>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-card/50 border border-transparent hover:border-border transition-all">
            <div className="flex items-center gap-4 overflow-hidden flex-1">
                <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-card flex items-center justify-center border border-border shadow-sm overflow-hidden">
                    {bookmark.favicon ? (
                        <img src={bookmark.favicon} alt="" className="h-6 w-6" />
                    ) : isColorBookmark ? (
                        <div
                            className="h-full w-full"
                            style={{ backgroundColor: colorCode || 'transparent' }}
                        />
                    ) : bookmark.image ? (
                        <img src={bookmark.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <Globe className="h-5 w-5 text-muted-foreground" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                        {bookmark.title || domain || bookmark.url}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {domain && <span className="truncate">{domain}</span>}
                        <span className="flex items-center gap-1 shrink-0">
                            <Calendar className="h-3 w-3" />
                            {dateStr}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                {bookmark.type === 'link' && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                        title="Open in new tab"
                    >
                        <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </Button>
                )}
                {bookmark.type === 'color' && colorCode && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleCopyColor}
                        title="Copy color code"
                    >
                        {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                )}
                <BookmarkActions bookmark={bookmark} onDelete={onDelete} onEdit={onEdit} />
            </div>
        </div>
    );
}

function BookmarkActions({ bookmark, onDelete, onEdit }: {
    bookmark: Bookmark,
    onDelete: (id: string) => void,
    onEdit: (bookmark: Bookmark) => void
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onEdit(bookmark)}>
                    <Pencil className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                {bookmark.type === 'image' && bookmark.image && (
                    <DropdownMenuItem onClick={async () => {
                        try {
                            const response = await fetch(bookmark.image!);
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;

                            // Try to get filename from URL
                            const filename = bookmark.image!.split('/').pop()?.split('?')[0] || 'image';
                            link.download = filename.includes('.') ? filename : `${filename}.jpg`;

                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            window.URL.revokeObjectURL(url);
                        } catch (error) {
                            console.error('Download failed, opening in new tab:', error);
                            window.open(bookmark.image, '_blank');
                        }
                    }}>
                        <Download className="h-4 w-4 mr-2" /> Download
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete(bookmark.id)}
                >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
