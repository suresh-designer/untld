'use client';

import { useRef, useEffect, KeyboardEvent } from 'react';
import { NoteBlock, NoteType } from '@/types';
import { cn } from '@/lib/utils';

interface NoteBlockProps {
    block: NoteBlock;
    onUpdate: (id: string, updates: Partial<NoteBlock>) => void;
    onDelete: (id: string) => void;
    onAdd: (type: NoteType, content: string, afterId: string) => void;
    onFocusNext: (id: string) => void;
    onFocusPrev: (id: string) => void;
}

export function NoteBlockComponent({
    block,
    onUpdate,
    onDelete,
    onAdd,
    onFocusNext,
    onFocusPrev
}: NoteBlockProps) {
    const editableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editableRef.current && editableRef.current.innerText !== block.content) {
            editableRef.current.innerText = block.content;
        }
    }, [block.content]);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const content = editableRef.current?.innerText || '';
            const type = block.type;

            // If it's a list item, continue the list
            const nextType = type === 'bullet' ? 'bullet' : 'text';
            onAdd(nextType, '', block.id);
        } else if (e.key === 'Backspace' && !editableRef.current?.innerText) {
            e.preventDefault();
            onDelete(block.id);
            onFocusPrev(block.id);
        } else if (e.key === 'ArrowUp') {
            onFocusPrev(block.id);
        } else if (e.key === 'ArrowDown') {
            onFocusNext(block.id);
        }
    };

    const handleInput = () => {
        const content = editableRef.current?.innerText || '';
        let newType = block.type;

        if (block.type === 'text') {
            if (content.startsWith('# ')) {
                newType = 'h1';
                editableRef.current!.innerText = content.substring(2);
            } else if (content.startsWith('## ')) {
                newType = 'h2';
                editableRef.current!.innerText = content.substring(3);
            } else if (content.startsWith('### ')) {
                newType = 'h3';
                editableRef.current!.innerText = content.substring(4);
            } else if (content.startsWith('- ') || content.startsWith('* ')) {
                newType = 'bullet';
                editableRef.current!.innerText = content.substring(2);
            }
        }

        if (newType !== block.type) {
            onUpdate(block.id, { type: newType, content: editableRef.current!.innerText });
        }
    };

    const handleBlur = () => {
        const content = editableRef.current?.innerText || '';
        if (content !== block.content) {
            onUpdate(block.id, { content });
        }
    };

    return (
        <div className="group relative py-1 px-4">
            <div
                ref={editableRef}
                contentEditable
                onInput={handleInput}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={cn(
                    "outline-none min-h-[1.5em] empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/30",
                    block.type === 'h1' && "text-3xl font-bold mt-6 mb-2",
                    block.type === 'h2' && "text-2xl font-bold mt-4 mb-2",
                    block.type === 'h3' && "text-xl font-bold mt-3 mb-1",
                    block.type === 'bullet' && "list-item ml-6",
                    block.type === 'text' && "text-base leading-relaxed"
                )}
                data-placeholder={block.order === 0 ? "Start typing your ideas..." : ""}
                id={`block-${block.id}`}
            />
        </div>
    );
}
