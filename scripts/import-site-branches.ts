import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const branches = [
    {
        name: "Tirupathi",
        address: "No: 20-5-1,Thirumala Bypass Road,Thirupathi Uppan Mandal Akkarampalli Thirupathi Town, Chitoor, Andhra Pradesh-517501",
        phone: "+91 7823999799 / +91 7823999899",
        mapLink: "https://www.google.com/maps?cid=",
        area: "Tirupathi"
    },
    {
        name: "Tirupathi - II (Tiruchanoor Road)",
        address: "No: 29/1,29/2,29/3/254/2, Tiruchanoor Road, Tirupati (Urban), Chittoor, Andhra Pradesh-517502",
        phone: "+91 7823 999 599 / +91 7823 999 699",
        mapLink: "https://maps.app.goo.gl/F9ytSnzkh8argv629",
        area: "Tirupathi"
    },
    {
        name: "Perambur (Railway Station Opp)",
        address: "No: 23/16, Perambur High Road, Perambur, Chennai-600011",
        phone: "+91 7823999930 / +91 7823999931",
        mapLink: "https://www.google.com/maps/place/Perambur+Sri+Srinivasa+Sweets+%26+Snacks/@13.1082005,80.2448303,17z/data=!3m1!4b1!4m6!3m5!1s0x3a5265b9a37522c7:0x6c9421bbe06f8417!8m2!3d13.1082005!4d80.2448303!16s%2Fg%2F124t0fjsq?entry=ttu",
        area: "Perambur"
    },
    {
        name: "Perambur Market",
        address: "No: 132, M H Road, Perambur, Chennai-600011",
        phone: "+91 7823999932",
        mapLink: "https://www.google.com/maps/place/Perambur+Sri+Srinivasa+Sweets+%26+Snacks/@13.1140696,80.2436488,17z/data=!3m1!4b1!4m6!3m5!1s0x3a5265baa24a8791:0x11141286df1114e9!8m2!3d13.1140696!4d80.2436488!16s%2Fg%2F1pxwcl6fm?entry=ttu",
        area: "Perambur"
    },
    {
        name: "Venus (Perambur)",
        address: "No: 38, paper mills road, Chennai-600011",
        phone: "+91 7823999933",
        mapLink: "https://www.google.com/maps/place/Perambur+Sri+Srinivasa+Sweets+%26+Snacks/@13.1120294,80.2379069,17z/data=!3m1!4b1!4m6!3m5!1s0x3a5265b17f0220e1:0x3cc1f1cd88ac496e!8m2!3d13.1120294!4d80.2379069!16s%2Fg%2F1tmpcc4h?entry=ttu",
        area: "Perambur"
    },
    {
        name: "Ayanavaram",
        address: "No: 200, KH Road Aynavaram, Chennai- 600023",
        phone: "+91 7823999935",
        mapLink: "https://www.google.com/maps?cid=5136746311012406939",
        area: "Ayanavaram"
    },
    {
        name: "Kolathur",
        address: "1 & 2, 1ST, Anjugam Nagar Main Road, kolathur, Chennai-600099",
        phone: "+91 7823999936",
        mapLink: "https://www.google.com/maps/place/Perambur+Sri+Srinivasa+Sweets+%26+Snacks/@13.1212757,80.2237315,17z/data=!3m1!4b1!4m6!3m5!1s0x3a526456d88b525f:0x7f433dee27f80c89!8m2!3d13.1212757!4d80.2237315!16s%2Fg%2F11_qtp7xm?entry=ttu",
        area: "Kolathur"
    },
    {
        name: "Moolakadai",
        address: "No: 30, M H Road, Moolakadai, Chennai-600060",
        phone: "+91 7823999937",
        mapLink: "https://www.google.com/maps/place/Perambur+Sri+Srinivasa+Sweets+%26+Snacks/@13.129702,80.2415219,17z/data=!3m1!4b1!4m6!3m5!1s0x3a5265064c70ccc7:0x331c732e43595a1!8m2!3d13.129702!4d80.2415219!16s%2Fg%2F1hc1nd75w?entry=ttu",
        area: "Moolakadai"
    },
    {
        name: "Redhills",
        address: "No: 265, G.N.T. Road, Redhills, Chennai-600052",
        phone: "+91 7823999938",
        mapLink: "https://www.google.com/maps?cid=8023356288679942154",
        area: "Redhills"
    },
    {
        name: "Padi",
        address: "No: 100, M.T.H Road Padi, Chennai-600050",
        phone: "+91 7823999939",
        mapLink: "https://www.google.com/maps/place/Perambur+Sri+Srinivasa+Sweets+%26+Snacks/@13.0988028,80.1833732,17z/data=!3m1!4b1!4m6!3m5!1s0x3a52640ac4fbeff9:0xd69107810d8783c0!8m2!3d13.0988028!4d80.1833732!16s%2Fg%2F11cjk44s_2?entry=ttu",
        area: "Padi"
    },
    {
        name: "Ambathur",
        address: "No: 453/1, CTH Road Ambatur O.T, Chennai-600053",
        phone: "+91 7823999940",
        mapLink: "https://www.google.com/maps/place/Perambur+Sri+Srinivasa+Sweets+%26+Snacks/@13.1208606,80.148667,17z/data=!3m1!4b1!4m6!3m5!1s0x3a5263a989e2a8b5:0xb8b79951906eafa3!8m2!3d13.1208606!4d80.148667!16s%2Fg%2F11bwdjpm3z?entry=ttu",
        area: "Ambathur"
    },
    {
        name: "Thiru.vi.ka.nagar",
        address: "No: 59, S.R.P. Kol Street, T.V.K. nagar, Peramur, Chennai-600011",
        phone: "+91 7823999941",
        mapLink: "https://www.google.com/maps/place/Perambur+Sri+Srinivasa+Sweets+%26+Snacks/@13.1202485,80.2322815,17z/data=!3m1!4b1!4m6!3m5!1s0x3a5265b81f208141:0x53f28cc2af34c059!8m2!3d13.1202485!4d80.2322815!16s%2Fg%2F11gwg622d0?entry=ttu",
        area: "Perambur"
    },
    {
        name: "Bharathi Road",
        address: "No: 8, Bharathi Road, Perambur, Chennai-600011",
        phone: "+91 7823999942",
        mapLink: "https://www.google.com/maps/place/Perambur+Sri+Srinivasa+Sweets+%26+Snacks/@13.1130807,80.2484196,17z/data=!3m1!4b1!4m6!3m5!1s0x3a5265bb84cec7f1:0x7ad9ead7b599e1dc!8m2!3d13.1130807!4d80.2484196!16s%2Fg%2F11clkvf5l_?entry=ttu",
        area: "Perambur"
    },
    {
        name: "Thiruvallur",
        address: "No: 4/3A, C.V. Naidu salai, 205National Highways, Tiruvallur-602003",
        phone: "+91 7823999943",
        mapLink: "https://www.google.com/maps/place/PS4+Veg+Restaurant/@13.1406892,79.9051532,17z/data=!3m1!4b1!4m6!3m5!1s0x3a5291b9d64d82cb:0xe8d8169c06f8a153!8m2!3d13.1406892!4d79.9051532!16s%2Fg%2F11g071yx75?entry=ttu",
        area: "Thiruvallur"
    },
    {
        name: "Aminjikarai",
        address: "No: 493, P.H. Road, Aminjikarai, Chennai-600029",
        phone: "+91 7823999944",
        mapLink: "https://www.google.com/maps/@13.0023424,80.2619392,14z",
        area: "Aminjikarai"
    },
    {
        name: "Mathur (MMDA)",
        address: "No: 132, Kamarajar salai, Mathur MMDA, Chennai-600068",
        phone: "+91 7823999945",
        mapLink: "https://www.google.com/maps/@13.0023424,80.2619392,14z",
        area: "Mathur"
    },
    {
        name: "Nelson Manickam Road",
        address: "No: 130, Nelson Manickam Road, Aminjikarai, Chennai-600 029",
        phone: "+91 7823999946",
        mapLink: "https://maps.app.goo.gl/qFyPK4crihPFNxs38",
        area: "Aminjikarai"
    },
    {
        name: "Periyar Nagar",
        address: "No: 106, Siva Elango Salai, (70 Feet Road), Periyar Nagar, Chennai-600 082",
        phone: "+91 7823999947 / +91 7823999956",
        mapLink: "https://www.google.com/maps?cid=16824243661922647542",
        area: "Periyar Nagar"
    },
    {
        name: "Tiruvallur (The Chennai Silks Campus)",
        address: "No: 65A, C.V. Naidu salai, The Chennai Silks Tiruvallur, Thiruvallur-602001",
        phone: "+91 7823999948 / +91 7823999958",
        mapLink: "https://www.google.com/maps/@13.0023424,80.2619392,14z",
        area: "Thiruvallur"
    },
    {
        name: "Valasarawakkam",
        address: "No: 3, Arcot Road, Valasaravakkam, Chennai-600087",
        phone: "+91 7823999950",
        mapLink: "https://www.google.com/maps/place/Perambur+Sri+Srinivasa+Sweets+%26+Snacks/@13.0438205,80.1839779,17z/data=!3m1!4b1!4m6!3m5!1s0x3a5261f453767abb:0xec3bc5b0e9d1b746!8m2!3d13.0438205!4d80.1839779!16s%2Fg%2F11fm3vv4jh?entry=ttu",
        area: "Valasarawakkam"
    },
    {
        name: "Thiruninravur",
        address: "Plot no: 20, survey no: 224/1, C.T.H road, thiruninravur-602024",
        phone: "+91 7823999951 / +91 7823999961",
        mapLink: "https://www.google.com/maps/@13.0023424,80.2619392,14z",
        area: "Thiruninravur"
    },
    {
        name: "Arumbakkam (MMDA)",
        address: "No: 249/6, P-block, MMDA Colony, Arumbakkam-600106",
        phone: "+91 7823999952",
        mapLink: "https://www.google.com/maps/place/Perambur+Sri+Srinivasa+Sweets+%26+Snacks/@13.1120294,80.2379069,17z/data=!3m1!4b1!4m6!3m5!1s0x3a5265b17f0220e1:0x3cc1f1cd88ac496e!8m2!3d13.1120294!4d80.2379069!16s%2Fg%2F1tmpcc4h?entry=ttu",
        area: "Arumbakkam"
    },
    {
        name: "Tirumangalam",
        address: "No: 1, Mogappair Road, Near Park Road Junction, Tirumangalam, Chennai-600101",
        phone: "+91 7823999953",
        mapLink: "https://www.google.com/maps/@13.0023424,80.2619392,14z",
        area: "Tirumangalam"
    },
    {
        name: "Madhavaram Milk Colony",
        address: "No-12, Madhavaram Milk Colony Main Road, Madhavaram, Chennai-600051",
        phone: "+91 7823999949",
        mapLink: "https://www.google.com/maps/place/12,+Madhavaram+Milk+Colony+Rd,+Mangalapuram,+Madhavaram+Milk+Colony,+Chennai,+Tamil+Nadu+600060/@13.1450901,80.2396631,17z/data=!3m1!4b1!4m5!3m4!1s0x3a5265196c0cd923:0x9bfdc2d5510b3afa!8m2!3d13.1450901!4d80.2396631",
        area: "Madhavaram"
    },
    {
        name: "Mathur-2",
        address: "No-105/4, MMDA 2nd Main Road, MMDA, Mathur, Chennai - 600068",
        phone: "+91 7823999945",
        mapLink: "https://perambursrinivasa.com/pages/branches",
        area: "Mathur"
    },
    {
        name: "Srinivasa Nagar, Kolathur",
        address: "No.10/2, Srinivasa Nagar Main Road, Chennai-600099",
        phone: "+91 7823999954",
        mapLink: "https://perambursrinivasa.com/pages/branches",
        area: "Kolathur"
    },
    {
        name: "Ashok Nagar",
        address: "NO-66 & 67(37) I ST AVENUE, ASHOK NAGAR, CHENNAI - 600 083",
        phone: "+91 7823999954",
        mapLink: "https://maps.app.goo.gl/KBUZk7wCfzmJXc5b8",
        area: "Ashok Nagar"
    }
];

async function importSiteBranches() {
    console.log(`Starting import of ${branches.length} branches from website data...`);

    let count = 0;
    for (const branch of branches) {
        const existing = await prisma.branch.findFirst({
            where: { name: branch.name }
        });

        const branchData = {
            address: branch.address,
            phone: branch.phone,
            mapLink: branch.mapLink,
            area: branch.area,
            city: "Chennai", // Defaulting to Chennai as per data
            state: branch.name.includes("Tirupathi") ? "Andhra Pradesh" : "Tamil Nadu",
            isActive: true
        };

        if (existing) {
            await prisma.branch.update({
                where: { id: existing.id },
                data: branchData
            });
        } else {
            await prisma.branch.create({
                data: {
                    name: branch.name,
                    ...branchData
                }
            });
        }
        count++;
        console.log(`[${count}/${branches.length}] Processed: ${branch.name}`);
    }
}

importSiteBranches()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
