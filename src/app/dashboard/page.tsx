import { syncCurrentUser } from '@/lib/auth'

export default async function DashboardPage() {

    const user = await syncCurrentUser()
    return (
        <main className="p-8 max-w-xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold">My Dashboard (Protected)</h1>
            <div className="p-4 border rounded-lg space-y-2">
                <p><strong>Username:</strong> {user?.username}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Postgres User ID:</strong> {user?.id}</p>
            </div>
        </main>
    )
}