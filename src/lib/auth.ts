import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users } from '@/db/schema';


export async function syncCurrentUser() {
    const user = await currentUser();

    if (!user) {
        return null;
    }

    const email = user.emailAddresses[0]?.emailAddress;

    if (!email) {
        return null
    }

    const username = user.username || user.firstName || "User";

    const avatarUrl = user.imageUrl;

    const [dbUser] = await db
        .insert(users)
        .values({
            id: user.id,
            email: email,
            username: username,
            avatarUrl: avatarUrl
        })
        .onConflictDoUpdate({
            target: users.id,
            set: {
                email: email,
                username: username,
                avatarUrl: avatarUrl,
                updatedAt: new Date(),
            }
        })
        .returning()
    return dbUser
}