import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function setupDatabase() {
    console.log('🚀 Starting Production Database Setup...\n');

    try {
        // 1. Push Schema to DB
        console.log('📦 Pushing Prisma Schema to Database...');
        execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
        console.log('✅ Schema pushed successfully!\n');

        // 2. Create Admin User
        console.log('🔐 Creating/Verifying Admin User...');
        const existingAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await prisma.user.create({
                data: {
                    email: 'admin@perambursrinivasa.com',
                    name: 'Admin User',
                    password: hashedPassword,
                    role: 'ADMIN',
                    phone: '1234567890'
                }
            });
            console.log('✅ Admin user created: admin@perambursrinivasa.com / admin123\n');
        } else {
            console.log('ℹ️  Admin user already exists.\n');
        }

        // 3. Seed Branches
        console.log('🌱 Seeding Branches...');
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
        ];

        for (const branch of branches) {
            const existing = await prisma.branch.findFirst({ where: { name: branch.name } });
            if (!existing) {
                await prisma.branch.create({ data: branch });
                console.log(`   + Created: ${branch.name}`);
            } else {
                console.log(`   . Skipped: ${branch.name} (Exists)`);
            }
        }
        console.log('✅ Branches seeded!\n');

        console.log('🎉 Database Setup Complete! You are ready to go.');

    } catch (error) {
        console.error('❌ Setup Failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

setupDatabase();
