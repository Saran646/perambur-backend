import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as path from 'path';

const prisma = new PrismaClient();

async function importBranches() {
    try {
        const filePath = path.join(process.cwd(), 'PS4-Details.xlsx');
        const workbook = XLSX.readFile(filePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data: any[] = XLSX.utils.sheet_to_json(worksheet);

        console.log(`Starting import of ${data.length} branches...`);

        let count = 0;
        for (const row of data) {
            const name = row['Branches'] || 'Unnamed Branch';
            const address = row['Branch Address'] || 'No Address Provided';
            const phone = row['Contact No'] || 'No Phone Provided';
            const area = row['__EMPTY'] || 'Chennai';

            // Extract Latitude and Longitude from "GOOGLE ADDRESS"
            let latitude: number | null = null;
            let longitude: number | null = null;
            if (row['GOOGLE ADDRESS'] && typeof row['GOOGLE ADDRESS'] === 'string') {
                const parts = row['GOOGLE ADDRESS'].split(',');
                if (parts.length === 2) {
                    latitude = parseFloat(parts[0].trim());
                    longitude = parseFloat(parts[1].trim());
                }
            }

            const mapLink = row['ADDRESS IN GOOGLE PROFILE'] ?
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(row['ADDRESS IN GOOGLE PROFILE'])}` :
                null;

            await prisma.branch.upsert({
                where: { id: `excel_${row['S.No']}` }, // Use a unique ID based on S.No
                update: {
                    name,
                    address,
                    city: 'Chennai',
                    state: 'Tamil Nadu',
                    area,
                    phone,
                    mapLink,
                    latitude,
                    longitude,
                    isActive: true
                },
                create: {
                    id: `excel_${row['S.No']}`,
                    name,
                    address,
                    city: 'Chennai',
                    state: 'Tamil Nadu',
                    area,
                    phone,
                    mapLink,
                    latitude,
                    longitude,
                    isActive: true
                }
            });
            count++;
            console.log(`[${count}/${data.length}] Imported: ${name}`);
        }

        console.log('\n✅ Successfully imported all branches!');
    } catch (error) {
        console.error('❌ Error during branch import:', error);
    } finally {
        await prisma.$disconnect();
    }
}

importBranches();
