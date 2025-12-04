"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import SearchBar from "../components/SearchBar.jsx"
import WeatherCard from "../components/WeatherCard.jsx"
import MapBox from "../components/MapBox.jsx"
import FavoritesList from "../components/FavoritesList.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import NewsCard from "../components/NewsCard.jsx";

const Dashboard = () => {
  const { api, user, logout } = useAuth()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [weather, setWeather] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 })
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [status, setStatus] = useState("")
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);

  const isFavorite = useMemo(() => {
    if (!selectedLocation) return false
    return favorites.some((favorite) => favorite.name === selectedLocation.name)
  }, [favorites, selectedLocation])

  const fetchNews = useCallback(
    async (lat, lng) => {
      setNewsLoading(true);
      try {
        const { data } = await api.get("/news", { params: { lat, lng } });
        setNews(data.data.news);
      } catch (err) {
        setStatus(err.response?.data?.message || "Unable to load news");
      } finally {
        setNewsLoading(false);
      }
    },
    [api],
  );

  const fetchFavorites = useCallback(async () => {
    try {
      const { data } = await api.get("/favorites")
      setFavorites(data.data.favorites)
    } catch (err) {
      setStatus(err.response?.data?.message || "Unable to load favorites")
    }
  }, [api])

  const fetchWeather = useCallback(
    async (lat, lng) => {
      setWeatherLoading(true)
      try {
        const { data } = await api.get("/weather", { params: { lat, lng } })
        setWeather(data.data.weather)
      } catch (err) {
        setStatus(err.response?.data?.message || "Unable to load weather")
      } finally {
        setWeatherLoading(false)
      }
    },
    [api],
  )

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  useEffect(() => {
    if (!status) return undefined
    const timer = setTimeout(() => setStatus(""), 4000)
    return () => clearTimeout(timer)
  }, [status])

  const handleSearch = useCallback(
    async (term) => {
      if (!term) {
        setSuggestions([])
        return
      }
      setSearchLoading(true)
      try {
        const { data } = await api.get("/search", { params: { query: term } })
        setSuggestions(data.data.locations)
      } catch (err) {
        setStatus(err.response?.data?.message || "Search failed")
      } finally {
        setSearchLoading(false)
      }
    },
    [api],
  )

  const handleSelectLocation = useCallback(
    (location) => {
      setSelectedLocation(location);
      setMapCenter({ lat: location.lat, lng: location.lng });
      setQuery("");
      setSuggestions([]);
      fetchWeather(location.lat, location.lng);
      fetchNews(location.lat, location.lng);
    },
    [fetchWeather, fetchNews],
  );

  const handleMapClick = useCallback(
    async ({ lat, lng }) => {
      try {
        const { data } = await api.get("/search/reverse", {
          params: { lat, lng },
        })
        handleSelectLocation(data.data.location)
      } catch (err) {
        setStatus(err.response?.data?.message || "Reverse lookup failed")
      }
    },
    [api, handleSelectLocation],
  )

  const handleAddFavorite = useCallback(async () => {
    if (!selectedLocation || isFavorite) return
    try {
      const { data } = await api.post("/favorites", {
        name: selectedLocation.name,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      })
      setFavorites((prev) => [data.data.favorite, ...prev])
      setStatus("Favorite saved")
    } catch (err) {
      setStatus(err.response?.data?.message || "Unable to save favorite")
    }
  }, [api, isFavorite, selectedLocation])

  const handleRemoveFavorite = useCallback(
    async (favoriteId) => {
      try {
        await api.delete(`/favorites/${favoriteId}`)
        setFavorites((prev) => prev.filter((fav) => fav._id !== favoriteId))
      } catch (err) {
        setStatus(err.response?.data?.message || "Failed to remove favorite")
      }
    },
    [api],
  )

  const handleFavoriteSelect = useCallback(
    (favorite) => {
      handleSelectLocation(favorite)
    },
    [handleSelectLocation],
  )

  return (
    <div className="min-h-screen bg-slate-950/95 px-4 py-8 text-white lg:px-12">
      <header className="mb-8 flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 shadow-2xl md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">Weather Intelligence</p>
          <h1 className="mt-2 text-3xl font-semibold">🌍 Welcome back, {user?.name}</h1>
          <p className="text-white/70">Track cities, explore with the interactive map, and pin favorites.</p>
        </div>
        <div className="flex items-center gap-1">
          <Link
            className="rounded-2xl border border-white/30 px-2 py-2 text-sm text-white/90 hover:bg-white/10 transition"
            to="/profile"
          >
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-xs font-bold mr-2">
              👤
            </span>
            Profile
          </Link>
          <button
            className="rounded-2xl border border-white/30 px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition"
            type="button"
            onClick={() => logout()}
          >
            Logout
          </button>
        </div>
      </header>

      {status && (
        <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">{status}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            suggestions={suggestions}
            loading={searchLoading}
            onSearch={handleSearch}
            onSelect={handleSelectLocation}
          />
          <WeatherCard
            weather={weather}
            loading={weatherLoading}
            onAddFavorite={handleAddFavorite}
            isFavorite={isFavorite}
          />
          <NewsCard news={news} loading={newsLoading} />
          <FavoritesList favorites={favorites} onSelect={handleFavoriteSelect} onRemove={handleRemoveFavorite} />
        </div>
        <div className="lg:col-span-2">
          <MapBox
            center={mapCenter}
            selectedLocation={selectedLocation}
            onMapClick={handleMapClick}
            onMove={setMapCenter}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
