'use client'

import { useState, useEffect } from 'react'

// 型定義
interface Staff {
  id: string
  name: string
  menuIds: string[]
}

interface MenuItem {
  id: string
  name: string
  duration: number
  price: number
  staffId: string
}

interface CustomerInfo {
  name: string
  phone: string
  menu: MenuItem
  staff: Staff
}

interface TimeSlot {
  id: string
  time: string
  isAvailable: boolean
  customerInfo?: CustomerInfo
}

interface DaySchedule {
  date: string
  slots: TimeSlot[]
}

interface ReservationRecord {
  id: string
  date: string
  time: string
  customerInfo: CustomerInfo
  serviceNote?: string
  completed: boolean
}

interface TimeRequest {
  id: string
  customerName: string
  customerPhone: string
  staff: Staff
  menu: MenuItem
  preferredDate?: string
  preferredTime?: string
  timeRequest: string
  submitted: boolean
  createdAt: string
  status: 'pending' | 'contacted' | 'scheduled' | 'declined'
  adminNotes?: string
}

interface ReservationSystemProps {
  isAdminMode: boolean
}

export default function ReservationSystem({ isAdminMode }: ReservationSystemProps) {
  const [schedules, setSchedules] = useState<DaySchedule[]>([])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null)
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showManagement, setShowManagement] = useState(false)
  const [reservationHistory, setReservationHistory] = useState<ReservationRecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<ReservationRecord | null>(null)
  const [serviceNote, setServiceNote] = useState('')
  
  // 週表示用の状態
  const [currentWeek, setCurrentWeek] = useState(0) // 0: 今週, 1: 来週, 2: 再来週, 3: 3週目
  
  // 担当者関連の状態
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [currentStaffView, setCurrentStaffView] = useState<string>('')
  
  // UI フロー制御
  const [currentStep, setCurrentStep] = useState<'staff' | 'menu' | 'schedule'>('staff')
  
  // メニュー管理用の状態
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [showMenuManagement, setShowMenuManagement] = useState(false)
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null)
  const [menuForm, setMenuForm] = useState({
    name: '',
    duration: '',
    price: ''
  })
  
  // 担当者管理用の状態
  const [showStaffManagement, setShowStaffManagement] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [staffForm, setStaffForm] = useState({
    name: '',
    selectedMenus: [] as string[]
  })
  
  // 時間要望関連の状態
  const [timeRequests, setTimeRequests] = useState<TimeRequest[]>([])
  const [showTimeRequestManagement, setShowTimeRequestManagement] = useState(false)
  const [selectedTimeRequest, setSelectedTimeRequest] = useState<TimeRequest | null>(null)
  const [adminNotes, setAdminNotes] = useState('')

  // お客様用時間要望フォーム関連の状態
  const [showTimeRequestForm, setShowTimeRequestForm] = useState(false)
  const [timeRequestForm, setTimeRequestForm] = useState({
    customerName: '',
    customerPhone: '',
    preferredDate: '',
    preferredTime: '',
    timeRequest: '',
    selectedStaff: null as Staff | null,
    selectedMenu: null as MenuItem | null
  })

  // 担当者フィルター用の状態
  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>('')

  // 初期データ読み込み
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = () => {
    // サンプル担当者データ
    const initialStaff: Staff[] = [
      { id: '1', name: '田中さん', menuIds: ['1', '2', '3'] },
      { id: '2', name: '佐藤さん', menuIds: ['2', '3', '4'] },
      { id: '3', name: '山田さん', menuIds: ['1', '3', '4'] }
    ]

    // サンプルメニューデータ
    const initialMenus: MenuItem[] = [
      { id: '1', name: 'シンプルネイル', duration: 60, price: 5000, staffId: '1' },
      { id: '2', name: 'デザインネイル', duration: 90, price: 7000, staffId: '1' },
      { id: '3', name: 'ジェルネイル', duration: 120, price: 8000, staffId: '2' },
      { id: '4', name: 'ケア＋カラー', duration: 90, price: 6000, staffId: '2' },
      { id: '5', name: 'アート', duration: 150, price: 10000, staffId: '3' }
    ]

    setStaffList(initialStaff)
    setMenuItems(initialMenus)
    
    // 初期フィルターを最初の担当者に設定
    if (initialStaff.length > 0) {
      setSelectedStaffFilter(initialStaff[0].id)
    }
    
    generateSchedules()

    // LocalStorageからデータを読み込み
    const savedReservations = localStorage.getItem('reservations')
    if (savedReservations) {
      setReservationHistory(JSON.parse(savedReservations))
    }

    const savedTimeRequests = localStorage.getItem('timeRequests')
    if (savedTimeRequests) {
      const parsedRequests = JSON.parse(savedTimeRequests)
      console.log('📥 Loading time requests from localStorage:', parsedRequests)
      setTimeRequests(parsedRequests)
    } else {
      console.log('📝 No time requests found in localStorage')
    }
  }

  const generateSchedules = () => {
    // LocalStorageから既存のスケジュールを確認
    const savedSchedules = localStorage.getItem('schedules')
    
    if (savedSchedules) {
      console.log('📥 Loading schedules from localStorage')
      setSchedules(JSON.parse(savedSchedules))
      return
    }
    
    console.log('🆕 Generating new schedules')
    const newSchedules: DaySchedule[] = []
    const today = new Date()
    
    for (let i = 0; i < 30; i++) { // 1ヶ月先まで予約可能
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateString = date.toISOString().split('T')[0]
      
      const slots: TimeSlot[] = []
      for (let hour = 10; hour <= 22; hour++) {
        const timeString = `${hour.toString().padStart(2, '0')}:00`
        slots.push({
          id: `${dateString}-${timeString}`,
          time: timeString,
          isAvailable: true // 初期状態は全て空き
        })
      }
      
      newSchedules.push({
        date: dateString,
        slots
      })
    }
    
    setSchedules(newSchedules)
    // 初期生成時にLocalStorageに保存
    localStorage.setItem('schedules', JSON.stringify(newSchedules))
  }

  // 予約競合チェック関数
  const canMakeReservation = (startTime: string, duration: number, date: string): boolean => {
    const startHour = parseInt(startTime.split(':')[0])
    const slotsNeeded = Math.ceil(duration / 60) // 施術に必要な時間枠数
    
    // 対象日のスケジュールを取得
    const targetSchedule = schedules.find(schedule => schedule.date === date)
    if (!targetSchedule) return false
    
    console.log('🔍 Checking reservation availability:', {
      startTime,
      duration,
      date,
      startHour,
      slotsNeeded,
      requiredSlots: Array.from({length: slotsNeeded}, (_, i) => startHour + i)
    })
    
    // 必要な全ての時間枠をチェック
    for (let i = 0; i < slotsNeeded; i++) {
      const checkHour = startHour + i
      const checkTime = `${checkHour.toString().padStart(2, '0')}:00`
      
      const slot = targetSchedule.slots.find(s => s.time === checkTime)
      
      if (!slot) {
        console.log('❌ Slot not found:', checkTime)
        return false
      }
      
      if (!slot.isAvailable) {
        console.log('❌ Slot not available:', checkTime, {
          isAvailable: slot.isAvailable,
          hasCustomerInfo: !!slot.customerInfo
        })
        return false
      }
      
      console.log('✅ Slot available:', checkTime)
    }
    
    console.log('✅ All required slots are available')
    return true
  }

  // 特定スロットの予約競合影響をチェックする関数
  const getReservationConflicts = (targetTime: string, targetDate: string) => {
    const conflicts: string[] = []
    
    // 標準的な施術時間（60分, 90分, 120分）での影響をチェック
    const commonDurations = [60, 90, 120]
    
    commonDurations.forEach(duration => {
      const slotsNeeded = Math.ceil(duration / 60)
      const targetHour = parseInt(targetTime.split(':')[0])
      
      // このスロットを含む可能性のある予約開始時間をチェック
      for (let i = 1; i < slotsNeeded; i++) {
        const startHour = targetHour - i
        if (startHour >= 10) { // 営業時間内
          const startTime = `${startHour.toString().padStart(2, '0')}:00`
          if (!canMakeReservation(startTime, duration, targetDate)) {
            conflicts.push(`${startTime}〜${duration}分の施術`)
          }
        }
      }
    })
    
    return conflicts
  }

  const handleSlotClick = (slot: TimeSlot, date: string) => {
    // 基本的な空き状況チェック
    if (!slot.isAvailable) return
    
    // 選択されたメニューがある場合は競合チェック
    if (selectedMenu && !canMakeReservation(slot.time, selectedMenu.duration, date)) {
      alert(`⚠️ 予約できません\n\n${selectedMenu.name}（${selectedMenu.duration}分）を${slot.time}から開始する場合、\n必要な時間枠が確保できません。\n\n別の時間をお選びください。`)
      return
    }
    
    console.log('Slot clicked:', {
      slot,
      date,
      slotId: slot.id,
      generatedId: `${date}-${slot.time}`,
      menuDuration: selectedMenu?.duration
    })
    
    setSelectedSlot({ ...slot, id: slot.id })
    setShowReservationForm(true)
  }

  // スロットの可用性を切り替える関数（管理者用）
  const toggleSlotAvailability = (slot: TimeSlot, date: string) => {
    if (slot.customerInfo) return // 予約済みは変更不可
    
    console.log('🔄 Toggle slot availability:', {
      date,
      time: slot.time,
      currentAvailable: slot.isAvailable,
      willBecome: !slot.isAvailable,
      slotId: slot.id,
      hasCustomerInfo: !!slot.customerInfo
    })
    
    setSchedules(prev => {
      const updated = prev.map(schedule => 
        schedule.date === date
          ? {
              ...schedule,
              slots: schedule.slots.map(s => {
                if (s.time === slot.time) {
                  console.log('✅ Updating slot:', s.time, 'from', s.isAvailable, 'to', !s.isAvailable)
                  return { ...s, isAvailable: !s.isAvailable }
                }
                return s
              })
            }
          : schedule
      )
      
      console.log('📊 Updated schedules:', updated)
      // LocalStorageに保存
      localStorage.setItem('schedules', JSON.stringify(updated))
      return updated
    })
  }

  // 施術時間分の後続スロットをブロックする関数
  const blockFollowingSlots = (startTime: string, duration: number, date: string, staffId: string) => {
    const startHour = parseInt(startTime.split(':')[0])
    const slotsToBlock = Math.ceil(duration / 60) // 60分単位でスロット数を計算
    
    console.log('=== Blocking slots debug ===')
    console.log('Input params:', {
      startTime,
      duration,
      date,
      staffId
    })
    console.log('Calculated values:', {
      startHour,
      slotsToBlock,
      targetHours: Array.from({length: slotsToBlock}, (_, i) => startHour + i + 1)
    })
    
    setSchedules(prev => {
      const updatedSchedules = prev.map(schedule => {
        if (schedule.date === date) {
          console.log('Processing schedule for date:', date)
          
          const updatedSlots = schedule.slots.map(slot => {
            const slotHour = parseInt(slot.time.split(':')[0])
            const isInBlockRange = slotHour > startHour && slotHour <= startHour + slotsToBlock
            
            console.log(`Checking slot ${slot.time}:`, {
              slotHour,
              isInBlockRange,
              condition: `${slotHour} > ${startHour} && ${slotHour} <= ${startHour + slotsToBlock}`,
              isAvailable: slot.isAvailable,
              hasCustomerInfo: !!slot.customerInfo
            })
            
            if (isInBlockRange && slot.isAvailable && !slot.customerInfo) {
              console.log('🔒 BLOCKING slot:', slot.time, 'for staff:', staffId)
              return { 
                ...slot, 
                isAvailable: false,
                customerInfo: undefined // 施術時間による自動ブロック
              }
            }
            return slot
          })
          
          return {
            ...schedule,
            slots: updatedSlots
          }
        }
        return schedule
      })
      
      console.log('=== End blocking debug ===')
      return updatedSchedules
    })
  }

  // 予約データリセット関数
  const resetAllReservations = () => {
    if (window.confirm('⚠️ 警告: 全ての予約データとスケジュールをリセットします。\n\n・全予約履歴が削除されます\n・全てのスケジュール枠が空き状態に戻ります\n・この操作は取り消せません\n\n本当に実行しますか？')) {
      
      // 二重確認
      if (window.confirm('🔴 最終確認\n\n現在の予約件数: ' + reservationHistory.length + '件\n\n本当に全てのデータを削除しますか？\n\n※この操作は元に戻せません※')) {
        
        // 予約履歴をクリア
        setReservationHistory([])
        localStorage.removeItem('reservations')
        
        // 時間要望もクリア
        setTimeRequests([])
        localStorage.removeItem('timeRequests')
        
        // スケジュールもクリア
        localStorage.removeItem('schedules')
        
        // スケジュールを再生成（全て空き状態）
        const newSchedules: DaySchedule[] = []
        const today = new Date()
        
        for (let i = 0; i < 30; i++) { // 1ヶ月先まで予約可能
          const date = new Date(today)
          date.setDate(today.getDate() + i)
          const dateString = date.toISOString().split('T')[0]
          
          const slots: TimeSlot[] = []
          for (let hour = 10; hour <= 22; hour++) {
            const timeString = `${hour.toString().padStart(2, '0')}:00`
            slots.push({
              id: `${dateString}-${timeString}`,
              time: timeString,
              isAvailable: true // 全て空き状態に
            })
          }
          
          newSchedules.push({
            date: dateString,
            slots
          })
        }
        
        setSchedules(newSchedules)
        // 新しいスケジュールをLocalStorageに保存
        localStorage.setItem('schedules', JSON.stringify(newSchedules))
        
        console.log('All reservation data has been reset')
        alert('✅ 全ての予約データがリセットされました。\n\n・予約履歴: 削除完了\n・スケジュール: 全枠空き状態\n・時間要望: 削除完了')
      }
    }
  }

  // 強制的にスケジュールを再生成する関数
  const forceRegenerateSchedules = () => {
    if (window.confirm('🔄 スケジュールデータを強制再生成します。\n\n・現在のスケジュール設定がリセットされます\n・30日分の新しいスケジュールが作成されます\n・予約データは保持されます\n\n実行しますか？')) {
      console.log('🔄 Force regenerating 30-day schedules...')
      
      // LocalStorageからスケジュールのみを削除
      localStorage.removeItem('schedules')
      
      // 30日分の新しいスケジュールを生成
      const newSchedules: DaySchedule[] = []
      const today = new Date()
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        const dateString = date.toISOString().split('T')[0]
        
        const slots: TimeSlot[] = []
        for (let hour = 10; hour <= 22; hour++) {
          const timeString = `${hour.toString().padStart(2, '0')}:00`
          slots.push({
            id: `${dateString}-${timeString}`,
            time: timeString,
            isAvailable: true
          })
        }
        
        newSchedules.push({
          date: dateString,
          slots
        })
      }
      
      setSchedules(newSchedules)
      localStorage.setItem('schedules', JSON.stringify(newSchedules))
      setCurrentWeek(0) // 最初の週に戻す
      
      console.log('✅ Generated 30-day schedules:', newSchedules.length, 'days')
      alert(`✅ 30日分のスケジュールを再生成しました！\n\n・総日数: ${newSchedules.length}日\n・週数: ${Math.ceil(newSchedules.length / 7)}週\n・期間: ${formatDate(newSchedules[0].date)} 〜 ${formatDate(newSchedules[newSchedules.length - 1].date)}`)
    }
  }

  const handleReservation = () => {
    if (!selectedSlot || !customerName || !selectedMenu || !selectedStaff) return

    // 選択されたスロットIDから日付を抽出 (例: "2025-08-05-14:00" -> "2025-08-05")
    const parts = selectedSlot.id.split('-')
    const reservationDate = `${parts[0]}-${parts[1]}-${parts[2]}`
    
    console.log('🎯 Starting reservation process:', {
      time: selectedSlot.time,
      duration: selectedMenu.duration,
      date: reservationDate,
      staffId: selectedStaff.id,
      menuName: selectedMenu.name,
      customerName
    })
    
    const newReservation: ReservationRecord = {
      id: `${Date.now()}`,
      date: reservationDate,
      time: selectedSlot.time,
      customerInfo: {
        name: customerName,
        phone: customerPhone,
        menu: selectedMenu,
        staff: selectedStaff
      },
      completed: false
    }

    setReservationHistory(prev => [...prev, newReservation])
    localStorage.setItem('reservations', JSON.stringify([...reservationHistory, newReservation]))

    // スケジュールを更新（予約スロットを埋める + 後続スロットもブロック）
    setSchedules(prev => {
      console.log('📅 Updating schedules...')
      
      const updated = prev.map(schedule => {
        if (schedule.slots.some(slot => slot.id === selectedSlot.id)) {
          const startHour = parseInt(selectedSlot.time.split(':')[0])
          const slotsToBlock = Math.ceil(selectedMenu.duration / 60)
          
          console.log('Processing schedule for reservation:', {
            date: schedule.date,
            startTime: selectedSlot.time,
            startHour,
            duration: selectedMenu.duration,
            slotsToBlock
          })
          
          const updatedSlots = schedule.slots.map(slot => {
            const slotHour = parseInt(slot.time.split(':')[0])
            
            // 予約スロット自体を埋める
            if (slot.id === selectedSlot.id) {
              console.log('📝 Booking main slot:', slot.time)
              return { ...slot, isAvailable: false, customerInfo: newReservation.customerInfo }
            }
            
            // 後続スロットをブロック
            const isInBlockRange = slotHour > startHour && slotHour <= startHour + slotsToBlock
            if (isInBlockRange && slot.isAvailable && !slot.customerInfo) {
              console.log('🔒 Blocking following slot:', slot.time)
              return { 
                ...slot, 
                isAvailable: false,
                customerInfo: undefined // 施術時間による自動ブロック
              }
            }
            
            return slot
          })
          
          return {
            ...schedule,
            slots: updatedSlots
          }
        }
        return schedule
      })
      
      // LocalStorageに保存
      localStorage.setItem('schedules', JSON.stringify(updated))
      return updated
    })

    // 予約完了メッセージ
    alert(`✅ 予約が完了しました！\n\n📅 ${formatDate(reservationDate)} ${selectedSlot.time}\n👤 ${customerName} 様\n👩‍💼 担当: ${selectedStaff.name}\n💅 ${selectedMenu.name}\n💰 ¥${selectedMenu.price.toLocaleString()}\n\nご来店をお待ちしております♪`)

    // フォームをリセット
    setShowReservationForm(false)
    setSelectedSlot(null)
    setCustomerName('')
    setCustomerPhone('')
    setSelectedMenu(null)
    setCurrentStep('staff')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const days = ['日', '月', '火', '水', '木', '金', '土']
    return `${date.getMonth() + 1}/${date.getDate()}(${days[date.getDay()]})`
  }

  // 担当者別メニューフィルタリング関数
  const getAvailableMenusForStaff = (staffId: string) => {
    return menuItems.filter(menu => menu.staffId === staffId)
  }

  // 担当者情報を取得
  const getStaffById = (staffId: string) => {
    return staffList.find(staff => staff.id === staffId)
  }

  // 週表示用のヘルパー関数
  const getWeekSchedules = (weekOffset: number) => {
    const startIndex = weekOffset * 7
    const endIndex = startIndex + 7
    const weekSchedules = schedules.slice(startIndex, endIndex)
    
    console.log('📅 Getting week schedules:', {
      weekOffset,
      startIndex,
      endIndex,
      totalSchedules: schedules.length,
      weekSchedulesCount: weekSchedules.length
    })
    
    return weekSchedules
  }

  const getWeekLabel = (weekOffset: number) => {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() + (weekOffset * 7))
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)
    
    const formatShort = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`
    
    if (weekOffset === 0) {
      return `今週 (${formatShort(startDate)} - ${formatShort(endDate)})`
    } else if (weekOffset === 1) {
      return `来週 (${formatShort(startDate)} - ${formatShort(endDate)})`
    } else {
      return `${weekOffset + 1}週目 (${formatShort(startDate)} - ${formatShort(endDate)})`
    }
  }

  const maxWeeks = Math.ceil(30 / 7) // 30日 ÷ 7日 = 約5週間

  // 時間要望フォームの送信処理
  const submitTimeRequest = () => {
    if (!timeRequestForm.customerName || !timeRequestForm.customerPhone || !timeRequestForm.timeRequest) {
      alert('お名前、お電話番号、ご要望は必須です。')
      return
    }

    if (!timeRequestForm.selectedStaff) {
      alert('担当者が選択されていません。')
      return
    }

    const newRequest: TimeRequest = {
      id: Date.now().toString(),
      customerName: timeRequestForm.customerName,
      customerPhone: timeRequestForm.customerPhone,
      staff: timeRequestForm.selectedStaff!,
      menu: timeRequestForm.selectedMenu!,
      preferredDate: timeRequestForm.preferredDate || '指定なし',
      preferredTime: timeRequestForm.preferredTime || '指定なし',
      timeRequest: timeRequestForm.timeRequest,
      submitted: true,
      status: 'pending',
      createdAt: new Date().toISOString(),
      adminNotes: ''
    }

    const updatedRequests = [...timeRequests, newRequest]
    setTimeRequests(updatedRequests)
    localStorage.setItem('timeRequests', JSON.stringify(updatedRequests))
    
    console.log('💾 Saved time request to localStorage:', newRequest)
    
    // フォームをリセット
    setTimeRequestForm({
      customerName: '',
      customerPhone: '',
      preferredDate: '',
      preferredTime: '',
      timeRequest: '',
      selectedStaff: null,
      selectedMenu: null
    })
    
    setShowTimeRequestForm(false)
    alert(`${timeRequestForm.selectedStaff.name}様への時間要望を送信しました。サロンからのご連絡をお待ちください。`)
  }

  // お客様用のシンプルな表示
  if (!isAdminMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              💅 サロン予約システム
            </h1>
            <p className="text-gray-600">お好きな日時をお選びください</p>
          </div>

          {/* お客様用：担当者選択 */}
          {currentStep === 'staff' && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-6">
                担当者を選択してください
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {staffList.map(staff => (
                  <button
                    key={staff.id}
                    onClick={() => {
                      setSelectedStaff(staff)
                      setCurrentStep('menu')
                    }}
                    className="p-4 border-2 border-pink-200 rounded-lg hover:border-pink-400 hover:bg-pink-50 transition-colors"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">👩‍💼</div>
                      <div className="font-semibold text-gray-800">{staff.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* お客様用：メニュー選択 */}
          {currentStep === 'menu' && selectedStaff && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setCurrentStep('staff')}
                  className="text-pink-600 hover:text-pink-800"
                >
                  ← 担当者選択に戻る
                </button>
                <h3 className="text-xl font-semibold text-gray-800">
                  メニューを選択してください（{selectedStaff.name}）
                </h3>
                <div></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {getAvailableMenusForStaff(selectedStaff.id).map(menu => (
                  <button
                    key={menu.id}
                    onClick={() => {
                      setSelectedMenu(menu)
                      setCurrentStep('schedule')
                    }}
                    className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors text-left"
                  >
                    <div className="font-semibold text-gray-800 mb-2">{menu.name}</div>
                    <div className="text-sm text-gray-600 mb-1">所要時間: {menu.duration}分</div>
                    <div className="text-lg font-bold text-purple-600">¥{menu.price.toLocaleString()}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* お客様用：スケジュール表示 */}
          {currentStep === 'schedule' && selectedMenu && selectedStaff && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setCurrentStep('menu')}
                  className="text-purple-600 hover:text-purple-800"
                >
                  ← メニュー選択に戻る
                </button>
                <h3 className="text-xl font-semibold text-gray-800">
                  予約日時を選択してください
                </h3>
                <div></div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="text-sm text-gray-600 mb-2">選択中の内容:</div>
                <div className="font-semibold">
                  {selectedStaff.name} - {selectedMenu.name} ({selectedMenu.duration}分 / ¥{selectedMenu.price.toLocaleString()})
                </div>
                <div className="text-sm text-blue-600 mt-2">
                  💡 {selectedMenu.duration}分のメニューのため、連続した時間枠が必要です。後の時間が埋まっている場合は予約できません。
                </div>
              </div>

              {/* 週表示ナビゲーション */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentWeek(prev => Math.max(prev - 1, 0))}
                  disabled={currentWeek === 0}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ◀️ 前の週
                </button>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {getWeekLabel(currentWeek)}
                  </h3>
                  <div className="text-xs text-gray-500">
                    {currentWeek + 1}/{Math.ceil(schedules.length / 7)}週 (全{schedules.length}日)
                  </div>
                </div>
                <button
                  onClick={() => setCurrentWeek(prev => Math.min(prev + 1, maxWeeks - 1))}
                  disabled={currentWeek >= maxWeeks - 1}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  次の週 ▶️
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getWeekSchedules(currentWeek).map(schedule => (
                  <div key={schedule.date} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-center mb-3 text-gray-800">
                      {formatDate(schedule.date)}
                    </h4>
                    <div className="space-y-2">
                      {schedule.slots.map(slot => {
                        // 選択されたメニューの時間を考慮した予約可能性チェック
                        const canBook = selectedMenu ? 
                          canMakeReservation(slot.time, selectedMenu.duration, schedule.date) : 
                          slot.isAvailable
                        
                        console.log('Customer view slot:', {
                          date: schedule.date,
                          time: slot.time,
                          isAvailable: slot.isAvailable,
                          canBook: canBook,
                          menuDuration: selectedMenu?.duration,
                          hasCustomerInfo: !!slot.customerInfo,
                          slotId: slot.id
                        })
                        
                        return (
                          <button
                            key={slot.id}
                            onClick={() => handleSlotClick(slot, schedule.date)}
                            disabled={!canBook}
                            className={`w-full p-2 rounded text-sm transition-colors ${
                              canBook
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                            title={
                              !slot.isAvailable 
                                ? '予約済み・不可' 
                                : !canBook 
                                  ? `${selectedMenu?.duration}分の施術に必要な時間が確保できません`
                                  : '予約可能'
                            }
                          >
                            {slot.time} {canBook ? '⭕' : '❌'}
                            {!slot.isAvailable && canBook === false && selectedMenu && (
                              <span className="block text-xs text-gray-500">
                                {selectedMenu.duration}分不可
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* 時間要望ボタン - 担当者・メニュー選択後のみ表示 */}
              <div className="mt-8 text-center p-6 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  🕐 希望の時間が空いていませんか？
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  上記の時間枠が合わない場合、{selectedStaff?.name}様への時間要望を送信できます。<br/>
                  サロンから調整のご連絡をいたします。
                </p>
                <button
                  onClick={() => {
                    // 選択した担当者を自動設定
                    setTimeRequestForm(prev => ({
                      ...prev,
                      selectedStaff: selectedStaff,
                      selectedMenu: selectedMenu,
                      customerName: '',
                      customerPhone: '',
                      preferredDate: '',
                      preferredTime: '',
                      timeRequest: ''
                    }))
                    setShowTimeRequestForm(true)
                  }}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                >
                  🕐 {selectedStaff.name}宛に時間要望を送信
                </button>
                <div className="text-xs text-gray-500 mt-2">
                  担当: {selectedStaff.name} | メニュー: {selectedMenu.name} ({selectedMenu.duration}分)
                </div>
              </div>
            </div>
          )}

          {/* 予約フォーム */}
          {showReservationForm && selectedSlot && selectedMenu && selectedStaff && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-semibold mb-4">予約情報入力</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      お名前 *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="お名前を入力してください"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      電話番号 *
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="電話番号を入力してください"
                    />
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-sm text-gray-600 mb-1">予約内容</div>
                    <div className="font-semibold">
                      {formatDate(selectedSlot.id.split('-')[0] + '-' + selectedSlot.id.split('-')[1] + '-' + selectedSlot.id.split('-')[2])} {selectedSlot.time}
                    </div>
                    <div>
                      {selectedStaff.name} - {selectedMenu.name}
                    </div>
                    <div className="text-purple-600 font-bold">
                      ¥{selectedMenu.price.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowReservationForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={() => {
                      if (!customerName || !customerPhone) return
                      setShowConfirmation(true)
                    }}
                    disabled={!customerName || !customerPhone}
                    className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    予約内容確認
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 予約確認モーダル */}
          {showConfirmation && selectedSlot && selectedMenu && selectedStaff && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-semibold mb-4 text-center text-pink-600">
                  🌟 予約内容の確認
                </h3>
                
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">この内容で予約しますか？</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">お名前:</span>
                      <span className="font-medium">{customerName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">電話番号:</span>
                      <span className="font-medium">{customerPhone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">担当者:</span>
                      <span className="font-medium text-blue-600">{selectedStaff.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">メニュー:</span>
                      <span className="font-medium">{selectedMenu.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">所要時間:</span>
                      <span className="font-medium">{selectedMenu.duration}分</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">予約日時:</span>
                      <span className="font-medium text-purple-600">
                        {(() => {
                          const parts = selectedSlot.id.split('-')
                          const reservationDate = `${parts[0]}-${parts[1]}-${parts[2]}`
                          return formatDate(reservationDate)
                        })()} {selectedSlot.time}
                      </span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">料金:</span>
                        <span className="text-lg font-bold text-pink-600">
                          ¥{selectedMenu.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ 予約後のキャンセル・変更はお電話でお願いいたします
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                  >
                    戻る
                  </button>
                  <button
                    onClick={() => {
                      handleReservation()
                      setShowConfirmation(false)
                    }}
                    className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-semibold"
                  >
                    🎯 予約を確定する
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 時間要望フォーム */}
        {showTimeRequestForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">🕐 時間要望リクエスト</h3>
              <p className="text-sm text-gray-600 mb-4">
                空いていない時間でもリクエスト可能です。サロンからご連絡いたします。
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    お名前 *
                  </label>
                  <input
                    type="text"
                    value={timeRequestForm.customerName}
                    onChange={(e) => setTimeRequestForm(prev => ({...prev, customerName: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="お名前を入力してください"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    電話番号 *
                  </label>
                  <input
                    type="tel"
                    value={timeRequestForm.customerPhone}
                    onChange={(e) => setTimeRequestForm(prev => ({...prev, customerPhone: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="電話番号を入力してください"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    希望日（任意）
                  </label>
                  <input
                    type="date"
                    value={timeRequestForm.preferredDate}
                    onChange={(e) => setTimeRequestForm(prev => ({...prev, preferredDate: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    希望時間（任意）
                  </label>
                  <input
                    type="time"
                    value={timeRequestForm.preferredTime}
                    onChange={(e) => setTimeRequestForm(prev => ({...prev, preferredTime: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                

                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    希望メニュー（任意）
                  </label>
                  <select
                    value={timeRequestForm.selectedMenu?.id || ''}
                    onChange={(e) => {
                      const menu = menuItems.find(m => m.id === e.target.value)
                      setTimeRequestForm(prev => ({...prev, selectedMenu: menu || null}))
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">選択なし</option>
                    {menuItems.map(menu => (
                      <option key={menu.id} value={menu.id}>{menu.name} ({menu.duration}分)</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ご要望・メッセージ *
                  </label>
                  <textarea
                    value={timeRequestForm.timeRequest}
                    onChange={(e) => setTimeRequestForm(prev => ({...prev, timeRequest: e.target.value}))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows={3}
                    placeholder="ご希望の時間帯や、その他ご要望をお聞かせください"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowTimeRequestForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  キャンセル
                </button>
                <button
                  onClick={submitTimeRequest}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  送信する
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // 管理者モード
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🔧 サロン管理システム
          </h1>
          <p className="text-gray-600">予約状況の確認と管理</p>
        </div>

        {/* 管理機能ナビゲーション */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => {
              setShowManagement(true)
              setShowMenuManagement(false)
              setShowStaffManagement(false)
              setShowTimeRequestManagement(false)
            }}
            className={`p-4 rounded-lg text-center transition-colors ${
              showManagement 
                ? 'bg-blue-500 text-white' 
                : 'bg-blue-200 text-blue-700 hover:bg-blue-300'
            }`}
          >
            📊 予約管理 {showManagement ? '(表示中)' : ''}
          </button>
          <button
            onClick={() => {
              setShowManagement(false)
              setShowMenuManagement(true)
              setShowStaffManagement(false)
              setShowTimeRequestManagement(false)
            }}
            className={`p-4 rounded-lg text-center transition-colors ${
              showMenuManagement 
                ? 'bg-green-500 text-white' 
                : 'bg-green-200 text-green-700 hover:bg-green-300'
            }`}
          >
            🍽️ メニュー管理 {showMenuManagement ? '(表示中)' : ''}
          </button>
          <button
            onClick={() => {
              setShowManagement(false)
              setShowMenuManagement(false)
              setShowStaffManagement(true)
              setShowTimeRequestManagement(false)
            }}
            className={`p-4 rounded-lg text-center transition-colors ${
              showStaffManagement 
                ? 'bg-purple-500 text-white' 
                : 'bg-purple-200 text-purple-700 hover:bg-purple-300'
            }`}
          >
            👥 スタッフ管理 {showStaffManagement ? '(表示中)' : ''}
          </button>
          <button
            onClick={() => {
              setShowManagement(false)
              setShowMenuManagement(false)
              setShowStaffManagement(false)
              setShowTimeRequestManagement(true)
            }}
            className={`p-4 rounded-lg text-center transition-colors ${
              showTimeRequestManagement 
                ? 'bg-orange-500 text-white' 
                : 'bg-orange-200 text-orange-700 hover:bg-orange-300'
            }`}
          >
            🕐 時間要望管理 {showTimeRequestManagement ? '(表示中)' : ''}
          </button>
        </div>

        {/* 各管理画面の内容 */}
        
        {/* ダッシュボード（何も選択されていない時） */}
        {!showManagement && !showMenuManagement && !showStaffManagement && !showTimeRequestManagement && (
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">管理ダッシュボード</h3>
            <p className="text-gray-600 mb-6">上のタブから管理したい項目を選択してください</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl text-blue-600 mb-2">📊</div>
                <div className="font-semibold text-gray-800">予約管理</div>
                <div className="text-sm text-gray-600 mt-1">
                  本日: {reservationHistory.filter(r => {
                    const today = new Date().toISOString().split('T')[0]
                    return r.date === today
                  }).length}件
                </div>
                <div className="text-sm text-gray-600">
                  総予約: {reservationHistory.length}件
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl text-green-600 mb-2">🍽️</div>
                <div className="font-semibold text-gray-800">メニュー管理</div>
                <div className="text-sm text-gray-600 mt-1">
                  登録メニュー: {menuItems.length}件
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl text-purple-600 mb-2">👥</div>
                <div className="font-semibold text-gray-800">スタッフ管理</div>
                <div className="text-sm text-gray-600 mt-1">
                  在籍スタッフ: {staffList.length}名
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl text-orange-600 mb-2">🕐</div>
                <div className="font-semibold text-gray-800">時間要望管理</div>
                <div className="text-sm text-gray-600 mt-1">
                  未対応: {timeRequests.filter(r => r.status === 'pending').length}件
                </div>
                <div className="text-sm text-gray-600">
                  総要望: {timeRequests.length}件
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 予約管理画面 */}
        {showManagement && (
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">📊 予約管理</h3>
              {/* 担当者フィルター */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">担当者:</label>
                <select
                  value={selectedStaffFilter}
                  onChange={(e) => setSelectedStaffFilter(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  {staffList.map(staff => (
                    <option key={staff.id} value={staff.id}>{staff.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* 今日の予約一覧 */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-700 mb-3">本日の予約</h4>
              {reservationHistory.filter(reservation => {
                const today = new Date().toISOString().split('T')[0]
                const matchesDate = reservation.date === today
                const matchesStaff = reservation.customerInfo.staff.id === selectedStaffFilter
                return matchesDate && matchesStaff
              }).length > 0 ? (
                <div className="space-y-2">
                  {reservationHistory
                    .filter(reservation => {
                      const today = new Date().toISOString().split('T')[0]
                      const matchesDate = reservation.date === today
                      const matchesStaff = reservation.customerInfo.staff.id === selectedStaffFilter
                      return matchesDate && matchesStaff
                    })
                    .map(reservation => (
                      <div key={reservation.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <span className="font-medium">{reservation.time}</span>
                          <span className="mx-2">-</span>
                          <span>{reservation.customerInfo.name}</span>
                          <span className="mx-2">|</span>
                          <span className="text-sm text-gray-600">{reservation.customerInfo.menu.name}</span>
                          <span className="mx-2">|</span>
                          <span className="text-sm text-blue-600">{reservation.customerInfo.staff.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            reservation.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {reservation.completed ? '完了' : '予約中'}
                          </span>
                          <button
                            onClick={() => setSelectedRecord(reservation)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            詳細
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  {staffList.find(s => s.id === selectedStaffFilter)?.name}の本日の予約はありません
                </p>
              )}
            </div>

            {/* 全予約履歴 */}
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-700 mb-3">全予約履歴</h4>
              {reservationHistory.filter(reservation => 
                reservation.customerInfo.staff.id === selectedStaffFilter
              ).length > 0 ? (
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {reservationHistory
                    .filter(reservation => 
                      reservation.customerInfo.staff.id === selectedStaffFilter
                    )
                    .map(reservation => (
                      <div key={reservation.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <span className="font-medium">{formatDate(reservation.date)} {reservation.time}</span>
                          <span className="mx-2">-</span>
                          <span>{reservation.customerInfo.name}</span>
                          <span className="mx-2">|</span>
                          <span className="text-sm text-gray-600">{reservation.customerInfo.menu.name}</span>
                          <span className="mx-2">|</span>
                          <span className="text-sm text-blue-600">{reservation.customerInfo.staff.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            reservation.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {reservation.completed ? '完了' : '予約中'}
                          </span>
                          <button
                            onClick={() => setSelectedRecord(reservation)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            詳細
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  {staffList.find(s => s.id === selectedStaffFilter)?.name}の予約履歴がありません
                </p>
              )}
            </div>

            {/* スケジュール管理セクション */}
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-3">スケジュール管理</h4>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  ⭕をクリック: 空き枠を予約不可に / ❌をクリック: 予約不可を空き枠に
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={forceRegenerateSchedules}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    🔄 30日スケジュール再生成
                  </button>
                  <button
                    onClick={resetAllReservations}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    🗑️ 全データリセット
                  </button>
                </div>
              </div>
              
              {/* 管理者用週ナビゲーション */}
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
                  disabled={currentWeek === 0}
                  className="px-3 py-1 text-sm bg-white text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← 前の週
                </button>
                <div className="text-center">
                  <div className="font-semibold text-gray-800">{getWeekLabel(currentWeek)}</div>
                  <div className="text-xs text-gray-500">
                    管理者モード - 総{schedules.length}日分 ({Math.ceil(schedules.length / 7)}週) | 現在: {currentWeek + 1}週目
                  </div>
                </div>
                <button
                  onClick={() => setCurrentWeek(Math.min(maxWeeks - 1, currentWeek + 1))}
                  disabled={currentWeek >= maxWeeks - 1}
                  className="px-3 py-1 text-sm bg-white text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  次の週 →
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getWeekSchedules(currentWeek).map(schedule => (
                  <div key={schedule.date} className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-center mb-3 text-gray-800">
                      {formatDate(schedule.date)}
                    </h5>
                    <div className="space-y-2">
                      {schedule.slots.map(slot => {
                        // 選択されたスタッフに基づいて表示制御
                        // 予約済みの場合は該当スタッフのもののみ、空き/不可枠は常に表示
                        const shouldShow = (slot.customerInfo && slot.customerInfo.staff.id === selectedStaffFilter) ||
                          !slot.customerInfo; // 予約が入っていないスロット（空き・不可）は常に表示
                        
                        if (!shouldShow) return null;
                        
                        // 競合情報を取得
                        const conflicts = !slot.isAvailable ? getReservationConflicts(slot.time, schedule.date) : []
                        
                        return (
                          <button
                            key={slot.id}
                            onClick={() => toggleSlotAvailability(slot, schedule.date)}
                            className={`w-full p-2 rounded text-sm transition-colors ${
                              slot.isAvailable
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : slot.customerInfo
                                  ? 'bg-blue-100 text-blue-800 cursor-default'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                            disabled={!!slot.customerInfo} // 予約済みは変更不可
                            title={
                              slot.customerInfo 
                                ? `予約済み: ${slot.customerInfo.name} (${slot.customerInfo.staff.name})`
                                : slot.isAvailable 
                                  ? 'クリックで予約不可に変更'
                                  : conflicts.length > 0
                                    ? `このスロットが不可のため影響を受ける予約: ${conflicts.join(', ')}`
                                    : 'クリックで空き枠に変更'
                            }
                          >
                            {slot.time} {
                              slot.customerInfo 
                                ? `👤 ${slot.customerInfo.name}`
                                : slot.isAvailable 
                                  ? '⭕' 
                                  : '❌'
                            }
                            {conflicts.length > 0 && (
                              <span className="block text-xs text-red-600 mt-1">
                                ⚠️ {conflicts.length}件影響
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* メニュー管理画面 */}
        {showMenuManagement && (
          <div className="bg-white border-2 border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">🍽️ メニュー管理</h3>
              <div className="flex items-center space-x-4">
                {/* 担当者フィルター */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">担当者:</label>
                  <select
                    value={selectedStaffFilter}
                    onChange={(e) => setSelectedStaffFilter(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                  >
                    {staffList.map(staff => (
                      <option key={staff.id} value={staff.id}>{staff.name}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => {
                    setEditingMenu(null)
                    setMenuForm({ name: '', duration: '', price: '' })
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  + 新規メニュー追加
                </button>
              </div>
            </div>

            {/* メニュー一覧 */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {menuItems
                .filter(menu => menu.staffId === selectedStaffFilter)
                .map(menu => (
                  <div key={menu.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{menu.name}</h4>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingMenu(menu)
                            setMenuForm({
                              name: menu.name,
                              duration: menu.duration.toString(),
                              price: menu.price.toString()
                            })
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`メニュー「${menu.name}」を削除しますか？\n\n⚠️ 注意: このメニューを使用した予約履歴は残りますが、新規予約では選択できなくなります。`)) {
                              // 関連する予約があるかチェック
                              const relatedReservations = reservationHistory.filter(r => r.customerInfo.menu.id === menu.id)
                              
                              if (relatedReservations.length > 0) {
                                if (!window.confirm(`⚠️ このメニューには${relatedReservations.length}件の予約があります。\n\n削除すると予約履歴の表示に影響する可能性がありますが、削除を続行しますか？`)) {
                                  return
                                }
                              }
                              
                              // メニューを削除
                              const updatedMenus = menuItems.filter(m => m.id !== menu.id)
                              setMenuItems(updatedMenus)
                              
                              // 担当者の対応メニューからも削除
                              const updatedStaff = staffList.map(staff => ({
                                ...staff,
                                menuIds: staff.menuIds.filter(id => id !== menu.id)
                              }))
                              setStaffList(updatedStaff)
                              
                              // 編集中の場合はクリア
                              if (editingMenu?.id === menu.id) {
                                setEditingMenu(null)
                                setMenuForm({ name: '', duration: '', price: '' })
                              }
                              
                              alert(`✅ メニュー「${menu.name}」を削除しました。`)
                            }
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>所要時間: {menu.duration}分</p>
                      <p>料金: ¥{menu.price.toLocaleString()}</p>
                      <p>担当者: <span className="text-blue-600 font-medium">{getStaffById(menu.staffId)?.name}</span></p>
                    </div>
                  </div>
                ))}
              {menuItems.filter(menu => menu.staffId === selectedStaffFilter).length === 0 && (
                <div className="col-span-2 text-center py-8">
                  <p className="text-gray-500">
                    {staffList.find(s => s.id === selectedStaffFilter)?.name}のメニューがありません
                  </p>
                </div>
              )}
            </div>

            {/* メニュー編集フォーム */}
            {(editingMenu !== null || menuForm.name) && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-800 mb-3">
                  {editingMenu ? 'メニュー編集' : '新規メニュー追加'}
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      メニュー名
                    </label>
                    <input
                      type="text"
                      value={menuForm.name}
                      onChange={(e) => setMenuForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="メニュー名を入力"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      所要時間（分）
                    </label>
                    <input
                      type="number"
                      value={menuForm.duration}
                      onChange={(e) => setMenuForm(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      料金（円）
                    </label>
                    <input
                      type="number"
                      value={menuForm.price}
                      onChange={(e) => setMenuForm(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="5000"
                    />
                  </div>
                  <div className="flex items-end space-x-2">
                    <button
                      onClick={() => {
                        setEditingMenu(null)
                        setMenuForm({ name: '', duration: '', price: '' })
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={() => {
                        // メニュー保存ロジック（簡略化）
                        setEditingMenu(null)
                        setMenuForm({ name: '', duration: '', price: '' })
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      保存
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* スタッフ管理画面 */}
        {showStaffManagement && (
          <div className="bg-white border-2 border-purple-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">👥 スタッフ管理</h3>
              <button
                onClick={() => {
                  setEditingStaff(null)
                  setStaffForm({ name: '', selectedMenus: [] })
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                + 新規スタッフ追加
              </button>
            </div>

            {/* スタッフ一覧 */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {staffList.map(staff => (
                <div key={staff.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{staff.name}</h4>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingStaff(staff)
                          setStaffForm({
                            name: staff.name,
                            selectedMenus: staff.menuIds
                          })
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`担当者「${staff.name}」を削除しますか？\n\n⚠️ 注意: この担当者による予約履歴は残りますが、新規予約では選択できなくなります。`)) {
                            // 関連する予約があるかチェック
                            const relatedReservations = reservationHistory.filter(r => r.customerInfo.staff.id === staff.id)
                            const relatedTimeRequests = timeRequests.filter(r => r.staff.id === staff.id)
                            
                            if (relatedReservations.length > 0 || relatedTimeRequests.length > 0) {
                              let message = `⚠️ この担当者には以下の関連データがあります:\n`
                              if (relatedReservations.length > 0) {
                                message += `• 予約履歴: ${relatedReservations.length}件\n`
                              }
                              if (relatedTimeRequests.length > 0) {
                                message += `• 時間要望: ${relatedTimeRequests.length}件\n`
                              }
                              message += `\n削除すると履歴の表示に影響する可能性がありますが、削除を続行しますか？`
                              
                              if (!window.confirm(message)) {
                                return
                              }
                            }
                            
                            // 担当者を削除
                            const updatedStaff = staffList.filter(s => s.id !== staff.id)
                            setStaffList(updatedStaff)
                            
                            // この担当者のメニューを削除
                            const updatedMenus = menuItems.filter(m => m.staffId !== staff.id)
                            setMenuItems(updatedMenus)
                            
                            // 編集中の場合はクリア
                            if (editingStaff?.id === staff.id) {
                              setEditingStaff(null)
                              setStaffForm({ name: '', selectedMenus: [] })
                            }
                            
                            alert(`✅ 担当者「${staff.name}」とその担当メニューを削除しました。`)
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>対応メニュー: {staff.menuIds.length}件</p>
                    <div className="mt-1">
                      {staff.menuIds.map(menuId => {
                        const menu = menuItems.find(m => m.id === menuId)
                        return menu ? (
                          <span key={menuId} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-1 mb-1">
                            {menu.name}
                          </span>
                        ) : null
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* スタッフ編集フォーム */}
            {(editingStaff !== null || staffForm.name) && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-800 mb-3">
                  {editingStaff ? 'スタッフ編集' : '新規スタッフ追加'}
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      スタッフ名
                    </label>
                    <input
                      type="text"
                      value={staffForm.name}
                      onChange={(e) => setStaffForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="スタッフ名を入力"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      対応可能メニュー
                    </label>
                    <div className="grid md:grid-cols-3 gap-2">
                      {menuItems.map(menu => (
                        <label key={menu.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={staffForm.selectedMenus.includes(menu.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setStaffForm(prev => ({
                                  ...prev,
                                  selectedMenus: [...prev.selectedMenus, menu.id]
                                }))
                              } else {
                                setStaffForm(prev => ({
                                  ...prev,
                                  selectedMenus: prev.selectedMenus.filter(id => id !== menu.id)
                                }))
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{menu.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingStaff(null)
                        setStaffForm({ name: '', selectedMenus: [] })
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={() => {
                        // スタッフ保存ロジック（簡略化）
                        setEditingStaff(null)
                        setStaffForm({ name: '', selectedMenus: [] })
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      保存
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 時間要望管理画面 */}
        {showTimeRequestManagement && (
          <div className="bg-white border-2 border-orange-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">🕐 時間要望管理</h3>
              {/* 担当者フィルター */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">担当者:</label>
                <select
                  value={selectedStaffFilter}
                  onChange={(e) => setSelectedStaffFilter(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  {staffList.map(staff => (
                    <option key={staff.id} value={staff.id}>{staff.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* 統計情報 */}
            <div className="mb-6 p-4 bg-orange-50 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{timeRequests.length}</div>
                  <div className="text-sm text-gray-600">総要望数</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {timeRequests.filter(r => r.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">未対応</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {timeRequests.filter(r => r.status === 'contacted').length}
                  </div>
                  <div className="text-sm text-gray-600">連絡済み</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {timeRequests.filter(r => r.status === 'scheduled').length}
                  </div>
                  <div className="text-sm text-gray-600">予約済み</div>
                </div>
              </div>
            </div>
            
            {timeRequests.filter(request => 
              request.staff.id === selectedStaffFilter
            ).length > 0 ? (
              <div className="space-y-4">
                {timeRequests
                  .filter(request => 
                    request.staff.id === selectedStaffFilter
                  )
                  .map(request => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium">{request.customerName}</span>
                          <span className="mx-2">|</span>
                          <span className="text-sm text-gray-600">{request.customerPhone}</span>
                          <span className="mx-2">|</span>
                          <span className="text-sm text-blue-600">{request.staff.name}</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                          request.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status === 'pending' ? '未対応' :
                           request.status === 'contacted' ? '連絡済み' :
                           request.status === 'scheduled' ? '予約済み' : '断念'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <p>希望スタッフ: <span className="text-blue-600 font-medium">{request.staff.name}</span></p>
                        <p>希望メニュー: {request.menu.name}</p>
                        <p>希望日時: {request.preferredDate} {request.preferredTime}</p>
                        <p>要望内容: {request.timeRequest}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          受付日時: {new Date(request.createdAt).toLocaleString()}
                        </span>
                        <button
                          onClick={() => setSelectedTimeRequest(request)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          対応する
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500">
                {staffList.find(s => s.id === selectedStaffFilter)?.name}への時間要望はありません
              </p>
            )}
          </div>
        )}

        {/* 予約詳細モーダル */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">予約詳細</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">予約日時:</span>
                  <div className="font-medium">{formatDate(selectedRecord.date)} {selectedRecord.time}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">お客様名:</span>
                  <div className="font-medium">{selectedRecord.customerInfo.name}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">電話番号:</span>
                  <div className="font-medium">{selectedRecord.customerInfo.phone}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">担当者:</span>
                  <div className="font-medium">{selectedRecord.customerInfo.staff.name}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">メニュー:</span>
                  <div className="font-medium">{selectedRecord.customerInfo.menu.name}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">料金:</span>
                  <div className="font-medium">¥{selectedRecord.customerInfo.menu.price.toLocaleString()}</div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">サービスメモ:</label>
                  <textarea
                    value={serviceNote}
                    onChange={(e) => setServiceNote(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows={3}
                    placeholder="サービス内容や特記事項を入力..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setSelectedRecord(null)
                    setServiceNote('')
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  閉じる
                </button>
                <button
                  onClick={() => {
                    // 予約完了処理
                    const updatedHistory = reservationHistory.map(r => 
                      r.id === selectedRecord.id 
                        ? { ...r, completed: true, serviceNote }
                        : r
                    )
                    setReservationHistory(updatedHistory)
                    localStorage.setItem('reservations', JSON.stringify(updatedHistory))
                    setSelectedRecord(null)
                    setServiceNote('')
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  完了にする
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 時間要望対応モーダル */}
        {selectedTimeRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">時間要望対応</h3>
              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-sm text-gray-600">お客様:</span>
                  <div className="font-medium">{selectedTimeRequest.customerName}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">要望内容:</span>
                  <div className="font-medium">{selectedTimeRequest.timeRequest}</div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">対応メモ:</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows={3}
                    placeholder="対応内容を入力..."
                  />
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => {
                    // ステータス更新処理
                    const updatedRequests = timeRequests.map(r => 
                      r.id === selectedTimeRequest.id 
                        ? { ...r, status: 'contacted' as const, adminNotes }
                        : r
                    )
                    setTimeRequests(updatedRequests)
                    localStorage.setItem('timeRequests', JSON.stringify(updatedRequests))
                    setSelectedTimeRequest(null)
                    setAdminNotes('')
                  }}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  連絡済み
                </button>
                <button
                  onClick={() => {
                    // ステータス更新処理
                    const updatedRequests = timeRequests.map(r => 
                      r.id === selectedTimeRequest.id 
                        ? { ...r, status: 'scheduled' as const, adminNotes }
                        : r
                    )
                    setTimeRequests(updatedRequests)
                    localStorage.setItem('timeRequests', JSON.stringify(updatedRequests))
                    setSelectedTimeRequest(null)
                    setAdminNotes('')
                  }}
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  予約済み
                </button>
              </div>
              <button
                onClick={() => {
                  setSelectedTimeRequest(null)
                  setAdminNotes('')
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                閉じる
              </button>
            </div>
          </div>
        )}

        {/* 予約データリセットボタン（管理者モード専用） */}
        {isAdminMode && (
          <div className="fixed bottom-4 right-4">
            <button
              onClick={resetAllReservations}
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors"
            >
              ⚠️ 予約データリセット
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
