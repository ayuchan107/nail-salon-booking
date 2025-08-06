'use client'

import Link from 'next/link'
import ReservationSystem from '@/components/ReservationSystem'

export default function CustomerPage() {
  return (
    <div>
      {/* 従業員用ページへのリンク */}
      <div className="fixed top-4 right-4 z-50">
        <Link
          href="/admin"
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          従業員ログイン
        </Link>
      </div>
      
      {/* お客様用の予約システム */}
      <ReservationSystem isAdminMode={false} />
    </div>
  )
}
