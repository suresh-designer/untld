'use client';

import { useState, useMemo } from 'react';
import { useBookmarkStore } from '@/hooks/use-bookmark-store';
import { FolderDropdown } from '@/components/folder-dropdown';
import { ThemeToggle } from '@/components/theme-toggle';
import { TopBar } from '@/components/top-bar';
import { BookmarkInput } from '@/components/bookmark-input';
import { BookmarkItem } from '@/components/bookmark-item';
import { EditBookmarkDialog } from '@/components/edit-bookmark-dialog';
import { Bookmark } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Bookmark as BookmarkIcon } from 'lucide-react';

export default function Home() {
  const {
    folders,
    bookmarks,
    addFolder,
    renameFolder,
    updateFolderColor,
    deleteFolder,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    isLoaded,
    DEFAULT_FOLDER_ID,
  } = useBookmarkStore();

  const [activeFolderId, setActiveFolderId] = useState(DEFAULT_FOLDER_ID);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((b) => {
      const matchesFolder = b.folderId === activeFolderId;
      const matchesSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.description && b.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesFolder && matchesSearch;
    });
  }, [bookmarks, activeFolderId, searchQuery]);

  // If the active folder was deleted, switch to default
  if (isLoaded && activeFolderId !== DEFAULT_FOLDER_ID && !folders.find(f => f.id === activeFolderId)) {
    setActiveFolderId(DEFAULT_FOLDER_ID);
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Header Area */}
      <header className="p-6 pb-2 max-w-6xl mx-auto w-full flex items-center justify-between">
        <FolderDropdown
          folders={folders}
          activeFolderId={activeFolderId}
          onSelectFolder={setActiveFolderId}
          onAddFolder={addFolder}
          onRenameFolder={renameFolder}
          onDeleteFolder={deleteFolder}
          onUpdateColor={updateFolderColor}
          defaultFolderId={DEFAULT_FOLDER_ID}
        />
        <ThemeToggle />
      </header>

      <main className="flex flex-col pb-24">
        <div className="p-6 pt-12 pb-4 max-w-6xl mx-auto w-full">
          <div className="mb-16 max-w-2xl mx-auto w-full">
            <BookmarkInput
              onAdd={addBookmark}
              activeFolderId={activeFolderId}
            />
          </div>

          <TopBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            view={view}
            onViewChange={setView}
          />
        </div>

        <div className="flex-1 px-6 pb-12">
          <div className="max-w-6xl mx-auto w-full">
            {filteredBookmarks.length > 0 ? (
              <div className={
                view === 'grid'
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-1"
              }>
                {filteredBookmarks.map((bookmark) => (
                  <BookmarkItem
                    key={bookmark.id}
                    bookmark={bookmark}
                    view={view}
                    onDelete={deleteBookmark}
                    onEdit={setEditingBookmark}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 opacity-30 select-none">
                <BookmarkIcon className="h-12 w-12 mb-4" />
                <p className="text-sm font-medium">No bookmarks found</p>
                <p className="text-xs">Try adding one or change your folder</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <EditBookmarkDialog
        bookmark={editingBookmark}
        isOpen={!!editingBookmark}
        onClose={() => setEditingBookmark(null)}
        onSave={(id, updates) => {
          updateBookmark(id, updates);
          setEditingBookmark(null);
        }}
      />
    </div>
  );
}
