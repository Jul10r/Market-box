export default function ListingLoading() {
  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-pulse">
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-8 shadow-sm">
        <div className="h-4 w-32 bg-slate-100 rounded mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-3">
            <div className="aspect-4/3 w-full bg-slate-100 rounded-xl"></div>
            <div className="flex gap-2.5">
              <div className="w-20 h-20 rounded-lg bg-slate-100"></div>
              <div className="w-20 h-20 rounded-lg bg-slate-100"></div>
            </div>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-slate-100 rounded-full"></div>
                <div className="h-5 w-16 bg-slate-100 rounded-full"></div>
              </div>
              <div className="h-8 w-3/4 bg-slate-200 rounded"></div>
              <div className="h-8 w-24 bg-slate-200 rounded"></div>
              <div className="h-4 w-32 bg-slate-100 rounded"></div>
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <div className="h-3 w-20 bg-slate-100 rounded"></div>
                <div className="h-4 w-full bg-slate-100 rounded"></div>
                <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="h-16 bg-slate-50 border border-slate-200 rounded-xl"></div>
              <div className="h-11 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
