export default function ChatsLoading() {
  return (
    <main className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 animate-pulse">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="h-6 w-36 bg-slate-200 rounded"></div>
            <div className="h-3.5 w-52 bg-slate-100 rounded mt-1.5"></div>
          </div>
          <div className="h-4 w-24 bg-slate-100 rounded"></div>
        </div>

        <div className="divide-y divide-slate-100">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-200 shrink-0"></div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-28 bg-slate-200 rounded"></div>
                    <div className="h-4 w-14 bg-slate-100 rounded"></div>
                  </div>
                  <div className="h-3 w-48 bg-slate-100 rounded"></div>
                </div>
              </div>
              <div className="h-4 w-12 bg-slate-100 rounded shrink-0"></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
