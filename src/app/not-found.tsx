import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="max-w-xl mx-auto p-4 sm:p-6 lg:p-8 my-12">
      <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 shadow-sm text-center flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <svg className="w-7 h-7 stroke-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">404</span>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 tracking-tight">
          Page not found
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">
          The listing, chat, or page you are looking for does not exist or has been removed.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
          <Link
            href="/"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm"
          >
            Back to Marketplace
          </Link>
          <Link
            href="/chats"
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            View Messages
          </Link>
        </div>
      </div>
    </main>
  )
}
