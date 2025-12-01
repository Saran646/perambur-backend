import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const branches = [
    {
        name: 'Perambur (HQ)',
        address: 'No. 123, Paper Mills Road, Perambur, Chennai - 600011',
        city: 'Chennai',
        state: 'Tamil Nadu',
        phone: '044-23456789',
        mapLink: 'https://maps.google.com/?q=Perambur+Srinivasa+Sweets',
        workingHours: '9:00 AM - 10:00 PM',
        isActive: true
    },
    {
        name: 'Kolathur',
        address: 'No. 45, Red Hills Road, Kolathur, Chennai - 600099',
        city: 'Chennai',
        state: 'Tamil Nadu',
        phone: '044-23456790',
        mapLink: 'https://maps.google.com/?q=Kolathur',
        workingHours: '9:00 AM - 10:00 PM',
        isActive: true
    },
    {
        name: 'Anna Nagar',
        address: '2nd Avenue, Anna Nagar, Chennai - 600040',
        city: 'Chennai',
        state: 'Tamil Nadu',
        phone: '044-23456791',
        mapLink: 'https://maps.google.com/?q=Anna+Nagar',
        workingHours: '9:00 AM - 10:30 PM',
        isActive: true
    }
]

async function seedBranches() {
    try {
        console.log('🌱 Seeding branches...')

        for (const branch of branches) {
            await prisma.branch.create({
                data: branch
            })
            console.log(`Created branch: ${branch.name}`)
        }

        console.log('✅ Seeding completed!')
    } catch (error) {
        console.error('Error seeding branches:', error)
    } finally {
        await prisma.$disconnect()
    }
}

seedBranches()
