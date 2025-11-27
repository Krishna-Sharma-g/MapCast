"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

const Login = () => {
  const navigate = useNavigate()
  const { login, loading, error, token, setError } = useAuth()
  const [form, setForm] = useState({ email: "", password: "" })

  useEffect(() => {
    if (token) {
      navigate("/", { replace: true })
    }
  }, [token, navigate])

  const handleChange = (event) => {
    setError(null)
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await login(form)
    navigate("/")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="text-5xl mb-2">💧</div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-3 text-sm text-slate-600">Track weather across the globe</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input
              className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <input
              className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-3 border border-red-200">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:shadow-lg disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-500">New here?</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          <Link className="font-semibold text-blue-600 hover:text-blue-700 transition" to="/signup">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
