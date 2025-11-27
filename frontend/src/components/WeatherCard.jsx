"use client"

const WeatherCard = ({ weather, onAddFavorite, isFavorite, loading }) => {
  if (loading) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin"></div>
          <p className="text-slate-600 font-medium">Fetching weather...</p>
        </div>
      </div>
    )
  }

  if (!weather) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 text-slate-600 shadow-lg border border-slate-200">
        <p className="font-medium">📍 Choose a location to view detailed weather stats</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-2xl bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg border border-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Current Weather</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{weather.location}</h3>
          <p className="text-xs text-slate-500 mt-1">
            📌 {weather.coordinates.lat.toFixed(2)}, {weather.coordinates.lng.toFixed(2)}
          </p>
        </div>
        {weather.icon && (
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            className="h-20 w-20 drop-shadow-lg"
          />
        )}
      </div>

      <div className="flex items-end gap-6">
        <p className="text-6xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
          {Math.round(weather.temperature)}°
        </p>
        <div className="space-y-1 text-sm text-slate-700 pb-2">
          <p className="font-medium">Feels like {Math.round(weather.feelsLike)}°C</p>
          <p className="capitalize text-slate-600">{weather.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-3">
          <p className="text-xs uppercase text-blue-700 font-semibold">Humidity</p>
          <p className="text-lg font-bold text-blue-900 mt-1">{weather.humidity}%</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 p-3">
          <p className="text-xs uppercase text-indigo-700 font-semibold">Wind Speed</p>
          <p className="text-lg font-bold text-indigo-900 mt-1">{weather.windSpeed} m/s</p>
        </div>
      </div>

      {onAddFavorite && (
        <button
          type="button"
          disabled={isFavorite}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-semibold text-white transition hover:shadow-lg hover:scale-105 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-400 disabled:scale-100"
          onClick={onAddFavorite}
        >
          {isFavorite ? "★ Already in favorites" : "☆ Add to favorites"}
        </button>
      )}
    </div>
  )
}

export default WeatherCard
