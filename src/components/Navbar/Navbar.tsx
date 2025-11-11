"use client";

import { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const headerRef = useRef<HTMLElement | null>(null);
    const toggle = () => setOpen((v) => !v);
    const close = () => setOpen(false);

    const { signOut } = useAuth();
    const navigate = useNavigate();

    const onClick = async () => {
        await signOut();
        navigate("/login", { replace: true });
    };

    // Close when screen expands to desktop
    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 993) setOpen(false);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // Close on outside click (only when menu is open)
    useEffect(() => {
        if (!open) return;

        const onClick = (e: MouseEvent) => {
            const root = headerRef.current;
            if (!root) return;
            // If click is outside the header (which contains button + menu), close it
            if (!root.contains(e.target as Node)) setOpen(false);
        };

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("click", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("click", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <header className="navbarWrapper" ref={headerRef}>
            <div className="brand">
                <Link to="/">
                    <img
                        src="/images/cleaning-tools.png"
                        alt="This is company's logo"
                        width={42}
                        height={42}
                    />
                </Link>
            </div>

            {/* Desktop links */}
            <nav className="navButtonsWrapper" aria-label="Main">
                <Link className="navButton" to="/">
                    Home
                </Link>
                <Link className="navButton" to="/ueber-uns">
                    Über uns
                </Link>
                <Link className="navButton" to="/dienstleistungen">
                    Dienstleistungen
                </Link>
                <Link className="navButton" to="/" onClick={onClick}>
                    Logout
                </Link>
            </nav>

            {/* Hamburger (visible < 993px via CSS) */}
            <button
                className="hamburger"
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-controls="mobile-menu"
                aria-expanded={open}
                onClick={(e) => {
                    e.stopPropagation(); // prevent outside-click handler from firing
                    toggle();
                }}
            >
                <svg
                    className="hamburgerIcon"
                    viewBox="0 0 24 24"
                    width="26"
                    height="26"
                    aria-hidden="true"
                >
                    <path
                        d="M3 6h18M3 12h18M3 18h18"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                    />
                </svg>
            </button>

            {/* Mobile menu */}
            <nav
                id="mobile-menu"
                className={`mobileMenu ${open ? "open" : ""}`}
                aria-label="Mobile"
                aria-hidden={!open}
                onClick={(e) => e.stopPropagation()}
            >
                <Link className="mobileLink" to="/" onClick={close}>
                    Home
                </Link>
                {/* <Link className="mobileLink" to="/ueber-uns" onClick={close}>
                    Über uns
                </Link>
                <Link className="mobileLink" to="/leistungen" onClick={close}>
                    Leistungen
                </Link> */}
                <Link className="mobileLink" to="/" onClick={onClick}>
                    Logout
                </Link>
            </nav>

            {/* Backdrop (click to close) */}
            {open && (
                <div className="scrim" onClick={close} aria-hidden="true" />
            )}
        </header>
    );
}
