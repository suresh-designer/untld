'use client';

import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, Github, Chrome } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push('/');
            }
        };
        checkUser();
    }, [router]);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        });
        if (error) {
            console.error('Login error:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (authMode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push('/');
            } else if (authMode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: window.location.origin,
                    }
                });
                if (error) throw error;
                setMessage('Check your email for the confirmation link!');
            } else if (authMode === 'forgot') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/login?type=recovery`,
                });
                if (error) throw error;
                setMessage('Password reset link sent to your email!');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during authentication');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background selection:bg-primary/10">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight py-2 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">Untld</h1>
                    <p className="text-muted-foreground text-[11px] uppercase tracking-[0.2em] font-medium px-4">
                        {authMode === 'forgot' ? 'Reset your password' : 'Paste anything. Build your design moodboard instantly.'}
                    </p>
                </div>

                <div className="bg-card/50 border border-border/40 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-sm space-y-6">
                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        <div className="space-y-1">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 pl-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {authMode !== 'forgot' && (
                            <div className="space-y-1">
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 pl-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {error && (
                            <p className="text-[10px] text-destructive font-bold uppercase tracking-wider text-center">{error}</p>
                        )}
                        {message && (
                            <p className="text-[10px] text-primary font-bold uppercase tracking-wider text-center">{message}</p>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg hover:shadow-xl transition-all"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> :
                                authMode === 'login' ? 'Sign In' :
                                    authMode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                        </Button>
                    </form>

                    <div className="flex items-center justify-between px-1">
                        <button
                            type="button"
                            onClick={() => {
                                setAuthMode(authMode === 'login' ? 'signup' : 'login');
                                setError(null);
                                setMessage(null);
                            }}
                            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {authMode === 'login' ? 'Create Account' : 'Back to Login'}
                        </button>
                        {authMode === 'login' && (
                            <button
                                type="button"
                                onClick={() => setAuthMode('forgot')}
                                className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Forgot?
                            </button>
                        )}
                    </div>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border/40" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em]">
                            <span className="bg-card/50 px-4 text-muted-foreground/40">OR</span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        variant="outline"
                        className="w-full h-12 rounded-2xl font-bold uppercase tracking-widest text-[10px] border-border/40 hover:bg-muted/50 transition-all gap-3"
                    >
                        <Chrome className="h-4 w-4" />
                        Continue with Google
                    </Button>
                </div>
            </div>
        </div>
    );
}
