'use client';

import {
    ExternalLink,
    MoreVertical,
    Trash2,
    Pencil,
    Calendar,
    Globe
} from 'lucide-react';
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
    const domain = bookmark.url ? new URL(bookmark.url).hostname : '';
    const dateStr = format(bookmark.createdAt, 'MMM d, yyyy');

    if (view === 'grid') {
        const hasImage = !!bookmark.image;

        return (
            <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-border/80 transition-all hover:shadow-md flex flex-col h-full">
                <div className="relative aspect-video w-full bg-muted overflow-hidden flex items-center justify-center">
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <BookmarkActions bookmark={bookmark} onDelete={onDelete} onEdit={onEdit} />
                    </div>

                    {hasImage ? (
                        <img
                            src={bookmark.image}
                            alt=""
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.classList.add('flex-col');
                            }}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-2 opacity-40">
                            {bookmark.favicon ? (
                                <img src={bookmark.favicon} alt="" className="h-8 w-8" />
                            ) : (
                                <Globe className="h-8 w-8" />
                            )}
                        </div>
                    )}
                </div>

                {bookmark.title && (
                    <div className="p-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-1">
                                {bookmark.favicon && (
                                    <img src={bookmark.favicon} alt="" className="h-3 w-3 rounded-sm" />
                                )}
                                {domain && <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium truncate">{domain}</p>}
                            </div>
                            <h3 className="font-medium text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors">{bookmark.title}</h3>
                            {bookmark.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">{bookmark.description}</p>
                            )}
                        </div>

                        {bookmark.url && (
                            <a
                                href={bookmark.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 flex items-center justify-center gap-2 w-full p-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg border border-transparent hover:border-border transition-all"
                            >
                                Open Link <ExternalLink className="h-3 w-3" />
                            </a>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-card/50 border border-transparent hover:border-border transition-all">
            <div className="flex items-center gap-4 overflow-hidden flex-1">
                <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-card flex items-center justify-center border border-border shadow-sm overflow-hidden">
                    {bookmark.favicon ? (
                        <img src={bookmark.favicon} alt="" className="h-6 w-6" />
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
