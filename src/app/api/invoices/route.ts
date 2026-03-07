import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z, ZodError } from "zod";

const invoiceSchema = z.object({
    clientName: z.string().min(1, "Client name is required"),
    clientEmail: z.string().email("Invalid client email address"),
    amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
    dueDate: z.string().transform((str) => new Date(str)),
    invoiceNumber: z.string().min(1, "Invoice number is required"),
    status: z.enum(["paid", "unpaid"]).default("unpaid"),
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const data = invoiceSchema.parse(body);

        const existingInvoice = await prisma.invoice.findUnique({
            where: { invoiceNumber: data.invoiceNumber },
        });

        if (existingInvoice) {
            return NextResponse.json(
                { message: "Invoice with this number already exists" },
                { status: 409 }
            );
        }

        const invoice = await prisma.invoice.create({
            data: {
                ...data,
                userId: session.user.id,
            },
        });

        return NextResponse.json(invoice, { status: 201 });
    } catch (error: Omit<Error, "message"> | unknown) {
        if (error instanceof ZodError) {
            const zErr = error as unknown as { errors: { message: string }[] };
            return NextResponse.json({ message: zErr.errors[0].message }, { status: 400 });
        }
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const invoices = await prisma.invoice.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(invoices);
    } catch {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
