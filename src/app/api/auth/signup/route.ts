import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z, ZodError } from "zod";

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = signupSchema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User with this email already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });

        return NextResponse.json(
            { user, message: "User created successfully" },
            { status: 201 }
        );
    } catch (error: Omit<Error, "message"> | unknown) {
        if (error instanceof ZodError) {
            const zErr = error as unknown as { errors: { message: string }[] };
            return NextResponse.json({ message: zErr.errors[0].message }, { status: 400 });
        }
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
