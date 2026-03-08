import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GET() {
    try {
        console.log("Seeding database...");

        const users = [
            {
                email: 'adityabhone03@gmail.com',
                password: 'Aditya@1234'
            },
            {
                email: 'shreeramhightech@gmail.com',
                password: 'BIlling@123'
            }
        ];

        const results = [];

        for (const u of users) {
            const hashedPassword = await bcrypt.hash(u.password, 10);

            const user = await prisma.user.upsert({
                where: { email: u.email },
                update: { password: hashedPassword },
                create: {
                    email: u.email,
                    password: hashedPassword,
                },
            });
            results.push(user.email);
            console.log(`Upserted user: ${user.email}`);
        }

        return NextResponse.json(
            { message: "Seeding completed successfully.", users: results },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error seeding database:", error);
        return NextResponse.json(
            { error: "Failed to seed database", details: error.message },
            { status: 500 }
        );
    }
}
