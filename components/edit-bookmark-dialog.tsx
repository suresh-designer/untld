'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bookmark } from '@/types';

interface EditBookmarkDialogProps {
    bookmark: Bookmark | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, updates: Partial<Bookmark>) => void;
}

export function EditBookmarkDialog({
    bookmark,
    isOpen,
    onClose,
    onSave
}: EditBookmarkDialogProps) {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        if (bookmark) {
            setTitle(bookmark.title);
            setUrl(bookmark.url);
        }
    }, [bookmark]);

    const handleSave = () => {
        if (bookmark && title.trim()) {
            onSave(bookmark.id, {
                title: title.trim(),
                url: url.trim()
            });
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-card border-border">
                <DialogHeader>
                    <DialogTitle>Edit Bookmark</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                            className="bg-background border-border"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="url">URL</Label>
                        <Input
                            id="url"
                            value={url}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                            className="bg-background border-border"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
