'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Bookmark, Folder, AppState } from '@/types';

const STORAGE_KEY = 'minimal-bookmarks-storage';
const DEFAULT_FOLDER_ID = 'default-bookmarks';

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

const getRandomColor = () => FOLDER_COLORS[Math.floor(Math.random() * FOLDER_COLORS.length)];

const initialState: AppState = {
    folders: [
        {
            id: DEFAULT_FOLDER_ID,
            name: 'Bookmarks',
            color: '#22c55e',
            createdAt: Date.now(),
        },
    ],
    bookmarks: [],
};

export function useBookmarkStore() {
    const [state, setState] = useState<AppState>(initialState);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed && (parsed.folders || parsed.bookmarks)) {
                        // Migration: Add color to folders that don't have one
                        const migratedFolders = parsed.folders.map((f: any) => ({
                            ...f,
                            color: f.color || getRandomColor(),
                        }));
                        setState({ ...parsed, folders: migratedFolders });
                        console.log('Storage loaded & migrated:', parsed);
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
            console.log('Storage saved:', state);
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
            // Move bookmarks to default folder
            bookmarks: prev.bookmarks.map((b) =>
                b.folderId === id ? { ...b, folderId: DEFAULT_FOLDER_ID } : b
            ),
        }));
    };

    const addBookmark = (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
        const newBookmark: Bookmark = {
            ...bookmark,
            id: uuidv4(),
            createdAt: Date.now(),
        };
        setState((prev) => ({
            ...prev,
            bookmarks: [newBookmark, ...prev.bookmarks],
        }));
        return newBookmark;
    };

    const updateBookmark = (id: string, updates: Partial<Bookmark>) => {
        setState((prev) => ({
            ...prev,
            bookmarks: prev.bookmarks.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        }));
    };

    const deleteBookmark = (id: string) => {
        setState((prev) => ({
            ...prev,
            bookmarks: prev.bookmarks.filter((b) => b.id !== id),
        }));
    };

    return {
        ...state,
        addFolder,
        renameFolder,
        updateFolderColor,
        deleteFolder,
        addBookmark,
        updateBookmark,
        deleteBookmark,
        isLoaded,
        DEFAULT_FOLDER_ID,
    };
}
