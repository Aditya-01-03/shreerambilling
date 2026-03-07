import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const invoice = await prisma.invoice.findUnique({
            where: { id: params.id },
        });

        if (!invoice || invoice.userId !== session.user.id) {
            return NextResponse.json({ message: "Invoice not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json(invoice);
    } catch {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
