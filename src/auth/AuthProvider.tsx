// src/auth/AuthProvider.tsx
import * as React from "react";
import { supabase } from "../supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
    loading: boolean;
    session: Session | null;
    user: User | null;
    isAuthed: boolean;
    isAdmin: boolean | null; // NEW
    signInWithPassword: (email: string, password: string) => Promise<Error | null>;
    signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = React.useState<Session | null>(null);
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null); // NEW

    async function refreshAdminFlag(uid?: string | null) {
        if (!uid) {
            setIsAdmin(null);
            return;
        }
        const { data, error } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", uid)
            .maybeSingle();
        setIsAdmin(error ? null : Boolean(data?.is_admin));
    }

    React.useEffect(() => {
        // Initial session fetch
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session ?? null);
            setUser(data.session?.user ?? null);
            refreshAdminFlag(data.session?.user?.id);
            setLoading(false); // <-- ALWAYS end loading, even if no session
        });

        // Subscribe to auth changes
        const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
            setSession(s);
            setUser(s?.user ?? null);
            refreshAdminFlag(s?.user?.id);
            setLoading(false);
        });
        return () => sub.subscription.unsubscribe();
    }, []);

    async function signInWithPassword(email: string, password: string) {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        return error;
    }

    async function signOut() {
        await supabase.auth.signOut();
    }

    const value: AuthContextType = {
        loading,
        session,
        user,
        isAuthed: !!user,
        isAdmin, // NEW
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
