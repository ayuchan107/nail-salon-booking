'use client'

import Link from 'next/link'
import ReservationSystem from '@/components/ReservationSystem'

export default function CustomerPage() {
  return (
    <div>
      {/* お客様用の予約システム */}
      <ReservationSystem isAdminMode={false} />
    </div>
  )
}
