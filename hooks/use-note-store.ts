'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { NoteBlock, NoteType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export function useNoteStore() {
    const [blocks, setBlocks] = useState<NoteBlock[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const fetchBlocks = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('notes')
                .select('*')
                .order('order', { ascending: true });

            if (error) {
                console.error('Error fetching notes:', error);
                setIsLoaded(true); // Still set to loaded to show components
                return;
            }

            if (data) {
                setBlocks(data);
            }
        } catch (e) {
            console.error('Supabase connection failed:', e);
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        fetchBlocks();
    }, [fetchBlocks]);

    const addBlock = async (type: NoteType = 'text', content: string = '', afterId?: string) => {
        const index = afterId ? blocks.findIndex(b => b.id === afterId) : blocks.length - 1;
        const newOrder = afterId ? (blocks[index].order + (blocks[index + 1]?.order || blocks[index].order + 1000)) / 2 : (blocks[blocks.length - 1]?.order || 0) + 1000;

        const newBlock: NoteBlock = {
            id: uuidv4(),
            type,
            content,
            order: newOrder,
        };

        // UI optimistic update
        const updatedBlocks = [...blocks];
        updatedBlocks.splice(index + 1, 0, newBlock);
        setBlocks(updatedBlocks);

        const { error } = await supabase.from('notes').insert(newBlock);
        if (error) {
            console.error('Error adding block:', error);
            // If table doesn't exist, we just keep local state for verification
        }
    };

    const updateBlock = async (id: string, updates: Partial<NoteBlock>) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));

        try {
            const { error } = await supabase
                .from('notes')
                .update(updates)
                .eq('id', id);

            if (error) {
                console.error('Error updating block:', error);
            }
        } catch (e) {
            console.error('Supabase update failed:', e);
        }
    };

    const deleteBlock = async (id: string) => {
        if (blocks.length <= 1) return; // Keep at least one block if possible or handle empty state

        setBlocks(prev => prev.filter(b => b.id !== id));

        try {
            const { error } = await supabase
                .from('notes')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting block:', error);
            }
        } catch (e) {
            console.error('Supabase delete failed:', e);
        }
    };

    return {
        blocks,
        isLoaded,
        addBlock,
        updateBlock,
        deleteBlock,
        refresh: fetchBlocks
    };
}
