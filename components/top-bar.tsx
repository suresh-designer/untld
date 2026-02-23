'use client';

import { Search, LayoutGrid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TopBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    view: 'list' | 'grid';
    onViewChange: (view: 'list' | 'grid') => void;
}

export function TopBar({ searchQuery, onSearchChange, view, onViewChange }: TopBarProps) {
    return (
        <div className="flex items-center justify-between gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by title or URL..."
                    className="pl-10 bg-card border-border h-10 rounded-xl"
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="flex items-center bg-card border border-border rounded-xl p-1">
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "h-8 px-3 rounded-lg transition-all",
                        view === 'list' ? "bg-background shadow-sm" : "text-muted-foreground"
                    )}
                    onClick={() => onViewChange('list')}
                >
                    <List className="h-4 w-4 mr-2" />
                    List
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "h-8 px-3 rounded-lg transition-all",
                        view === 'grid' ? "bg-background shadow-sm" : "text-muted-foreground"
                    )}
                    onClick={() => onViewChange('grid')}
                >
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Grid
                </Button>
            </div>
        </div>
    );
}
