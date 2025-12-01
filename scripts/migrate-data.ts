import { PrismaClient } from '@prisma/client';

// Source database (old project)
const sourceDb = new PrismaClient({
    datasourceUrl: process.env.SOURCE_DATABASE_URL
});

// Target database (new backend)
const targetDb = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
});

async function migrateData() {
    console.log('🚀 Starting database migration...\n');

    try {
        // 1. Migrate Users
        console.log('📋 Migrating users...');
        const users = await sourceDb.user.findMany();
        for (const user of users) {
            await targetDb.user.upsert({
                where: { id: user.id },
                update: user,
                create: user
            });
        }
        console.log(`✅ Migrated ${users.length} users\n`);

        // 2. Migrate Branches
        console.log('📋 Migrating branches...');
        const branches = await sourceDb.branch.findMany();
        for (const branch of branches) {
            await targetDb.branch.upsert({
                where: { id: branch.id },
                update: branch,
                create: branch
            });
        }
        console.log(`✅ Migrated ${branches.length} branches\n`);

        // 3. Migrate Dishes
        console.log('📋 Migrating dishes...');
        const dishes = await sourceDb.dish.findMany();
        for (const dish of dishes) {
            await targetDb.dish.upsert({
                where: { id: dish.id },
                update: dish,
                create: dish
            });
        }
        console.log(`✅ Migrated ${dishes.length} dishes\n`);

        // 4. Migrate Reviews
        console.log('📋 Migrating reviews...');
        const reviews = await sourceDb.review.findMany();
        for (const review of reviews) {
            await targetDb.review.upsert({
                where: { id: review.id },
                update: review,
                create: review
            });
        }
        console.log(`✅ Migrated ${reviews.length} reviews\n`);

        // 5. Migrate ReviewDish (many-to-many)
        console.log('📋 Migrating review-dish relationships...');
        const reviewDishes = await sourceDb.reviewDish.findMany();
        for (const rd of reviewDishes) {
            await targetDb.reviewDish.upsert({
                where: {
                    reviewId_dishId: {
                        reviewId: rd.reviewId,
                        dishId: rd.dishId
                    }
                },
                update: rd,
                create: rd
            });
        }
        console.log(`✅ Migrated ${reviewDishes.length} review-dish relationships\n`);

        // 6. Migrate HelpfulVotes
        console.log('📋 Migrating helpful votes...');
        const votes = await sourceDb.helpfulVote.findMany();
        for (const vote of votes) {
            await targetDb.helpfulVote.upsert({
                where: { id: vote.id },
                update: vote,
                create: vote
            });
        }
        console.log(`✅ Migrated ${votes.length} helpful votes\n`);

        // 7. Migrate NextAuth data (Accounts, Sessions, VerificationTokens)
        console.log('📋 Migrating NextAuth data...');
        const accounts = await sourceDb.account.findMany();
        for (const account of accounts) {
            await targetDb.account.upsert({
                where: { id: account.id },
                update: account,
                create: account
            });
        }
        const sessions = await sourceDb.session.findMany();
        for (const session of sessions) {
            await targetDb.session.upsert({
                where: { id: session.id },
                update: session,
                create: session
            });
        }
        const tokens = await sourceDb.verificationToken.findMany();
        for (const token of tokens) {
            await targetDb.verificationToken.upsert({
                where: {
                    identifier_token: {
                        identifier: token.identifier,
                        token: token.token
                    }
                },
                update: token,
                create: token
            });
        }
        console.log(`✅ Migrated ${accounts.length} accounts, ${sessions.length} sessions, ${tokens.length} tokens\n`);

        console.log('🎉 Migration completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`  - Users: ${users.length}`);
        console.log(`  - Branches: ${branches.length}`);
        console.log(`  - Dishes: ${dishes.length}`);
        console.log(`  - Reviews: ${reviews.length}`);
        console.log(`  - Review-Dish links: ${reviewDishes.length}`);
        console.log(`  - Helpful votes: ${votes.length}`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        await sourceDb.$disconnect();
        await targetDb.$disconnect();
    }
}

// Run migration
migrateData()
    .then(() => {
        console.log('\n✅ All done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Migration error:', error);
        process.exit(1);
    });
