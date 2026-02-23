export interface Folder {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  favicon: string;
  image?: string;
  description?: string;
  folderId: string;
  createdAt: number;
}

export interface AppState {
  folders: Folder[];
  bookmarks: Bookmark[];
}
