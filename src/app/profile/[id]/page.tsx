import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

interface ProfilePageProps {
    params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { id } = await params;

    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id));

    if (!user) {
        notFound();
    }

    return (
        <main className="max-w-2xl mx-auto p-8">
            <div className="flex items-center gap-6 p-6 border rounded-xl shadow-sm">
                {user.avatarUrl && (
                    <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="w-20 h-20 rounded-full object-cover border"
                    />
                )}
                <div>
                    <h1 className="text-2xl font-bold">{user.username}</h1>
                    <p className="text-sm text-zinc-500">
                        Member since {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </main>
    )
}