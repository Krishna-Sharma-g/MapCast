export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Weather + Map Dashboard</h1>
        <p className="text-slate-600 mb-8">
          This is a full-stack application with separate frontend and backend. The main React application is located in
          the <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">frontend/</code> directory.
        </p>
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            To run the frontend:{" "}
            <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono block mt-2">
              cd frontend && npm run dev
            </code>
          </p>
          <p className="text-sm text-slate-500">
            To run the backend:{" "}
            <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono block mt-2">
              cd backend && npm run dev
            </code>
          </p>
        </div>
      </div>
    </div>
  )
}
