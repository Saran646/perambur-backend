import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDb() {
    try {
        console.log('Checking database connection...')

        // Check User count
        const userCount = await prisma.user.count()
        console.log(`Users found: ${userCount}`)

        if (userCount > 0) {
            const users = await prisma.user.findMany({
                select: { email: true, role: true }
            })
            console.log('Users:', users)
        }

        // Check Branch count
        const branchCount = await prisma.branch.count()
        console.log(`Branches found: ${branchCount}`)

    } catch (error) {
        console.error('Error checking database:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkDb()
