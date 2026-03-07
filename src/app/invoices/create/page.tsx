"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
    clientName: z.string().min(1, "Client name is required"),
    clientEmail: z.string().email("Invalid email address"),
    amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
    dueDate: z.string().min(1, "Due date is required"),
    invoiceNumber: z.string().min(1, "Invoice number is required"),
    status: z.enum(["paid", "unpaid"]).default("unpaid"),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateInvoicePage() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        // @ts-expect-error ZodResolver types mismatch with coerce
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: "unpaid",
            invoiceNumber: `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        }
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/invoices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const result = await res.json();
                throw new Error(result.message || "Failed to create invoice");
            }

            router.push("/invoices");
            router.refresh();
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
        <div className="container mx-auto px-4 py-8 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <Link href="/dashboard" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary mb-6 transition-colors bg-secondary/50 px-4 py-2 rounded-full shadow-sm hover:shadow">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Draft Invoice</h1>
                <p className="text-muted-foreground mt-2 font-medium">Fill out the details below to generate a new invoice.</p>
            </div>

            <div className="bg-card p-8 sm:p-10 rounded-3xl border border-border/60 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <Label htmlFor="invoiceNumber" className="text-sm font-bold">Invoice Number</Label>
                            <Input id="invoiceNumber" className="h-11 bg-background/50" {...register("invoiceNumber")} />
                            {errors.invoiceNumber && <p className="text-sm text-destructive">{errors.invoiceNumber.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dueDate" className="text-sm font-bold">Due Date</Label>
                            <Input id="dueDate" type="date" className="h-11 bg-background/50" {...register("dueDate")} />
                            {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate.message}</p>}
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="clientName" className="text-sm font-bold">Client Name</Label>
                            <Input id="clientName" placeholder="Acme Corp" className="h-11 bg-background/50" {...register("clientName")} />
                            {errors.clientName && <p className="text-sm text-destructive">{errors.clientName.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="clientEmail" className="text-sm font-bold">Client Email</Label>
                            <Input id="clientEmail" type="email" placeholder="client@example.com" className="h-11 bg-background/50" {...register("clientEmail")} />
                            {errors.clientEmail && <p className="text-sm text-destructive">{errors.clientEmail.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount" className="text-sm font-bold">Amount ($)</Label>
                            <Input id="amount" type="number" step="0.01" placeholder="0.00" className="h-11 bg-background/50" {...register("amount")} />
                            {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="status" className="text-sm font-bold">Payment Status</Label>
                            <select
                                id="status"
                                className="flex h-11 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                {...register("status")}
                            >
                                <option value="unpaid">Unpaid</option>
                                <option value="paid">Paid</option>
                            </select>
                            {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
                        </div>
                    </div>

                    {error && <div className="p-4 text-sm bg-destructive/10 border border-destructive/20 text-destructive font-medium rounded-xl">{error}</div>}

                    <div className="pt-6 mt-6 border-t border-border/50 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sm:gap-4">
                        <Link href="/invoices" className="w-full sm:w-auto">
                            <Button type="button" variant="outline" className="w-full h-12 px-8 rounded-xl font-semibold">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                            {isLoading ? "Saving..." : "Create Invoice"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
