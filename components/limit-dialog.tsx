'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, FolderPlus, Box } from "lucide-react";

interface LimitDialogProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'folders' | 'blocks' | null;
}

export function LimitDialog({ isOpen, onClose, type }: LimitDialogProps) {
    if (!type) return null;

    const isFolder = type === 'folders';
    const limit = isFolder ? 3 : 50;
    const title = isFolder ? "Folder Limit Reached" : "Block Limit Reached";
    const description = isFolder
        ? `You've reached the maximum limit of ${limit} folders. To stay organized and focused, we've set a limit on individual groups.`
        : `You've reached the maximum limit of ${limit} blocks in this workspace. Try organizing your current captures before adding more.`;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-border/40 bg-card/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl">
                <div className="p-8 space-y-6">
                    <div className="flex justify-center">
                        <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center">
                            {isFolder ? (
                                <FolderPlus className="h-8 w-8 text-primary" />
                            ) : (
                                <Box className="h-8 w-8 text-primary" />
                            )}
                        </div>
                    </div>

                    <div className="text-center space-y-2">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold tracking-tight text-center">
                                {title}
                            </DialogTitle>
                        </DialogHeader>
                        <DialogDescription className="text-[13px] leading-relaxed text-muted-foreground">
                            {description}
                        </DialogDescription>
                    </div>

                    <DialogFooter className="sm:justify-center">
                        <Button
                            onClick={onClose}
                            className="w-full h-12 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg hover:shadow-xl transition-all"
                        >
                            Got it
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
