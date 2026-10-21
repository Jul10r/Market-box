import Link from 'next/link'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-white border-t border-slate-200 mt-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div className="space-y-3">
                        <Link href="/" className="inline-block">
                            <img src="/logo.svg" alt="MarketBox" className="h-7 w-auto" />
                        </Link>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                            A community marketplace showcase built with Next.js, React, Drizzle, and Tailwind CSS.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
                            Marketplace
                        </h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>
                                <Link href="/" className="hover:text-slate-900 transition">
                                    Browse Listings
                                </Link>
                            </li>
                            <li>
                                <Link href="/listings/new" className="hover:text-slate-900 transition">
                                    Sell an Item
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="hover:text-slate-900 transition">
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
                            Connect
                        </h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>
                                <a
                                    href="https://github.com/Jul10r/Market-box"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-slate-900 transition inline-flex items-center gap-1.5"
                                >
                                    <span>Source Code</span>
                                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/Jul10r"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-slate-900 transition inline-flex items-center gap-1.5"
                                >
                                    <span>GitHub</span>
                                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://jul10r.github.io/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-slate-900 transition inline-flex items-center gap-1.5"
                                >
                                    <span>Portfolio</span>
                                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
                    <p>© {currentYear} MarketBox. Portfolio showcase project.</p>
                    <p className="text-slate-400">Created for demonstration purposes</p>
                </div>
            </div>
        </footer>
    )
}