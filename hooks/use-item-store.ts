'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Item, Folder, ItemType } from '@/types';

const STORAGE_KEY = 'untld-moodboard-storage';
const DEFAULT_FOLDER_ID = 'default-moodboard';

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

    // Load from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed && (parsed.folders || parsed.items)) {
                        setState(parsed);
                    }
                } catch (e) {
                    console.error('Failed to parse storage', e);
                }
            }
            setIsLoaded(true);
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (isLoaded && typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }
    }, [state, isLoaded]);

    const addFolder = (name: string, color?: string) => {
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
        return newFolder;
    };

    const renameFolder = (id: string, name: string) => {
        setState((prev) => ({
            ...prev,
            folders: prev.folders.map((f) => (f.id === id ? { ...f, name } : f)),
        }));
    };

    const updateFolderColor = (id: string, color: string) => {
        setState((prev) => ({
            ...prev,
            folders: prev.folders.map((f) => (f.id === id ? { ...f, color } : f)),
        }));
    };

    const deleteFolder = (id: string) => {
        if (id === DEFAULT_FOLDER_ID) return;
        setState((prev) => ({
            ...prev,
            folders: prev.folders.filter((f) => f.id !== id),
            // Move items to default folder
            items: prev.items.map((i) =>
                i.folderId === id ? { ...i, folderId: DEFAULT_FOLDER_ID } : i
            ),
        }));
    };

    const addItem = async (item: Omit<Item, 'id' | 'created_at'>) => {
        if (state.items.length >= 100) {
            throw new Error('Limit reached: Maximum 100 blocks allowed.');
        }

        const newItem: Item = {
            ...item,
            id: uuidv4(),
            created_at: new Date().toISOString(),
        } as Item;

        setState((prev) => ({
            ...prev,
            items: [newItem, ...prev.items],
        }));
        return newItem;
    };

    const updateItem = (id: string, updates: Partial<Item>) => {
        setState((prev) => ({
            ...prev,
            items: prev.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        }));
    };

    const deleteItem = (id: string) => {
        setState((prev) => ({
            ...prev,
            items: prev.items.filter((i) => i.id !== id),
        }));
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
