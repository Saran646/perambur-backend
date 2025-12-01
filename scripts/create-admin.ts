import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
    console.log('🔐 Creating admin user...\n');

    try {
        // Check if admin user already exists
        const existingAdmin = await prisma.user.findFirst({
            where: { role: 'ADMIN' }
        });

        if (existingAdmin) {
            console.log('✅ Admin user already exists:');
            console.log(`   Email: ${existingAdmin.email}`);
            console.log(`   Name: ${existingAdmin.name}\n`);
            console.log('ℹ️  To create a new admin or reset password, delete or update the existing user in the database.\n');
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Create admin user
        const admin = await prisma.user.create({
            data: {
                email: 'admin@perambursrinivasa.com',
                name: 'Admin User',
                password: hashedPassword,
                role: 'ADMIN',
                phone: '1234567890'
            }
        });

        console.log('✅ Admin user created successfully!\n');
        console.log('📧 Email: admin@perambursrinivasa.com');
        console.log('🔑 Password: admin123\n');
        console.log('⚠️  IMPORTANT: Please change the password after first login!\n');

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

createAdminUser()
    .then(() => {
        console.log('✅ Done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Script failed:', error);
        process.exit(1);
    });
