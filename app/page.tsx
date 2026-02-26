'use client';

import { useState, useEffect } from 'react';
import { useItemStore } from '@/hooks/use-item-store';
import { ThemeToggle } from '@/components/theme-toggle';
import { UnifiedInput } from '@/components/unified-input';
import { FolderDropdown } from '@/components/folder-dropdown';
import {
  NotesSection,
  ColorsSection,
  LinksSection,
  ImagesSection
} from '@/components/moodboard-sections';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const {
    folders,
    items,
    user,
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
    DEFAULT_FOLDER_ID,
    totalCount
  } = useItemStore();

  const [activeFolderId, setActiveFolderId] = useState(DEFAULT_FOLDER_ID);
  const [linksView, setLinksView] = useState<'grid' | 'list'>('grid');
  const [imagesView, setImagesView] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState<'all' | 'text' | 'color' | 'link' | 'image'>('all');

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login');
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (DEFAULT_FOLDER_ID && !activeFolderId) {
      setActiveFolderId(DEFAULT_FOLDER_ID);
    }
  }, [DEFAULT_FOLDER_ID, activeFolderId]);

  // If the active folder was deleted, switch to default
  if (isLoaded && user && activeFolderId !== DEFAULT_FOLDER_ID && !folders.find(f => f.id === activeFolderId)) {
    setActiveFolderId(DEFAULT_FOLDER_ID);
  }

  const grouped = getGroupedItems(activeFolderId || DEFAULT_FOLDER_ID || '');

  const filters = [
    { id: 'all', label: 'All', count: totalCount },
    { id: 'text', label: 'Notes', count: grouped.text.length },
    { id: 'color', label: 'Colors', count: grouped.color.length },
    { id: 'link', label: 'Links', count: grouped.link.length },
    { id: 'image', label: 'Moodboard', count: grouped.image.length },
  ];

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-4">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
          <div className="max-w-2xl mx-auto">
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const userInitial = user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || '?';
  const userAvatar = user.user_metadata?.avatar_url;

  return (
    <div className="min-h-screen text-foreground pb-32">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-[10px] font-bold uppercase tracking-[0.3em] mr-4 hidden sm:block">Untld</h1>
            <FolderDropdown
              folders={folders}
              activeFolderId={activeFolderId || DEFAULT_FOLDER_ID || ''}
              onSelectFolder={setActiveFolderId}
              onAddFolder={addFolder}
              onRenameFolder={renameFolder}
              onDeleteFolder={deleteFolder}
              onUpdateColor={updateFolderColor}
              defaultFolderId={DEFAULT_FOLDER_ID || ''}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-baseline gap-1.5 px-3 py-1.5 bg-secondary/50 rounded-full border border-border/40">
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Blocks</span>
              <span className={cn(
                "text-[11px] font-mono font-bold",
                totalCount >= 100 ? "text-destructive" : "text-foreground"
              )}>
                {totalCount}/100
              </span>
            </div>

            <ThemeToggle />

            <div className="h-8 w-px bg-border/40 mx-1" />

            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-secondary/50 transition-colors group">
                  <span className="text-[11px] font-bold tracking-tight hidden sm:block">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-secondary border border-border/40 overflow-hidden flex items-center justify-center shrink-0">
                    {userAvatar ? (
                      <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-bold uppercase">{userInitial}</span>
                    )}
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl">
                <div className="px-2 py-2 mb-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Signed in as</p>
                  <p className="text-[11px] font-medium truncate">{user.email}</p>
                </div>
                <div className="h-px bg-border/40 my-1 mx-1" />
                <DropdownMenuItem onClick={logout} className="rounded-xl text-destructive focus:text-destructive gap-2 cursor-pointer">
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="pt-32 max-w-7xl mx-auto px-6 space-y-12">
        {/* Input Section */}
        <div className="max-w-2xl mx-auto w-full space-y-8">
          <UnifiedInput onAdd={(item) => addItem({ ...item, folderId: activeFolderId || DEFAULT_FOLDER_ID || '' })} />

          {/* Filter Bar */}
          <div className="flex items-center justify-center gap-1 border-b border-border/40 pb-4">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as any)}
                className={cn(
                  "px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all",
                  activeFilter === filter.id
                    ? "bg-secondary text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
              >
                {filter.label} <span className="ml-1 opacity-40 font-mono text-[9px]">({filter.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Sections */}
        <div className="space-y-16">
          {/* Row 1: Notes & Colors Split (Only in 'all' or specific filter) */}
          {(activeFilter === 'all' || activeFilter === 'text' || activeFilter === 'color') && (
            <div className={cn(
              activeFilter === 'all' ? "grid grid-cols-1 lg:grid-cols-12 gap-12" : "block"
            )}>
              {(activeFilter === 'all' || activeFilter === 'text') && (
                <div className={cn(activeFilter === 'all' ? "lg:col-span-8" : "w-full")}>
                  <NotesSection
                    items={grouped.text}
                    onDelete={deleteItem}
                    onUpdate={updateItem}
                    hideHeading={true}
                  />
                </div>
              )}
              {(activeFilter === 'all' || activeFilter === 'color') && (
                <div className={cn(activeFilter === 'all' ? "lg:col-span-4" : "w-full max-w-2xl")}>
                  <ColorsSection
                    items={grouped.color}
                    onDelete={deleteItem}
                    hideHeading={true}
                  />
                </div>
              )}
            </div>
          )}

          {/* Row 2: Links */}
          {(activeFilter === 'all' || activeFilter === 'link') && (
            <LinksSection
              items={grouped.link}
              onDelete={deleteItem}
              view={linksView}
              onViewChange={setLinksView}
              hideHeading={true}
            />
          )}

          {/* Row 3: Images */}
          {(activeFilter === 'all' || activeFilter === 'image') && (
            <ImagesSection
              items={grouped.image}
              onDelete={deleteItem}
              view={imagesView}
              onViewChange={setImagesView}
              hideHeading={false}
              palette={Array.from(new Set(grouped.image.flatMap(img => img.palette || []))).slice(0, 5)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
