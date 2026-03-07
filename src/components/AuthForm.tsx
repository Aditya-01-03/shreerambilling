"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof formSchema>;

interface AuthFormProps {
    type: "login" | "signup";
}

export function AuthForm({ type }: AuthFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        setError(null);

        try {
            if (type === "signup") {
                const res = await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });

                if (!res.ok) {
                    const result = await res.json();
                    throw new Error(result.message || "Something went wrong");
                }

                // Auto login after signup
                const signInRes = await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    redirect: false,
                });

                if (signInRes?.error) {
                    throw new Error(signInRes.error);
                }

                router.push("/dashboard");
                router.refresh();
            } else {
                const signInRes = await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    redirect: false,
                });

                if (signInRes?.error) {
                    throw new Error("Invalid email or password");
                }

                router.push("/dashboard");
                router.refresh();
            }
        } catch (err: Omit<Error, "message"> | unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 sm:p-10 space-y-8 bg-card/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-primary"></div>

            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                    {type === "login" ? "Welcome back" : "Create an account"}
                </h1>
                <p className="text-sm text-muted-foreground font-medium">
                    {type === "login"
                        ? "Enter your credentials to access your dashboard"
                        : "Enter your details to generate your invoices"}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                    <Input id="email" type="email" placeholder="hello@company.com" className="h-11 bg-background/50" {...register("email")} />
                    {errors.email && <p className="text-sm text-destructive font-medium">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                    <Input id="password" type="password" className="h-11 bg-background/50" {...register("password")} />
                    {errors.password && <p className="text-sm text-destructive font-medium">{errors.password.message}</p>}
                </div>

                {error && <div className="p-3 text-sm bg-destructive/15 text-destructive rounded-lg border border-destructive/20">{error}</div>}

                <Button type="submit" className="w-full h-11 text-base font-semibold transition-all shadow-md hover:shadow-lg" disabled={isLoading}>
                    {isLoading ? "Please wait..." : type === "login" ? "Sign In" : "Sign Up"}
                </Button>
            </form>
        </div>
    );
}
