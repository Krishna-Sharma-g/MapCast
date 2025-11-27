const FavoritesList = ({ favorites, onSelect, onRemove }) => (
  <div className="rounded-2xl bg-white/90 p-4 shadow-lg">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-slate-900">Favorites</h3>
      <p className="text-sm text-slate-500">{favorites.length} saved</p>
    </div>

    {favorites.length === 0 ? (
      <p className="mt-4 text-sm text-slate-500">
        Save locations to access them instantly.
      </p>
    ) : (
      <ul className="mt-4 space-y-3">
        {favorites.map((favorite) => (
          <li
            key={favorite._id}
            className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
          >
            <button
              type="button"
              onClick={() => onSelect(favorite)}
              className="flex-1 text-left text-sm font-medium text-slate-800 hover:text-brand"
            >
              {favorite.name}
            </button>
            <button
              type="button"
              className="text-xs font-semibold text-rose-500 hover:text-rose-600"
              onClick={() => onRemove(favorite._id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default FavoritesList;
