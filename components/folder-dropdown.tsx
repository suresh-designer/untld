'use client';

import {
    ChevronDown,
    Plus,
    Check,
    Clover,
    MoreVertical,
    Pencil,
    Trash2,
    Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { Folder } from '@/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

const FOLDER_COLORS = [
    '#22c55e', // green-500
    '#3b82f6', // blue-500
    '#ef4444', // red-500
    '#eab308', // yellow-500
    '#a855f7', // purple-500
    '#ec4899', // pink-500
    '#f97316', // orange-500
    '#06b6d4', // cyan-500
];

interface FolderDropdownProps {
    folders: Folder[];
    activeFolderId: string;
    onSelectFolder: (id: string) => void;
    onAddFolder: (name: string) => void;
    onRenameFolder: (id: string, name: string) => void;
    onDeleteFolder: (id: string) => void;
    onUpdateColor: (id: string, color: string) => void;
    defaultFolderId: string;
}

export function FolderDropdown({
    folders,
    activeFolderId,
    onSelectFolder,
    onAddFolder,
    onRenameFolder,
    onDeleteFolder,
    onUpdateColor,
    defaultFolderId,
}: FolderDropdownProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    const activeFolder = folders.find(f => f.id === activeFolderId) || folders[0];

    const handleAddFolder = (e: React.FormEvent) => {
        e.preventDefault();
        if (newFolderName.trim()) {
            onAddFolder(newFolderName.trim());
            setNewFolderName('');
            setIsAdding(false);
        }
    };

    const handleRename = (id: string) => {
        if (editName.trim()) {
            onRenameFolder(id, editName.trim());
            setEditingId(null);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <div className="p-1 rounded-md hover:bg-accent transition-colors">
                <Clover className="h-6 w-6" />
            </div>
            <span className="text-muted-foreground font-medium">/</span>

            <DropdownMenu onOpenChange={(open) => {
                if (!open) {
                    setIsAdding(false);
                    setEditingId(null);
                }
            }}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-9 px-3 gap-2 rounded-full bg-secondary hover:bg-secondary/80 text-foreground font-medium border border-border/50">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeFolder?.color }} />
                        {activeFolder?.name}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 bg-secondary border-border rounded-xl p-1 mt-1 shadow-lg">
                    {folders.map((folder) => (
                        <div key={folder.id} className="group relative flex items-center px-1 mb-1 last:mb-0">
                            <DropdownMenuItem
                                className={cn(
                                    "flex-1 flex items-center justify-between rounded-lg px-2 py-2 cursor-pointer transition-all",
                                    activeFolderId === folder.id ? "bg-background shadow-sm" : "hover:bg-background/20"
                                )}
                                onClick={() => onSelectFolder(folder.id)}
                            >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <span
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{ backgroundColor: folder.color }}
                                    />
                                    {editingId === folder.id ? (
                                        <Input
                                            autoFocus
                                            className="h-6 text-sm py-0 px-1 bg-transparent border-none focus-visible:ring-1 focus-visible:ring-ring"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleRename(folder.id)}
                                            onBlur={() => handleRename(folder.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    ) : (
                                        <span className="text-sm font-medium truncate">{folder.name}</span>
                                    )}
                                </div>
                                {activeFolderId === folder.id && !editingId && <Check className="h-4 w-4 opacity-50 ml-2" />}
                            </DropdownMenuItem>

                            {/* Submenu for Actions */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-1/2 -translate-y-1/2"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MoreVertical className="h-3 w-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-32 bg-popover border-border rounded-lg p-1 shadow-xl">
                                    <DropdownMenuItem onClick={() => {
                                        setEditingId(folder.id);
                                        setEditName(folder.name);
                                    }}>
                                        <Pencil className="h-3 w-3 mr-2" /> Rename
                                    </DropdownMenuItem>

                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <Palette className="h-3 w-3 mr-2" /> Color
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent className="p-1 bg-popover border-border min-w-[120px]">
                                            <div className="grid grid-cols-4 gap-1 p-1">
                                                {FOLDER_COLORS.map((c) => (
                                                    <button
                                                        key={c}
                                                        className={cn(
                                                            "w-5 h-5 rounded-full border border-border/50 hover:scale-110 transition-transform",
                                                            folder.color === c && "ring-1 ring-ring"
                                                        )}
                                                        style={{ backgroundColor: c }}
                                                        onClick={() => onUpdateColor(folder.id, c)}
                                                    />
                                                ))}
                                            </div>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>

                                    <DropdownMenuSeparator className="bg-border/20" />
                                    <DropdownMenuItem
                                        disabled={folder.id === defaultFolderId}
                                        className="text-destructive focus:text-destructive"
                                        onClick={() => onDeleteFolder(folder.id)}
                                    >
                                        <Trash2 className="h-3 w-3 mr-2" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ))}

                    <DropdownMenuSeparator className="bg-border/20 mx-1 my-1" />

                    {isAdding ? (
                        <form onSubmit={handleAddFolder} className="p-1">
                            <Input
                                autoFocus
                                placeholder="Group name..."
                                className="h-8 text-sm bg-background border-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                onBlur={() => !newFolderName && setIsAdding(false)}
                            />
                        </form>
                    ) : (
                        <DropdownMenuItem
                            className="flex items-center gap-2 rounded-lg px-2 py-2 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-background/20"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsAdding(true);
                            }}
                        >
                            <Plus className="h-4 w-4" />
                            <span className="text-sm font-medium">Create Group</span>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
