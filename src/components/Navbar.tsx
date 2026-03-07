"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";

export function Navbar() {
    const { data: session } = useSession();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="text-primary flex items-center justify-center p-1.5 bg-primary/10 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        </div>
                        <div className="font-bold flex flex-col justify-center">
                            <span className="text-foreground text-lg tracking-tight leading-tight">Billing</span>
                            <span className="text-[0.65rem] md:text-xs font-medium text-muted-foreground whitespace-nowrap leading-tight">
                                भरोसे का दूसरा नाम — Shreeram Hightech Nursery
                            </span>
                        </div>
                    </Link>
                </div>

                <nav className="flex items-center space-x-2 sm:space-x-4">
                    {session ? (
                        <>
                            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                                Dashboard
                            </Link>
                            <Link href="/invoices" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                                Invoices
                            </Link>
                            <Button variant="ghost" size="sm" onClick={() => signOut()}>
                                Log out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm">Log in</Button>
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
