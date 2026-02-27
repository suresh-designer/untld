'use client';

import { Item } from '@/types';
import { Trash2, ExternalLink, Download, Sparkles, Globe, Copy, Check, LayoutGrid, List, Pencil } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogHeader,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface SectionProps {
    items: Item[];
    onDelete: (id: string) => void;
    onUpdate?: (id: string, updates: Partial<Item>) => void;
    view?: 'grid' | 'list';
    onViewChange?: (view: 'grid' | 'list') => void;
    hideHeading?: boolean;
    palette?: string[];
}

export function NotesSection({ items, onDelete, onUpdate, hideHeading }: SectionProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempContent, setTempContent] = useState<string>('');

    if (items.length === 0) return null;

    const handleEdit = (item: Item) => {
        setEditingId(item.id);
        setTempContent(item.content);
    };

    const handleSave = (id: string) => {
        const el = document.getElementById(`editor-${id}`);
        const content = el?.innerHTML || tempContent;
        onUpdate?.(id, { content });
        setEditingId(null);
    };

    const handleDiscard = () => {
        setEditingId(null);
    };

    const execCommand = (command: string, value?: string) => {
        // Ensure the editor has focus before executing command
        const el = document.getElementById(`editor-${editingId}`);
        if (el) {
            el.focus();
            document.execCommand(command, false, value);
        }
    };

    return (
        <div className="space-y-4 h-full">
            {!hideHeading && <SectionLabel label="Notes" count={items.length} />}
            <div className="grid grid-cols-1 gap-4">
                {items.map(item => (
                    <div key={item.id} className={cn(
                        "group relative bg-muted/30 border border-border/40 rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-muted/40",
                        editingId === item.id ? "ring-2 ring-primary/20 bg-background" : ""
                    )}>
                        {editingId === item.id ? (
                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center gap-1 pb-3 border-b border-border/40">
                                    <button onClick={() => execCommand('bold')} className="p-1.5 hover:bg-muted rounded text-xs px-2 font-bold" title="Bold">B</button>
                                    <button onClick={() => execCommand('italic')} className="p-1.5 hover:bg-muted rounded text-xs px-2 italic" title="Italic">I</button>
                                    <button onClick={() => execCommand('underline')} className="p-1.5 hover:bg-muted rounded text-xs px-2 underline" title="Underline">U</button>
                                </div>
                                <div
                                    id={`editor-${item.id}`}
                                    className="min-h-[100px] outline-none text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none
                                        prose-h1:text-xl prose-h1:font-bold prose-h1:mb-4
                                        prose-ul:list-disc prose-ul:ml-4 prose-ol:list-decimal prose-ol:ml-4
                                        prose-p:mb-2"
                                    contentEditable
                                    dangerouslySetInnerHTML={{ __html: item.content }}
                                />
                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        onClick={handleDiscard}
                                        className="text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 hover:bg-muted rounded-lg transition-colors"
                                    >
                                        Discard
                                    </button>
                                    <button
                                        onClick={() => handleSave(item.id)}
                                        className="text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all shadow-sm"
                                    >
                                        Save Note
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg cursor-pointer"
                                        title="Edit Note"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(item.id)}
                                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-muted rounded-lg cursor-pointer"
                                        title="Delete Note"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                <div
                                    className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none 
                                        prose-h1:text-xl prose-h1:font-bold prose-h1:mb-4
                                        prose-ul:list-disc prose-ul:ml-4 prose-ol:list-decimal prose-ol:ml-4
                                        prose-p:mb-2"
                                    dangerouslySetInnerHTML={{ __html: item.content }}
                                />
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ColorsSection({ items, onDelete, hideHeading }: { items: Item[]; onDelete: (id: string) => void; hideHeading?: boolean }) {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (hex: string, id: string) => {
        navigator.clipboard.writeText(hex);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (items.length === 0) return null;
    return (
        <div className="space-y-4">
            {!hideHeading && <SectionLabel label="Colors" count={items.length} />}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {items.map(item => (
                    <div key={item.id} className="group flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1">
                        <div className="relative aspect-square bg-muted/20 border border-border/40 rounded-xl overflow-hidden hover:shadow-xl transition-all cursor-pointer">
                            <div className="absolute inset-0 z-0" style={{ backgroundColor: item.color_hex || '#000' }} />
                            <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 p-2 transition-opacity">
                                <button
                                    onClick={() => handleCopy(item.color_hex!, item.id)}
                                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg transition-all cursor-pointer"
                                    title="Copy hex"
                                >
                                    {copiedId === item.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </button>
                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-muted/80 rounded-lg transition-all cursor-pointer"
                                    title="Delete color"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="space-y-0.5 px-0.5">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-foreground select-all cursor-pointer">{item.color_hex}</p>
                            <p className="text-[9px] text-muted-foreground truncate uppercase tracking-tight">{item.color_name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function FontsSection({ items, onDelete, hideHeading }: { items: Item[]; onDelete: (id: string) => void; hideHeading?: boolean }) {
    if (items.length === 0) return null;

    return (
        <div className="space-y-4">
            {!hideHeading && <SectionLabel label="Fonts" count={items.length} />}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {items.map(item => (
                    <div key={item.id} className="group relative flex flex-col bg-muted/20 border border-border/40 rounded-xl overflow-hidden transition-all duration-300 hover:bg-muted/30 hover:-translate-y-1 hover:shadow-xl">
                        {/* Aa Preview Square */}
                        <div className="aspect-square flex items-center justify-center p-6 bg-background/5">
                            <span
                                className="text-6xl font-medium tracking-tight select-none"
                                style={{ fontFamily: item.content }}
                            >
                                Aa
                            </span>
                        </div>

                        {/* Labels & Badge */}
                        <div className="p-3 border-t border-border/40 bg-background/20 backdrop-blur-sm flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                                <p className="text-[10px] uppercase font-bold tracking-widest text-foreground truncate">{item.content}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[7px] font-bold uppercase tracking-widest border border-primary/20">
                                        Google Fonts
                                    </div>
                                </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => onDelete(item.id)}
                                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-muted/80 rounded-md transition-all cursor-pointer"
                                    title="Delete font"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function LinksSection({ items, onDelete, hideHeading }: SectionProps) {
    if (items.length === 0) return null;

    return (
        <div className="space-y-4">
            {!hideHeading && <SectionLabel label="Links" count={items.length} />}

            <div className="space-y-2">
                {items.map(item => {
                    const domain = new URL(item.content).hostname;
                    return (
                        <div
                            key={item.id}
                            className="group flex items-center gap-4 bg-muted/20 border border-border/20 p-3 rounded-xl hover:bg-muted/30 hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer relative"
                            onClick={() => window.open(item.content, '_blank')}
                        >
                            {item.favicon ? <img src={item.favicon} alt="" className="h-4 w-4 shrink-0" /> : <Globe className="h-4 w-4 text-muted-foreground shrink-0" />}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium truncate">{item.title || item.content}</h3>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-tight">{domain}</p>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(item.id);
                                    }}
                                    className="p-2 text-muted-foreground hover:text-destructive cursor-pointer"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function ImagesSection({
    items,
    onDelete,
    view,
    onViewChange,
    hideHeading,
    palette,
    onMagicPalette,
    magicPalette,
    isGenerating
}: {
    items: Item[];
    onDelete: (id: string) => void;
    view?: 'grid' | 'list';
    onViewChange?: (view: 'grid' | 'list') => void;
    hideHeading?: boolean;
    palette?: string[];
    onMagicPalette?: () => void;
    magicPalette?: string[];
    isGenerating?: boolean;
}) {
    const [selectedImage, setSelectedImage] = useState<Item | null>(null);

    const handleDownload = async (item: Item) => {
        try {
            const res = await fetch(item.image_url!);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const filename = item.image_url!.split('/').pop()?.split('?')[0] || 'image';
            a.download = filename.includes('.') ? filename : `${filename}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch {
            window.open(item.image_url, '_blank');
        }
    };

    if (items.length === 0) return null;

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            {!hideHeading && <SectionLabel label="Moodboard" count={items.length} />}

                            <div className="flex items-center gap-4">
                                {/* Magic Palette Display */}
                                {isGenerating ? (
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full border border-primary/10 overflow-hidden relative">
                                        <div className="absolute inset-0 animate-shimmer" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-primary/60 mr-1 italic relative z-10">Generating...</span>
                                        <div className="flex gap-1 relative z-10">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className="h-3 w-3 rounded-full bg-primary/10" />
                                            ))}
                                        </div>
                                    </div>
                                ) : magicPalette && magicPalette.length > 0 && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full border border-primary/10">
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-primary/60 mr-1 italic">Magic Palette</span>
                                        <SectionPalette colors={magicPalette} />
                                    </div>
                                )}

                                {/* Generate Button */}
                                <button
                                    onClick={onMagicPalette}
                                    disabled={isGenerating}
                                    className={cn(
                                        "group/magic flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-full border border-border/40 transition-all cursor-pointer",
                                        isGenerating ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary"
                                    )}
                                    title="Generate Magic Palette from images"
                                >
                                    <Sparkles className={cn(
                                        "h-3.5 w-3.5 text-primary transition-transform",
                                        isGenerating ? "animate-sparkle-spin" : "group-hover/magic:scale-110"
                                    )} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover/magic:text-foreground">Magic Palette</span>
                                </button>
                            </div>
                        </div>
                        <ViewToggle view={view || 'grid'} onChange={onViewChange!} />
                    </div>
                </div>

                {view === 'grid' ? (
                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                        {items.map(item => (
                            <div key={item.id} className="group flex flex-col break-inside-avoid rounded-xl overflow-hidden border border-border/40 hover:shadow-lg transition-all bg-card">
                                <div className="relative">
                                    <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const res = await fetch(item.image_url!);
                                                    const blob = await res.blob();
                                                    const url = window.URL.createObjectURL(blob);
                                                    const a = document.createElement('a');
                                                    a.href = url;
                                                    a.download = `image-${item.id}.jpg`;
                                                    a.click();
                                                } catch { window.open(item.image_url, '_blank') }
                                            }}
                                            className="p-2 bg-background/80 backdrop-blur-sm rounded-lg text-muted-foreground hover:text-primary transition-all cursor-pointer"
                                        >
                                            <Download className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => onDelete(item.id)} className="p-2 bg-background/80 backdrop-blur-sm rounded-lg text-muted-foreground hover:text-destructive transition-all cursor-pointer">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div
                                        className="cursor-pointer group-hover:opacity-100 transition-opacity"
                                        onClick={() => setSelectedImage(item)}
                                    >
                                        <img src={item.image_url!} alt="" className="w-full h-auto block transform group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
                                    </div>
                                </div>

                                {item.palette && item.palette.length > 0 && (
                                    <div className="p-3 border-t border-border/40 bg-muted/5">
                                        <SectionPalette colors={item.palette} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                        {items.map(item => (
                            <div key={item.id} className="group flex flex-col bg-card border border-border/20 rounded-xl overflow-hidden transition-all">
                                <div className="relative aspect-square overflow-hidden bg-muted/20">
                                    <div
                                        className="w-full h-full cursor-pointer"
                                        onClick={() => setSelectedImage(item)}
                                    >
                                        <img src={item.image_url!} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
                                        <button onClick={() => onDelete(item.id)} className="p-2 text-muted-foreground hover:text-destructive cursor-pointer">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => window.open(item.image_url, '_blank')}
                                            className="p-2 text-muted-foreground hover:text-foreground cursor-pointer"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                {item.palette && item.palette.length > 0 && (
                                    <div className="p-2 border-t border-border/40 bg-muted/5">
                                        <SectionPalette colors={item.palette.slice(0, 4)} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
                <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent shadow-none flex items-center justify-center overflow-hidden outline-none">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Image Preview</DialogTitle>
                    </DialogHeader>
                    {selectedImage && (
                        <div className="relative group/modal max-w-full max-h-full flex items-center justify-center">
                            <img
                                src={selectedImage.image_url!}
                                alt=""
                                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl transition-all"
                            />
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 bg-background/80 backdrop-blur-xl border border-border/40 rounded-2xl opacity-0 group-hover/modal:opacity-100 transition-all shadow-xl">
                                <button
                                    onClick={() => handleDownload(selectedImage)}
                                    className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest px-4 py-2 hover:bg-muted rounded-lg transition-all cursor-pointer"
                                >
                                    <Download className="h-4 w-4" /> Download Original
                                </button>
                                <div className="w-px h-4 bg-border/40" />
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="text-[10px] uppercase font-bold tracking-widest px-4 py-2 hover:bg-muted rounded-lg transition-all cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

function SectionPalette({ colors }: { colors: string[] }) {
    const [copiedColor, setCopiedColor] = useState<string | null>(null);

    const handleCopy = (hex: string) => {
        navigator.clipboard.writeText(hex);
        setCopiedColor(hex);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    return (
        <div className="flex items-center gap-2">
            {colors.map((hex, i) => (
                <button
                    key={`${hex}-${i}`}
                    onClick={() => handleCopy(hex)}
                    className="group/swatch relative h-5 w-5 rounded-full border border-border/20 shadow-sm transition-all hover:scale-125 cursor-pointer outline-none focus:ring-1 focus:ring-primary/40 active:scale-95"
                    style={{ backgroundColor: hex }}
                >
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[8px] font-bold px-1.5 py-0.5 rounded shadow-lg opacity-0 group-hover/swatch:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none uppercase tracking-tighter">
                        {hex}
                    </div>
                    {copiedColor === hex && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-foreground text-background text-[7px] font-bold px-1 py-0.5 rounded shadow-lg whitespace-nowrap z-50 animate-in fade-in zoom-in duration-200">
                            COPIED
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
}

function SectionLabel({ label, count }: { label: string; count: number }) {
    return (
        <div className="flex items-center gap-3 px-1">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{label}</h2>
            <div className="h-[1px] flex-1 bg-border/40" />
            <span className="text-[10px] font-mono text-muted-foreground/40">{count}</span>
        </div>
    );
}

function EmptyState({ label }: { label: string }) {
    return (
        <div className="space-y-4 opacity-40">
            <SectionLabel label={label} count={0} />
            <div className="py-8 flex flex-col items-center justify-center border border-dashed border-border/60 rounded-2xl">
                <p className="text-[10px] uppercase font-bold tracking-widest">No {label.toLowerCase()} yet</p>
            </div>
        </div>
    );
}

function ViewToggle({ view, onChange }: { view: 'grid' | 'list'; onChange: (v: 'grid' | 'list') => void }) {
    return (
        <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border/20">
            <button
                onClick={() => onChange('list')}
                className={cn("p-1.5 rounded-md transition-all", view === 'list' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
                <List className="h-3 w-3" />
            </button>
            <button
                onClick={() => onChange('grid')}
                className={cn("p-1.5 rounded-md transition-all", view === 'grid' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
                <LayoutGrid className="h-3 w-3" />
            </button>
        </div>
    );
}
