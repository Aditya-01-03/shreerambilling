import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { InvoiceCard } from "@/components/InvoiceCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function InvoicesPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const invoices = await prisma.invoice.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl flex-1 flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Invoices</h1>
                    <p className="text-muted-foreground mt-1 font-medium">Manage and track all your client invoices.</p>
                </div>
                <Link href="/invoices/create">
                    <Button size="lg" className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all font-semibold rounded-xl">
                        Create New Invoice
                    </Button>
                </Link>
            </div>

            <div className="mt-8">
                {invoices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-border/60 rounded-3xl bg-card/30">
                        <h3 className="text-lg font-bold text-foreground">No invoices found</h3>
                        <p className="text-muted-foreground mt-2 mb-6 text-base">You haven&apos;t created any invoices yet.</p>
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
