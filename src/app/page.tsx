import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🛍️ Fashion Store</h1>
          <p className="text-xl text-gray-600 mb-8">Modern E-commerce Platform</p>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Fashion E-commerce</h2>

          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🔐 Login / Sign In
            </Link>

            <Link
              href="/profile"
              className="block w-full bg-green-600 text-white text-center py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              👤 Profile
            </Link>

            <div className="block w-full bg-gray-400 text-white text-center py-3 px-4 rounded-lg cursor-not-allowed font-medium opacity-50">
              🛒 Shop (Coming Soon)
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">🏗️ Architecture Features:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ Self-contained features</li>
                <li>✅ Redux Toolkit + Saga</li>
                <li>✅ TypeScript strict mode</li>
                <li>✅ SCSS modules</li>
                <li>✅ Next.js 15 App Router</li>
                <li>✅ Profile Management</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">🚀 Demo Instructions:</h3>
              <p className="text-sm text-blue-700">
                Click &quot;Login / Sign In&quot; to test the authentication feature.
                Use any email/password combination - it&apos;s a demo!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
