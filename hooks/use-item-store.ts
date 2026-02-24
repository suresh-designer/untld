'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Item, Folder, ItemType } from '@/types';
import { supabase } from '@/lib/supabase';

const FOLDERS_TABLE = 'folders';
const ITEMS_TABLE = 'moodboard_items';
const DEFAULT_FOLDER_ID = '00000000-0000-0000-0000-000000000000';

const FOLDER_COLORS = [
    '#22c55e', '#3b82f6', '#ef4444', '#eab308',
    '#a855f7', '#ec4899', '#f97316', '#06b6d4',
];

const getRandomColor = () => FOLDER_COLORS[Math.floor(Math.random() * FOLDER_COLORS.length)];

interface MoodboardState {
    folders: Folder[];
    items: Item[];
}

const initialState: MoodboardState = {
    folders: [
        {
            id: DEFAULT_FOLDER_ID,
            name: 'Moodboard',
            color: '#22c55e',
            createdAt: Date.now(),
        },
    ],
    items: [],
};

export function useItemStore() {
    const [state, setState] = useState<MoodboardState>(initialState);
    const [isLoaded, setIsLoaded] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [foldersRes, itemsRes] = await Promise.all([
                supabase.from(FOLDERS_TABLE).select('*').order('created_at', { ascending: true }),
                supabase.from(ITEMS_TABLE).select('*').order('created_at', { ascending: false })
            ]);

            if (foldersRes.error) console.error('Error fetching folders:', foldersRes.error);
            if (itemsRes.error) console.error('Error fetching items:', itemsRes.error);

            const loadedFolders: Folder[] = (foldersRes.data || []).map(f => ({
                id: f.id,
                name: f.name,
                color: f.color,
                createdAt: new Date(f.created_at).getTime()
            }));

            const loadedItems: Item[] = (itemsRes.data || []).map(i => ({
                id: i.id,
                type: i.type as ItemType,
                content: i.content,
                title: i.title,
                favicon: i.favicon,
                image_url: i.image_url,
                color_hex: i.color_hex,
                color_name: i.color_name,
                palette: i.palette,
                folderId: i.folder_id,
                created_at: new Date(i.created_at).getTime()
            }));

            // Ensure default folder exists if empty
            if (loadedFolders.length === 0) {
                const defaultFolder: Folder = initialState.folders[0];
                await supabase.from(FOLDERS_TABLE).insert({
                    id: defaultFolder.id,
                    name: defaultFolder.name,
                    color: defaultFolder.color,
                    created_at: new Date(defaultFolder.createdAt).toISOString()
                });
                loadedFolders.push(defaultFolder);
            }

            setState({ folders: loadedFolders, items: loadedItems });
        } catch (e) {
            console.error('Supabase fetch failed:', e);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addFolder = async (name: string, color?: string) => {
        const newFolder: Folder = {
            id: uuidv4(),
            name,
            color: color || getRandomColor(),
            createdAt: Date.now(),
        };

        setState((prev) => ({
            ...prev,
            folders: [...prev.folders, newFolder],
        }));

        await supabase.from(FOLDERS_TABLE).insert({
            id: newFolder.id,
            name: newFolder.name,
            color: newFolder.color,
            created_at: new Date(newFolder.createdAt).toISOString()
        });

        return newFolder;
    };

    const renameFolder = async (id: string, name: string) => {
        setState((prev) => ({
            ...prev,
            folders: prev.folders.map((f) => (f.id === id ? { ...f, name } : f)),
        }));

        await supabase.from(FOLDERS_TABLE).update({ name }).eq('id', id);
    };

    const updateFolderColor = async (id: string, color: string) => {
        setState((prev) => ({
            ...prev,
            folders: prev.folders.map((f) => (f.id === id ? { ...f, color } : f)),
        }));

        await supabase.from(FOLDERS_TABLE).update({ color }).eq('id', id);
    };

    const deleteFolder = async (id: string) => {
        if (id === DEFAULT_FOLDER_ID) return;

        setState((prev) => ({
            ...prev,
            folders: prev.folders.filter((f) => f.id !== id),
            items: prev.items.map((i) =>
                i.folderId === id ? { ...i, folderId: DEFAULT_FOLDER_ID } : i
            ),
        }));

        await Promise.all([
            supabase.from(ITEMS_TABLE).update({ folder_id: DEFAULT_FOLDER_ID }).eq('folder_id', id),
            supabase.from(FOLDERS_TABLE).delete().eq('id', id)
        ]);
    };

    const addItem = async (item: Omit<Item, 'id' | 'created_at'>) => {
        if (state.items.length >= 100) {
            throw new Error('Limit reached: Maximum 100 blocks allowed.');
        }

        let palette: string[] | undefined = undefined;
        if (item.type === 'image' && item.image_url) {
            const { extractPaletteFromImage } = await import('@/lib/color-utils');
            try {
                palette = await extractPaletteFromImage(item.image_url);
            } catch (e) {
                console.error('Failed to extract palette', e);
            }
        }

        const newItem: Item = {
            ...item,
            id: uuidv4(),
            palette,
            created_at: Date.now(),
        } as Item;

        setState((prev) => ({
            ...prev,
            items: [newItem, ...prev.items],
        }));

        await supabase.from(ITEMS_TABLE).insert({
            id: newItem.id,
            type: newItem.type,
            content: newItem.content,
            title: newItem.title,
            favicon: newItem.favicon,
            image_url: newItem.image_url,
            color_hex: newItem.color_hex,
            color_name: newItem.color_name,
            palette: newItem.palette,
            folder_id: newItem.folderId,
            created_at: new Date(newItem.created_at as number).toISOString()
        });

        return newItem;
    };

    const updateItem = async (id: string, updates: Partial<Item>) => {
        setState((prev) => ({
            ...prev,
            items: prev.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        }));

        const dbUpdates: any = { ...updates };
        if (updates.folderId) {
            dbUpdates.folder_id = updates.folderId;
            delete dbUpdates.folderId;
        }

        await supabase.from(ITEMS_TABLE).update(dbUpdates).eq('id', id);
    };

    const deleteItem = async (id: string) => {
        setState((prev) => ({
            ...prev,
            items: prev.items.filter((i) => i.id !== id),
        }));

        await supabase.from(ITEMS_TABLE).delete().eq('id', id);
    };

    const getGroupedItems = (folderId: string) => {
        const folderItems = state.items.filter(i => i.folderId === folderId);
        return {
            text: folderItems.filter(i => i.type === 'text'),
            color: folderItems.filter(i => i.type === 'color'),
            link: folderItems.filter(i => i.type === 'link'),
            image: folderItems.filter(i => i.type === 'image'),
        };
    };

    return {
        ...state,
        isLoaded,
        addFolder,
        renameFolder,
        updateFolderColor,
        deleteFolder,
        addItem,
        updateItem,
        deleteItem,
        getGroupedItems,
        DEFAULT_FOLDER_ID,
        totalCount: state.items.length,
    };
}
