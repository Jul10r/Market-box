import { db } from '@/lib/db'
import { listings } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { syncCurrentUser } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import EditListingForm from './EditListingForm'

interface EditListingPageProps {
  params: Promise<{ id: string }>
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = await params

  const user = await syncCurrentUser()
  if (!user) {
    redirect('/sign-in')
  }

  const [listing] = await db
    .select()
    .from(listings)
    .where(eq(listings.id, Number(id)))

  if (!listing) {
    return notFound()
  }

  if (listing.sellerId !== user.id) {
    redirect(`/listings/${id}`)
  }

  return (
    <main className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <EditListingForm listing={listing} />
    </main>
  )
}
