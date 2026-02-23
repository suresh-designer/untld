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
        return (
            <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-border/80 transition-all hover:shadow-md flex flex-col h-full">
                <div className="p-4 flex-1 flex flex-col items-center justify-center text-center space-y-3 relative">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <BookmarkActions bookmark={bookmark} onDelete={onDelete} onEdit={onEdit} />
                    </div>

                    <div className="h-12 w-12 rounded-lg bg-background flex items-center justify-center shadow-sm border border-border">
                        {bookmark.favicon ? (
                            <img src={bookmark.favicon} alt="" className="h-8 w-8" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        ) : (
                            <Globe className="h-6 w-6 text-muted-foreground" />
                        )}
                    </div>

                    <div className="space-y-1 w-full px-2">
                        <h3 className="font-medium text-sm line-clamp-2 leading-snug">{bookmark.title}</h3>
                        {domain && <p className="text-xs text-muted-foreground truncate">{domain}</p>}
                    </div>
                </div>

                {bookmark.url && (
                    <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-2 text-center text-[10px] uppercase font-semibold tracking-wider text-muted-foreground hover:bg-muted/50 border-t border-border transition-colors"
                    >
                        Open Link
                    </a>
                )}
            </div>
        );
    }

    return (
        <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-card/50 border border-transparent hover:border-border transition-all">
            <div className="flex items-center gap-4 overflow-hidden flex-1">
                <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-card flex items-center justify-center border border-border shadow-sm">
                    {bookmark.favicon ? (
                        <img src={bookmark.favicon} alt="" className="h-6 w-6" />
                    ) : (
                        <Globe className="h-5 w-5 text-muted-foreground" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{bookmark.title}</h3>
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
