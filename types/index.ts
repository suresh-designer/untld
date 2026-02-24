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
  type: 'link' | 'image' | 'color';
  colorName?: string;
}

export interface AppState {
  folders: Folder[];
  bookmarks: Bookmark[];
}

export type NoteType = 'text' | 'h1' | 'h2' | 'h3' | 'bullet';

export interface NoteBlock {
  id: string;
  user_id?: string;
  content: string;
  type: NoteType;
  order: number;
  created_at?: string;
}

export type ItemType = 'text' | 'color' | 'link' | 'image';

export interface Item {
  id: string;
  user_id?: string;
  type: ItemType;
  content: string;
  title?: string;
  favicon?: string;
  image_url?: string;
  color_hex?: string;
  color_name?: string;
  palette?: string[]; // Extracted palette for images
  folderId: string;
  created_at?: string | number;
}
