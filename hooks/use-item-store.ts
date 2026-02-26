'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Item, Folder, ItemType } from '@/types';
import { supabase } from '@/lib/supabase';

const FOLDERS_TABLE = 'folders';
const ITEMS_TABLE = 'moodboard_items';
const DEFAULT_FOLDER_NAME = 'Bookmarks';

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

        if (state.items.length >= 100) {
            throw new Error('Limit reached: Maximum 100 blocks allowed.');
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
        if (updates.folderId) {
            dbUpdates.folder_id = updates.folderId;
            delete dbUpdates.folderId;
        }

        // Specifically mapping for any other fields that might be camelCase
        if (updates.imageUrl) {
            dbUpdates.image_url = updates.imageUrl;
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
        const previousItems = state.items;
        setState((prev) => ({
            ...prev,
            items: prev.items.filter((i) => i.id !== id),
        }));

        const { error } = await supabase.from(ITEMS_TABLE).delete().eq('id', id).eq('user_id', state.user.id);
        if (error) {
            console.error('Error deleting item:', error);
            setState(prev => ({ ...prev, items: previousItems }));
        }
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

    const logout = async () => {
        await supabase.auth.signOut();
        setState(initialState);
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
        logout,
        DEFAULT_FOLDER_ID: state.folders[0]?.id,
        totalCount: state.items.length,
    };
}
