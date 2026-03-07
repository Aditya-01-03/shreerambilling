import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { InvoiceCard } from "@/components/InvoiceCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const invoices = await prisma.invoice.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 6,
    });

    const totalInvoices = await prisma.invoice.count({
        where: { userId: session.user.id },
    });

    const paidInvoices = await prisma.invoice.count({
        where: { userId: session.user.id, status: "paid" },
    });

    const totalAmount = await prisma.invoice.aggregate({
        where: { userId: session.user.id, status: "unpaid" },
        _sum: { amount: true },
    });

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl flex-1 flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/40 border border-border/50 p-6 rounded-3xl shadow-sm backdrop-blur-sm">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-1 font-medium">Welcome back, <span className="text-foreground">{session.user.email}</span></p>
                </div>
                <Link href="/invoices/create">
                    <Button size="lg" className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all font-semibold rounded-xl">
                        Create New Invoice
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-card p-6 rounded-3xl border border-border/60 shadow-sm relative overflow-hidden group hover:border-border transition-colors">
                    <div className="absolute top-0 right-0 p-5 opacity-10 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                    </div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Invoices</h3>
                    <p className="text-5xl font-black mt-3 text-foreground tracking-tighter">{totalInvoices}</p>
                </div>
                <div className="bg-card p-6 rounded-3xl border border-border/60 shadow-sm relative overflow-hidden group hover:border-green-500/30 transition-colors">
                    <div className="absolute top-0 right-0 p-5 text-green-500 opacity-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Paid Invoices</h3>
                    <p className="text-5xl font-black mt-3 text-foreground tracking-tighter">{paidInvoices}</p>
                </div>
                <div className="bg-gradient-to-br from-primary to-blue-600 p-6 rounded-3xl shadow-lg text-primary-foreground relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-125 transition-transform duration-700" />
                    <div className="relative z-10">
                        <h3 className="text-sm font-bold text-primary-foreground/90 uppercase tracking-widest">Total Unpaid Amount</h3>
                        <p className="text-5xl font-black mt-3 tracking-tighter drop-shadow-sm">${(totalAmount._sum.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6 flex-1 pt-4">
                <div className="flex justify-between items-center px-1">
                    <h2 className="text-2xl font-bold tracking-tight">Recent Invoices</h2>
                    <Link href="/invoices">
                        <Button variant="ghost" className="font-semibold text-primary hover:bg-primary/5">View All Invoices &rarr;</Button>
                    </Link>
                </div>

                {invoices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-border/60 rounded-3xl bg-card/30">
                        <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-foreground">No invoices yet</h3>
                        <p className="text-muted-foreground mt-2 mb-6 max-w-sm text-base leading-relaxed">You haven&apos;t created any invoices yet. Generate your first invoice to get started.</p>
                        <Link href="/invoices/create">
                            <Button size="lg" className="rounded-xl shadow-md">Create Your First Invoice</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
                        {invoices.map((invoice) => (
                            <InvoiceCard key={invoice.id} invoice={invoice} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
