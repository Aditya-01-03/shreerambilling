import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    console.log("Testing auth for adityabhone03@gmail.com")
    const user = await prisma.user.findUnique({
        where: { email: "adityabhone03@gmail.com" }
    })
    
    if (!user) {
        console.log("USER NOT FOUND IN DB!")
        return;
    }

    console.log("User found. ID:", user.id)
    console.log("Testing password match...")
    const match = await bcrypt.compare("Aditya@1234", user.password);
    
    if (match) {
        console.log("PASSWORD MATCHES!")
    } else {
        console.log("PASSWORD DOES NOT MATCH! Stored hash:", user.password)
    }
}

main().finally(() => prisma.$disconnect())
