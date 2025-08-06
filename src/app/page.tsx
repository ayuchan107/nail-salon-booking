mport Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            💅 ネイルサロン
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            予約システム
          </p>
          
          <div className="space-y-4">
            <Link
              href="/customer"
              className="block w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
            >
              👤 お客様用
            </Link>
            
            <Link
              href="/admin"
              className="block w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
            >
              🔧 管理者用
            </Link>
          </div>
          
          <p className="text-gray-500 text-sm mt-8">
            ご利用になるページを選択してください
          </p>
        </div>
      </div>
    </div>
  )
}