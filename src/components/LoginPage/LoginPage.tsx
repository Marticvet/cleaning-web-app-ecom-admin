import * as React from "react";
import "./LoginPage.css";
// If you're using Supabase, uncomment below and wire it up.
// import { supabase } from "@/supabaseClient";

export default function LoginPage() {
    const [showPw, setShowPw] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrorMsg(null);
        setLoading(true);

        const form = new FormData(e.currentTarget);

        console.log(form, `form`);
        

        // const email = (form.get("email") as string)?.trim();
        // const password = (form.get("password") as string) ?? "";

        // try {
        //     // ---- Example with Supabase auth ----
        //     // const { error } = await supabase.auth.signInWithPassword({ email, password });
        //     // if (error) throw error;

        //     // Simulate success for now:
        //     await new Promise((r) => setTimeout(r, 700));
        //     // redirect or navigate here
        //     // location.href = "/";
        //     console.log("Signed in:", email);
        // } catch (err) {
        //     // setErrorMsg(err?.message || "Login failed. Please try again.");
        // } finally {
        //     setLoading(false);
        // }
    }

    return (
        <div className="loginPageContainer">
            <div
                className="loginCard"
                role="dialog"
                aria-labelledby="login_title"
                aria-describedby="login_desc"
            >
                <header className="loginHeader">
                    <h1 id="login_title">Welcome back</h1>
                    <p id="login_desc">Sign in to manage your dashboard.</p>
                </header>

                <form className="loginForm" onSubmit={onSubmit} noValidate>
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="password">Password</label>
                        <div className="pwWrap">
                            <input
                                id="password"
                                name="password"
                                type={showPw ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                className="pwToggle"
                                aria-label={
                                    showPw ? "Hide password" : "Show password"
                                }
                                onClick={() => setShowPw((s) => !s)}
                            >
                                {showPw ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <div className="row">
                        <label className="checkbox">
                            <input type="checkbox" name="remember" />{" "}
                            <span>Remember me</span>
                        </label>
                    </div>

                    {errorMsg && (
                        <div
                            className="error"
                            role="alert"
                            aria-live="assertive"
                        >
                            {errorMsg}
                        </div>
                    )}

                    <button
                        className="submitBtn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Signing in…" : "Sign in"}
                    </button>
                </form>
            </div>
        </div>
    );
}
