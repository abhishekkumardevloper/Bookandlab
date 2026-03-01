export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-red-600">403</h1>
        <h2 className="text-2xl font-semibold text-gray-900">Access Denied</h2>
        <p className="text-gray-600 max-w-sm mx-auto">
          You do not have the required permissions to access this area.
        </p>
        <a 
          href="/" 
          className="inline-block px-6 py-3 mt-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}
