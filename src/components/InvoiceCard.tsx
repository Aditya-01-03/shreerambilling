import Link from "next/link";
import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";

interface Invoice {
    id: string;
    clientName: string;
    clientEmail: string;
    amount: number;
    status: string;
    invoiceNumber: string;
    dueDate: Date;
}

export function InvoiceCard({ invoice }: { invoice: Invoice }) {
    const isPaid = invoice.status === "paid";

    return (
        <Link href={`/invoices/${invoice.id}`} className="block group">
            <div className="relative flex flex-col justify-between p-6 bg-card rounded-2xl border border-border/60 shadow-sm hover:shadow-xl hover:border-primary/40 focus-within:ring-2 focus-within:ring-primary transition-all duration-300 gap-6 h-full overflow-hidden">

                {/* Top Section */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1.5">
                        <h3 className="font-bold text-foreground truncate max-w-[220px] text-lg leading-tight group-hover:text-primary transition-colors" title={invoice.clientName}>
                            {invoice.clientName}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                            #{invoice.invoiceNumber}
                        </p>
                    </div>
                    <div className={`px-3 py-1 text-xs font-bold tracking-wide rounded-full shadow-sm backdrop-blur-sm ${isPaid ? 'bg-green-100/80 text-green-700 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' : 'bg-orange-100/80 text-orange-700 border border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20'}`}>
                        {invoice.status.toUpperCase()}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex justify-between items-end border-t border-border/40 pt-4 mt-auto">
                    <div className="space-y-1">
                        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Due Date</p>
                        <p className="text-sm font-semibold text-foreground">{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-2xl font-black text-foreground tracking-tight">
                            ${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="bg-primary/10 p-1.5 rounded-full text-primary opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                            <ArrowUpRight className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
