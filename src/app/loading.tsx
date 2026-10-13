export default function Loading() {
  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-pulse">
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pb-5 border-b border-slate-100">
          <div className="h-10 bg-slate-100 rounded-lg w-full sm:w-auto flex-1 min-w-0 max-w-md"></div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <div className="h-8 w-28 bg-slate-100 rounded-lg shrink-0"></div>
            <div className="h-8 w-24 bg-slate-100 rounded-lg shrink-0"></div>
            <div className="h-8 w-24 bg-slate-200 rounded-lg shrink-0"></div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-7 w-20 bg-slate-100 rounded-full shrink-0"></div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col">
              <div className="aspect-square bg-slate-100"></div>
              <div className="p-3.5 space-y-2.5 flex-1">
                <div className="h-4 w-16 bg-slate-200 rounded"></div>
                <div className="h-3.5 w-full bg-slate-100 rounded"></div>
                <div className="h-3 w-24 bg-slate-100 rounded"></div>
                <div className="pt-2 border-t border-slate-100 flex justify-between">
                  <div className="h-3 w-16 bg-slate-100 rounded"></div>
                  <div className="h-3 w-12 bg-slate-100 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
