import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Leaf } from "lucide-react";
import { format } from "date-fns";

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const invoice = await prisma.invoice.findUnique({
        where: { id: params.id },
    });

    if (!invoice || invoice.userId !== session.user.id) {
        return (
            <div className="container mx-auto p-8 text-center bg-card rounded-2xl border border-border/50 max-w-md mt-20">
                <h1 className="text-2xl font-bold text-foreground">Invoice not found</h1>
                <p className="text-muted-foreground mt-2">The invoice you are looking for does not exist or you lack permission to view it.</p>
                <Link href="/invoices">
                    <Button className="mt-6 w-full">Return to Invoices</Button>
                </Link>
            </div>
        );
    }

    const isPaid = invoice.status === "paid";

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl flex-1 flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 print:hidden">
                <Link href="/invoices" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors bg-secondary/50 px-4 py-2 rounded-full hover:shadow-sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Invoices
                </Link>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none h-11 px-6 font-semibold rounded-xl">
                        <ExternalLink className="mr-2 h-4 w-4" /> Share
                    </Button>
                    {/* Note: In a real app print function would call window.print() */}
                    <Button className="flex-1 sm:flex-none h-11 px-6 shadow-md font-semibold rounded-xl" onClick={() => window.print()} type="button" dangerouslySetInnerHTML={{ __html: `<svg class="mr-2 h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg> Print Invoice` }} />
                </div>
            </div>

            <div className="bg-card rounded-3xl border border-border/50 shadow-2xl overflow-hidden print:shadow-none print:border-none print:p-0">
                <div className="p-8 sm:p-12 md:p-16 border-b border-border/30 bg-gradient-to-br from-background to-secondary/20 relative overflow-hidden">
                    {/* Decorative shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

                    <div className="flex flex-col sm:flex-row justify-between items-start gap-8 relative z-10">
                        <div>
                            <h1 className="text-5xl font-black tracking-tighter text-foreground mb-3">INVOICE</h1>
                            <p className="text-xl font-bold text-muted-foreground mr-2">#{invoice.invoiceNumber}</p>
                        </div>
                        <div className="text-left sm:text-right">
                            <div className="font-bold text-xl flex flex-col sm:items-end justify-end">
                                <div className="text-primary flex items-center justify-center p-2 bg-primary/10 rounded-xl mb-3 w-fit sm:ml-auto shadow-sm">
                                    <Leaf className="w-8 h-8 text-primary" />
                                </div>
                                <span className="text-foreground text-2xl tracking-tight leading-tight">Shreeram Hightech Nursery</span>
                            </div>
                            <p className="text-sm font-medium text-muted-foreground mt-2 max-w-[200px] sm:max-w-none">
                                भरोसे का दूसरा नाम — Nurturing Nature
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 sm:p-12 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-12 bg-card relative z-10">
                    <div className="space-y-6">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 border-b border-border/50 pb-2 w-fit">Bill To</p>
                            <p className="text-2xl font-extrabold text-foreground">{invoice.clientName}</p>
                            <p className="text-primary font-medium mt-1">{invoice.clientEmail}</p>
                        </div>
                    </div>

                    <div className="space-y-6 flex flex-col md:items-end">
                        <div className="w-full md:w-auto max-w-xs space-y-4">
                            <div className="flex justify-between md:justify-end md:gap-8 items-center border-b border-border/50 pb-2">
                                <span className="text-sm font-bold text-muted-foreground">Date:</span>
                                <span className="font-semibold text-foreground">{format(new Date(invoice.createdAt), 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex justify-between md:justify-end md:gap-8 items-center border-b border-border/50 pb-2">
                                <span className="text-sm font-bold text-muted-foreground">Due By:</span>
                                <span className="font-bold text-destructive">{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="bg-secondary/30 p-4 rounded-xl border border-secondary">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Status</p>
                                <div className={`inline-flex px-4 py-1.5 text-sm font-black tracking-wide rounded-full shadow-sm ${isPaid ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30' : 'bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30'}`}>
                                    {invoice.status.toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 sm:p-12 md:p-16 bg-muted/20 border-t border-border/50">
                    <div className="bg-card rounded-2xl shadow-sm border border-border/40 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-muted/50 border-b border-border/50">
                                <tr>
                                    <th className="py-4 px-6 font-bold text-muted-foreground uppercase tracking-widest text-xs w-[70%]">Description</th>
                                    <th className="py-4 px-6 font-bold text-muted-foreground uppercase tracking-widest text-xs text-right w-[30%]">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                <tr className="hover:bg-muted/10 transition-colors">
                                    <td className="py-6 px-6 text-foreground font-semibold">Professional Services & Items</td>
                                    <td className="py-6 px-6 text-xl font-bold text-foreground text-right">${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <div className="w-full sm:w-1/2 md:w-2/5 lg:w-1/3 bg-card p-6 rounded-2xl border border-border/50 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                            <div className="flex justify-between items-center relative z-10">
                                <span className="font-bold text-muted-foreground uppercase tracking-widest text-sm">Total Due</span>
                                <span className="text-3xl font-black text-primary drop-shadow-sm">${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-6 bg-primary/5 border-t border-border/30 text-center print:hidden">
                    <p className="text-sm font-medium text-foreground/70">Thank you for your business. Please make payment by <span className="font-bold">{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</span>.</p>
                </div>
            </div>
        </div>
    );
}
