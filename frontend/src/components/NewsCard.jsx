const NewsCard = ({ news, loading }) => {
    if (loading) {
        return (
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin"></div>
                    <p className="text-slate-600 font-medium">Loading nearby news...</p>
                </div>
            </div>
        );
    }

    if (!news || news.length === 0) {
        return (
            <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 text-slate-600 shadow-lg border border-slate-200">
                <p className="font-medium">📰 Select a location to see local news</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 rounded-2xl bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                        Local News
                    </p>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">
                        📰 Top Headlines
                    </h3>
                </div>
                <span className="text-xs text-slate-500">{news.length} articles</span>
            </div>

            <ul className="space-y-3">
                {news.map((article, index) => (
                    <li
                        key={article.id}
                        className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-4 hover:shadow-md transition"
                    >
                        <div className="flex gap-3">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                                {index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-slate-900 line-clamp-2">
                                    {article.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                                    <span className="font-medium">{article.source}</span>
                                    <span>•</span>
                                    <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NewsCard;