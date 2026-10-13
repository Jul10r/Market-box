export default function DashboardLoading() {
  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="h-7 w-48 bg-slate-200 rounded"></div>
          <div className="h-4 w-72 bg-slate-100 rounded mt-2"></div>
        </div>
        <div className="h-9 w-28 bg-slate-200 rounded-lg"></div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-28 bg-slate-200 rounded"></div>
          <div className="h-4 w-16 bg-slate-100 rounded"></div>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 shrink-0"></div>
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-slate-200 rounded"></div>
                  <div className="flex items-center gap-2">
                    <div className="h-3.5 w-12 bg-slate-100 rounded"></div>
                    <div className="h-3.5 w-14 bg-slate-100 rounded-full"></div>
                    <div className="h-3 w-20 bg-slate-100 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="h-7 w-12 bg-slate-100 rounded"></div>
                <div className="h-7 w-20 bg-slate-100 rounded"></div>
                <div className="h-7 w-14 bg-slate-100 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
