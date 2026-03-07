import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log("Seeding database...")

    const users = [
        {
            email: 'adityabhone03@gmail.com',
            password: 'Aditya@1234'
        },
        {
            email: 'shreeramhightech@gmail.com',
            password: 'BIlling@123'
        }
    ]

    for (const u of users) {
        const hashedPassword = await bcrypt.hash(u.password, 10)

        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: { password: hashedPassword },
            create: {
                email: u.email,
                password: hashedPassword,
            },
        })
        console.log(`Upserted user: ${user.email}`)
    }
}

main()
    .then(async () => {
        console.log("Seeding completed successfully.")
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error("Error seeding database:", e)
        await prisma.$disconnect()
        process.exit(1)
    })
