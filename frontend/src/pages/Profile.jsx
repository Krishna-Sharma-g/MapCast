"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

const Profile = () => {
  const { user, logout, deleteAccount, api } = useAuth()
  const navigate = useNavigate()

  // Avatar and theme state
  const [selectedAvatar, setSelectedAvatar] = useState(() => localStorage.getItem("userAvatar") || "👤")
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true")

  // Account settings state
  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState(user?.name || "")
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" })

  // Favorites state
  const [favorites, setFavorites] = useState([])
  const [favoritesLoading, setFavoritesLoading] = useState(true)

  // Confirmation dialogs
  const [confirming, setConfirming] = useState(false)
  const [updateMessage, setUpdateMessage] = useState("")

  const avatarOptions = ["👤", "😊", "🌟", "🎨", "🚀"]

  // Apply dark mode
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode)
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Save avatar selection
  useEffect(() => {
    localStorage.setItem("userAvatar", selectedAvatar)
  }, [selectedAvatar])

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data } = await api.get("/favorites")
        setFavorites(data.data.favorites)
      } catch (err) {
        console.error("Failed to load favorites:", err)
      } finally {
        setFavoritesLoading(false)
      }
    }
    fetchFavorites()
  }, [api])

  const handleNameUpdate = async () => {
    try {
      // In a real app, you'd call an API endpoint to update the name
      // For now, we'll just update localStorage
      setUpdateMessage("Name would be updated via API")
      setTimeout(() => setUpdateMessage(""), 3000)
      setIsEditingName(false)
    } catch (err) {
      setUpdateMessage("Failed to update name")
    }
  }

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setUpdateMessage("Passwords do not match")
      setTimeout(() => setUpdateMessage(""), 3000)
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setUpdateMessage("Password must be at least 6 characters")
      setTimeout(() => setUpdateMessage(""), 3000)
      return
    }
    try {
      // In a real app, you'd call an API endpoint to change password
      setUpdateMessage("Password would be changed via API")
      setTimeout(() => setUpdateMessage(""), 3000)
      setIsChangingPassword(false)
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err) {
      setUpdateMessage("Failed to change password")
    }
  }

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await api.delete(`/favorites/${favoriteId}`)
      setFavorites((prev) => prev.filter((fav) => fav._id !== favoriteId))
      setUpdateMessage("Favorite removed")
      setTimeout(() => setUpdateMessage(""), 3000)
    } catch (err) {
      setUpdateMessage("Failed to remove favorite")
    }
  }

  const handleDelete = async () => {
    await deleteAccount()
    navigate("/login")
  }

  return (
    <div
      className={`min-h-screen transition-colors ${darkMode ? "bg-slate-950 text-white" : "bg-gradient-to-br from-blue-50 to-indigo-50 text-slate-900"}`}
    >
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition flex items-center gap-1"
            onClick={() => navigate("/")}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Update Message */}
        {updateMessage && (
          <div
            className={`mb-6 rounded-xl p-4 text-sm font-medium ${
              updateMessage.includes("Failed") || updateMessage.includes("not match")
                ? darkMode
                  ? "bg-red-900/30 text-red-300"
                  : "bg-red-100 text-red-700"
                : darkMode
                  ? "bg-green-900/30 text-green-300"
                  : "bg-green-100 text-green-700"
            }`}
          >
            {updateMessage}
          </div>
        )}

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar - Avatar & Theme */}
          <div
            className={`rounded-2xl p-6 shadow-lg ${darkMode ? "bg-slate-900/50 border border-slate-700" : "bg-white"}`}
          >
            <h2 className="text-lg font-bold mb-6">Settings</h2>

            {/* Avatar Section */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">Avatar</h3>
              <div
                className={`flex justify-center items-center text-6xl mb-4 p-4 rounded-xl ${darkMode ? "bg-slate-800/50" : "bg-slate-100"}`}
              >
                {selectedAvatar}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`rounded-lg text-2xl p-2 transition ${
                      selectedAvatar === avatar
                        ? darkMode
                          ? "bg-blue-600 ring-2 ring-blue-400"
                          : "bg-blue-500 ring-2 ring-blue-300"
                        : darkMode
                          ? "bg-slate-800 hover:bg-slate-700"
                          : "bg-slate-200 hover:bg-slate-300"
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="border-t pt-6" style={darkMode ? { borderTopColor: "rgb(55 65 81)" } : {}}>
              <div className="flex items-center justify-between">
                <label htmlFor="theme-toggle" className="text-sm font-semibold">
                  Theme
                </label>
                <button
                  id="theme-toggle"
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 rounded-full transition ${
                    darkMode ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                      darkMode ? "translate-x-6" : "translate-x-1"
                    } mt-0.5`}
                  />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">{darkMode ? "Dark Mode" : "Light Mode"}</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Info */}
            <div
              className={`rounded-2xl p-6 shadow-lg ${darkMode ? "bg-slate-900/50 border border-slate-700" : "bg-white"}`}
            >
              <h2 className="text-lg font-bold mb-6">Account Information</h2>

              {/* Email */}
              <div className="mb-6">
                <p className="text-xs uppercase text-slate-500 font-semibold mb-2">Email</p>
                <p className="text-base font-medium">{user?.email}</p>
              </div>

              {/* Name Edit */}
              <div className="mb-6">
                <p className="text-xs uppercase text-slate-500 font-semibold mb-2">Name</p>
                {isEditingName ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className={`flex-1 rounded-lg px-3 py-2 text-sm border transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleNameUpdate}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingName(false)
                        setNewName(user?.name || "")
                      }}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                        darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-200 hover:bg-slate-300"
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-base font-medium">{user?.name}</p>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(true)}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Password Change */}
              <div>
                {isChangingPassword ? (
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Current password"
                      value={passwordForm.oldPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                      className={`w-full rounded-lg px-3 py-2 text-sm border transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"
                      }`}
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className={`w-full rounded-lg px-3 py-2 text-sm border transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"
                      }`}
                    />
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className={`w-full rounded-lg px-3 py-2 text-sm border transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"
                      }`}
                    />
                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handlePasswordChange}
                        className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                      >
                        Update Password
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsChangingPassword(false)
                          setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
                        }}
                        className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                          darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-200 hover:bg-slate-300"
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(true)}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                  >
                    Change Password
                  </button>
                )}
              </div>
            </div>

            {/* Favorites */}
            <div
              className={`rounded-2xl p-6 shadow-lg ${darkMode ? "bg-slate-900/50 border border-slate-700" : "bg-white"}`}
            >
              <h2 className="text-lg font-bold mb-4">Saved Locations</h2>

              {favoritesLoading ? (
                <p className="text-slate-500">Loading favorites...</p>
              ) : favorites.length === 0 ? (
                <p className="text-slate-500 text-sm">No saved locations yet. Add favorites from the dashboard!</p>
              ) : (
                <ul className="space-y-2">
                  {favorites.map((favorite) => (
                    <li
                      key={favorite._id}
                      className={`flex items-center justify-between rounded-lg p-3 ${
                        darkMode ? "bg-slate-800/50" : "bg-slate-100"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{favorite.name}</p>
                        <p className="text-xs text-slate-500">
                          📍 {favorite.lat.toFixed(2)}, {favorite.lng.toFixed(2)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFavorite(favorite._id)}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 transition"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Danger Zone */}
            <div
              className={`rounded-2xl p-6 shadow-lg border-2 ${
                darkMode ? "bg-red-900/20 border-red-700/50" : "bg-red-50 border-red-200"
              }`}
            >
              <h2 className="text-lg font-bold mb-4 text-red-600">Danger Zone</h2>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-slate-500 mt-1">This action is permanent</p>
                </div>
                {confirming ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
                    >
                      Confirm Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirming(false)}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                        darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-200 hover:bg-slate-300"
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirming(true)}
                    className="rounded-lg border-2 border-red-600 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                  >
                    Delete Account
                  </button>
                )}
              </div>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={() => {
                logout()
                navigate("/login")
              }}
              className="w-full rounded-lg border-2 border-slate-300 px-4 py-3 font-semibold transition hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
