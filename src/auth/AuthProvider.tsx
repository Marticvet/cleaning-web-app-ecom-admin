// src/auth/AuthProvider.tsx
import * as React from "react";
import { supabase } from "../supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
    loading: boolean;
    session: Session | null;
    user: User | null;
    isAuthed: boolean;
    isAdmin: boolean | null;
    signInWithPassword: (
        email: string,
        password: string
    ) => Promise<Error | null>;
    signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = React.useState<Session | null>(null);
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);

    // abortable admin fetch (prevents setting state after user switches/unmount)
    const adminAbortRef = React.useRef<AbortController | null>(null);

    const resetState = React.useCallback(() => {
        setSession(null);
        setUser(null);
        setIsAdmin(null);
        setLoading(false);
        localStorage.clear();
    }, []);

    const logoutAndReset = React.useCallback(async () => {
        try {
            localStorage.clear();
            await supabase.auth.signOut();
        } finally {
            // always reset locally, even if supabase throws
            resetState();
        }
    }, [resetState]);

    async function refreshAdminFlag(uid?: string | null) {
        // cancel any in-flight admin fetch
        adminAbortRef.current?.abort();
        adminAbortRef.current = new AbortController();
        const signal = adminAbortRef.current.signal;

        if (!uid) {
            setIsAdmin(null);
            return;
        }
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("is_admin")
                .eq("id", uid)
                .maybeSingle();

            if (signal.aborted) return;
            if (error) {
                setIsAdmin(null);
            } else {
                setIsAdmin(Boolean(data?.is_admin));
            }
        } catch {
            if (!signal.aborted) setIsAdmin(null);
        }
    }

    React.useEffect(() => {
        let mounted = true;

        // Initial session
        supabase.auth.getSession().then(({ data }) => {
            if (!mounted) return;
            setSession(data.session ?? null);
            setUser(data.session?.user ?? null);
            refreshAdminFlag(data.session?.user?.id);
            setLoading(false);
        });

        // Subscribe to auth changes
        const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
            setSession(s ?? null);
            setUser(s?.user ?? null);
            refreshAdminFlag(s?.user?.id);

            if (event === "SIGNED_OUT") {
                // refresh failed or explicit logout
                setIsAdmin(null);
                localStorage.clear();
            }
            setLoading(false);
        });

        // Optional: when tab becomes visible after a long idle, ask Supabase for a fresh session
        const onVisible = async () => {
            if (document.visibilityState === "visible") {
                const { data } = await supabase.auth.getSession();
                setSession(data.session ?? null);
                setUser(data.session?.user ?? null);
                refreshAdminFlag(data.session?.user?.id);
            }
        };
        document.addEventListener("visibilitychange", onVisible);

        return () => {
            mounted = false;
            sub.subscription.unsubscribe();
            document.removeEventListener("visibilitychange", onVisible);
            adminAbortRef.current?.abort();
        };
    }, []);

    async function signInWithPassword(email: string, password: string) {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return error ?? null; // return null on success
    }

    async function signOut() {
        await logoutAndReset();
        localStorage.clear();
        // no navigate here → ProtectedRoute / LogoutRoute handles where to go
    }

    const value: AuthContextType = {
        loading,
        session,
        user,
        isAuthed: !!user,
        isAdmin,
        signInWithPassword,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const ctx = React.useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
    return ctx;
}
