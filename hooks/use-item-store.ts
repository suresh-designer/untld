'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Item, Folder, ItemType } from '@/types';
import { supabase } from '@/lib/supabase';

const FOLDERS_TABLE = 'folders';
const ITEMS_TABLE = 'moodboard_items';
const DEFAULT_FOLDER_NAME = 'Moodboard';

const FOLDER_COLORS = [
    '#22c55e', '#3b82f6', '#ef4444', '#eab308',
    '#a855f7', '#ec4899', '#f97316', '#06b6d4',
];

const getRandomColor = () => FOLDER_COLORS[Math.floor(Math.random() * FOLDER_COLORS.length)];

interface MoodboardState {
    folders: Folder[];
    items: Item[];
    user: any | null;
}

const initialState: MoodboardState = {
    folders: [],
    items: [],
    user: null,
};

export function useItemStore() {
    const [state, setState] = useState<MoodboardState>(initialState);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isGeneratingPalette, setIsGeneratingPalette] = useState(false);

    const fetchData = useCallback(async (userId: string) => {
        try {
            const [foldersRes, itemsRes] = await Promise.all([
                supabase.from(FOLDERS_TABLE).select('*').eq('user_id', userId).order('created_at', { ascending: true }),
                supabase.from(ITEMS_TABLE).select('*').eq('user_id', userId).order('created_at', { ascending: false })
            ]);

            if (foldersRes.error) console.error('Error fetching folders:', foldersRes.error);
            if (itemsRes.error) console.error('Error fetching items:', itemsRes.error);

            let loadedFolders: Folder[] = (foldersRes.data || []).filter(Boolean).map(f => ({
                id: f.id,
                name: f.name,
                color: f.color,
                magic_palette: f.magic_palette,
                createdAt: f.created_at ? new Date(f.created_at).getTime() : Date.now()
            }));

            // Ensure default folder exists if empty for this user
            if (loadedFolders.length === 0) {
                const { data: newFolder, error: folderError } = await supabase.from(FOLDERS_TABLE).insert({
                    name: DEFAULT_FOLDER_NAME,
                    color: getRandomColor(),
                    user_id: userId
                }).select().single();

                if (newFolder) {
                    loadedFolders = [{
                        id: newFolder.id,
                        name: newFolder.name,
                        color: newFolder.color,
                        createdAt: newFolder.created_at ? new Date(newFolder.created_at).getTime() : Date.now()
                    }];
                } else if (folderError) {
                    console.error('Error creating default folder:', folderError);
                }
            }

            const loadedItems: Item[] = (itemsRes.data || []).filter(Boolean).map(i => ({
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
                created_at: i.created_at ? new Date(i.created_at).getTime() : Date.now()
            }));

            setState(prev => ({ ...prev, folders: loadedFolders, items: loadedItems }));
        } catch (e) {
            console.error('Supabase fetch failed:', e);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setState(prev => ({ ...prev, user: session.user }));
                fetchData(session.user.id);
            } else {
                setIsLoaded(true);
            }
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setState(prev => ({ ...prev, user: session.user }));
                fetchData(session.user.id);
            } else {
                setState(initialState);
            }
        });

        return () => subscription.unsubscribe();
    }, [fetchData]);

    const addFolder = async (name: string, color?: string) => {
        if (!state.user) return null;

        if (state.folders.length >= 3) {
            throw new Error('Folder limit reached: Maximum 3 folders allowed.');
        }

        const { data: newFolder, error } = await supabase.from(FOLDERS_TABLE).insert({
            name,
            color: color || getRandomColor(),
            user_id: state.user.id
        }).select().single();

        if (error) {
            console.error('Error adding folder:', error);
            return null;
        }

        const folderObj: Folder = {
            id: newFolder.id,
            name: newFolder.name,
            color: newFolder.color,
            createdAt: new Date(newFolder.created_at).getTime(),
        };

        setState((prev) => ({
            ...prev,
            folders: [...prev.folders, folderObj],
        }));

        return folderObj;
    };

    const renameFolder = async (id: string, name: string) => {
        if (!state.user) return;
        setState((prev) => ({
            ...prev,
            folders: prev.folders.map((f) => (f.id === id ? { ...f, name } : f)),
        }));

        await supabase.from(FOLDERS_TABLE).update({ name }).eq('id', id).eq('user_id', state.user.id);
    };

    const updateFolderColor = async (id: string, color: string) => {
        if (!state.user) return;
        setState((prev) => ({
            ...prev,
            folders: prev.folders.map((f) => (f.id === id ? { ...f, color } : f)),
        }));

        await supabase.from(FOLDERS_TABLE).update({ color }).eq('id', id).eq('user_id', state.user.id);
    };

    const deleteFolder = async (id: string) => {
        if (!state.user || state.folders.length <= 1) return; // Prevent deleting the last folder

        const remainingFolders = state.folders.filter((f) => f.id !== id);
        const fallbackFolderId = remainingFolders[0].id;

        setState((prev) => ({
            ...prev,
            folders: remainingFolders,
            items: prev.items.map((i) =>
                i.folderId === id ? { ...i, folderId: fallbackFolderId } : i
            ),
        }));

        await Promise.all([
            supabase.from(ITEMS_TABLE).update({ folder_id: fallbackFolderId }).eq('folder_id', id).eq('user_id', state.user.id),
            supabase.from(FOLDERS_TABLE).delete().eq('id', id).eq('user_id', state.user.id)
        ]);
    };

    const addItem = async (item: Omit<Item, 'id' | 'created_at'>) => {
        if (!state.user) {
            console.error('Cant add item: No user session');
            return null;
        }

        if (state.items.length >= 50) {
            throw new Error('Limit reached: Maximum 50 blocks allowed.');
        }

        const tempId = uuidv4();
        const newItemOptimistic: Item = {
            ...item,
            id: tempId,
            created_at: Date.now(),
        } as Item;

        // UI optimistic update
        setState((prev) => ({
            ...prev,
            items: [newItemOptimistic, ...prev.items],
        }));

        try {
            let palette: string[] | undefined = undefined;
            if (item.type === 'image' && item.image_url) {
                const { extractPaletteFromImage } = await import('@/lib/color-utils');
                try {
                    palette = await extractPaletteFromImage(item.image_url);
                } catch (e) {
                    console.error('Failed to extract palette', e);
                }
            }

            // Ensure folder_id is a valid UUID or just pass it as is if it's there
            const folderId = item.folderId || null;

            const { data: newItem, error } = await supabase.from(ITEMS_TABLE).insert({
                user_id: state.user.id,
                type: item.type,
                content: item.content,
                title: item.title,
                favicon: item.favicon,
                image_url: item.image_url,
                color_hex: item.color_hex,
                color_name: item.color_name,
                palette: palette || item.palette,
                folder_id: folderId,
            }).select().single();

            if (error) {
                console.error('Supabase error adding item:', error);
                console.error('Attempted data:', {
                    user_id: state.user.id,
                    type: item.type,
                    folder_id: folderId,
                });
                // Rollback optimistic update
                setState((prev) => ({
                    ...prev,
                    items: prev.items.filter(i => i.id !== tempId),
                }));
                return null;
            }

            const itemObj: Item = {
                id: newItem.id,
                type: newItem.type as ItemType,
                content: newItem.content,
                title: newItem.title,
                favicon: newItem.favicon,
                image_url: newItem.image_url,
                color_hex: newItem.color_hex,
                color_name: newItem.color_name,
                palette: newItem.palette,
                folderId: newItem.folder_id,
                created_at: new Date(newItem.created_at).getTime()
            };

            // Replace temp item with real one
            setState((prev) => ({
                ...prev,
                items: prev.items.map(i => i.id === tempId ? itemObj : i),
            }));

            return itemObj;
        } catch (e) {
            console.error('Exception adding item:', e);
            setState((prev) => ({
                ...prev,
                items: prev.items.filter(i => i.id !== tempId),
            }));
            return null;
        }
    };

    const updateItem = async (id: string, updates: Partial<Item>) => {
        if (!state.user) return;
        const previousItems = state.items;
        setState((prev) => ({
            ...prev,
            items: prev.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        }));

        const dbUpdates: any = { ...updates };

        // Map camelCase to snake_case for Supabase
        const up = updates as any;
        if ('folderId' in up) {
            dbUpdates.folder_id = up.folderId;
            delete dbUpdates.folderId;
        }

        if ('imageUrl' in up) {
            dbUpdates.image_url = up.imageUrl;
            delete dbUpdates.imageUrl;
        }

        const { error } = await supabase.from(ITEMS_TABLE).update(dbUpdates).eq('id', id).eq('user_id', state.user.id);
        if (error) {
            console.error('Error updating item:', error);
            setState(prev => ({ ...prev, items: previousItems }));
        }
    };

    const deleteItem = async (id: string) => {
        if (!state.user) return;
        const itemToDelete = state.items.find(i => i.id === id);
        if (!itemToDelete) return;

        const previousItems = state.items;
        setState((prev) => ({
            ...prev,
            items: prev.items.filter((i) => i.id !== id),
        }));

        const { error } = await supabase.from(ITEMS_TABLE).delete().eq('id', id).eq('user_id', state.user.id);
        if (error) {
            console.error('Error deleting item:', error);
            setState(prev => ({ ...prev, items: previousItems }));
            return null;
        }
        return itemToDelete;
    };

    const addItemAt = async (item: Item) => {
        if (!state.user) return null;

        const { data: newItem, error } = await supabase.from(ITEMS_TABLE).insert({
            id: item.id,
            user_id: state.user.id,
            type: item.type,
            content: item.content,
            title: item.title,
            favicon: item.favicon,
            image_url: item.image_url,
            color_hex: item.color_hex,
            color_name: item.color_name,
            palette: item.palette,
            folder_id: item.folderId,
            created_at: new Date(item.created_at).toISOString()
        }).select().single();

        if (error) {
            console.error('Error restoring item:', error);
            return null;
        }

        const itemObj: Item = {
            id: newItem.id,
            type: newItem.type as ItemType,
            content: newItem.content,
            title: newItem.title,
            favicon: newItem.favicon,
            image_url: newItem.image_url,
            color_hex: newItem.color_hex,
            color_name: newItem.color_name,
            palette: newItem.palette,
            folderId: newItem.folder_id,
            created_at: new Date(newItem.created_at).getTime()
        };

        setState((prev) => ({
            ...prev,
            items: [itemObj, ...prev.items].sort((a, b) => Number(b.created_at) - Number(a.created_at)),
        }));

        return itemObj;
    };

    const getGroupedItems = (folderId: string) => {
        const folderItems = state.items.filter(i => i.folderId === folderId);
        return {
            text: folderItems.filter(i => i.type === 'text'),
            color: folderItems.filter(i => i.type === 'color'),
            link: folderItems.filter(i => i.type === 'link'),
            image: folderItems.filter(i => i.type === 'image'),
            font: folderItems.filter(i => i.type === 'font'),
        };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setState(initialState);
    };

    const updateMagicPalette = async (folderId: string) => {
        if (!state.user) return;
        setIsGeneratingPalette(true);

        const { toast } = await import('sonner');
        const processingToast = toast.loading('Analyzing images and generating palette...');

        const folderItems = state.items.filter(i => i.folderId === folderId && i.type === 'image');

        // Backfill palettes if missing
        const { extractPaletteFromImage } = await import('@/lib/color-utils');
        let updatedItems = false;

        for (const item of folderItems) {
            if ((!item.palette || item.palette.length === 0) && item.image_url) {
                try {
                    const p = await extractPaletteFromImage(item.image_url);
                    if (p && p.length > 0) {
                        item.palette = p;
                        updatedItems = true;
                        // Silently update DB for this item
                        await supabase.from(ITEMS_TABLE).update({ palette: p }).eq('id', item.id);
                    }
                } catch (e) {
                    console.warn('Backfill failed for image:', item.id, e);
                }
            }
        }

        if (updatedItems) {
            setState(prev => ({ ...prev, items: [...prev.items] }));
        }

        // Helper to check if two colors are similar
        const isClose = (h1: string, h2: string) => {
            const hexToRgb = (hex: string) => {
                const r = parseInt(hex.substring(1, 3), 16);
                const g = parseInt(hex.substring(3, 5), 16);
                const b = parseInt(hex.substring(5, 7), 16);
                return { r, g, b };
            };
            const c1 = hexToRgb(h1);
            const c2 = hexToRgb(h2);
            return Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2)) < 45;
        };

        // Count "votes" per image (cumulative across the folder)
        const colorVotes: Record<string, number> = {};

        folderItems.forEach(item => {
            if (!item.palette) return;

            // For each item, find unique color groups it contributes to
            const itemGroups = new Set<string>();
            item.palette.forEach(hex => {
                const similar = Object.keys(colorVotes).find(c => isClose(c, hex));
                if (similar) {
                    itemGroups.add(similar);
                } else {
                    colorVotes[hex] = 0; // Initialize group
                    itemGroups.add(hex);
                }
            });

            // Each group present in this item gets 1 vote
            itemGroups.forEach(group => {
                colorVotes[group] = (colorVotes[group] || 0) + 1;
            });
        });

        const palette = Object.entries(colorVotes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(e => e[0]);

        if (palette.length === 0) {
            setIsGeneratingPalette(false);
            toast.dismiss(processingToast);
            return;
        }

        setState(prev => ({
            ...prev,
            folders: prev.folders.map(f => f.id === folderId ? { ...f, magic_palette: palette } : f)
        }));

        const { error } = await supabase.from(FOLDERS_TABLE).update({ magic_palette: palette }).eq('id', folderId).eq('user_id', state.user.id);

        setIsGeneratingPalette(false);
        toast.dismiss(processingToast);
        if (error) {
            console.error('Supabase update failed:', error);
            toast.error('Failed to save Magic Palette. (Check if magic_palette column exists in folders table)');
        } else {
            toast.success('Magic Palette generated successfully!');
        }
    };

    return {
        ...state,
        isLoaded,
        addFolder,
        renameFolder,
        updateFolderColor,
        deleteFolder,
        addItem,
        addItemAt,
        updateItem,
        deleteItem,
        updateMagicPalette,
        isGeneratingPalette,
        getGroupedItems,
        logout,
        DEFAULT_FOLDER_ID: state.folders[0]?.id,
        totalCount: state.items.length,
    };
}
