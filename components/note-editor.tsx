'use client';

import { useNoteStore } from '@/hooks/use-note-store';
import { NoteBlockComponent } from './note-block';
import { useEffect } from 'react';

export function NoteEditor() {
    const { blocks, isLoaded, addBlock, updateBlock, deleteBlock } = useNoteStore();

    useEffect(() => {
        if (isLoaded && blocks.length === 0) {
            addBlock('text', '');
        }
    }, [isLoaded, blocks.length, addBlock]);

    const handleFocusNext = (id: string) => {
        const index = blocks.findIndex(b => b.id === id);
        if (index < blocks.length - 1) {
            const nextId = blocks[index + 1].id;
            document.getElementById(`block-${nextId}`)?.focus();
        }
    };

    const handleFocusPrev = (id: string) => {
        const index = blocks.findIndex(b => b.id === id);
        if (index > 0) {
            const prevId = blocks[index - 1].id;
            const el = document.getElementById(`block-${prevId}`);
            el?.focus();
            // Move cursor to end
            const range = document.createRange();
            const sel = window.getSelection();
            if (el && sel) {
                range.selectNodeContents(el);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    };

    if (!isLoaded) return null;

    return (
        <div className="max-w-4xl mx-auto w-full space-y-0.5 py-12">
            {blocks.map((block) => (
                <NoteBlockComponent
                    key={block.id}
                    block={block}
                    onUpdate={updateBlock}
                    onDelete={deleteBlock}
                    onAdd={addBlock}
                    onFocusNext={handleFocusNext}
                    onFocusPrev={handleFocusPrev}
                />
            ))}
        </div>
    );
}
