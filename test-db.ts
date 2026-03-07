import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Connecting...")
    try {
        const users = await prisma.user.findMany()
        console.log("Success:", users)
    } catch (e) {
        console.error("Error:", e)
    }
}

main().finally(() => prisma.$disconnect())
