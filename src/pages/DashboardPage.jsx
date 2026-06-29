import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const MEAL_LABELS = {
  breakfast: 'เช้า',
  lunch: 'กลางวัน',
  dinner: 'เย็น',
  snack: 'ของว่าง',
}

const SUB_TYPE_LABELS = {
  push: 'Push', pull: 'Pull', leg: 'Leg', upper: 'Upper',
  walk: 'เดิน', run: 'วิ่ง', incline_walk: 'เดินชัน',
}

export function DashboardPage() {
  const [data, setData] = useState({
    latestWeight: null,
    weightDelta: null,
    caloriesIn: 0,
    caloriesOut: 0,
    foodLogs: [],
    exerciseLogs: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  async function fetchDashboard() {
    const today = new Date().toISOString().split('T')[0]
    const startOfDay = `${today}T00:00:00`
    const endOfDay = `${today}T23:59:59`

    const [weightRes, foodRes, exerciseRes] = await Promise.all([
      supabase
        .from('weight_logs')
        .select('*')
        .order('logged_at', { ascending: false })
        .limit(2),
      supabase
        .from('food_logs')
        .select('*')
        .gte('logged_at', startOfDay)
        .lte('logged_at', endOfDay)
        .order('logged_at', { ascending: true }),
      supabase
        .from('exercise_logs')
        .select('*, exercise_sets(*)')
        .gte('logged_at', startOfDay)
        .lte('logged_at', endOfDay)
        .order('logged_at', { ascending: true }),
    ])

    const weights = weightRes.data || []
    const foods = foodRes.data || []
    const exercises = exerciseRes.data || []

    const latestWeight = weights[0] || null
    const weightDelta = weights.length >= 2
      ? (parseFloat(weights[0].weight_kg) - parseFloat(weights[1].weight_kg)).toFixed(1)
      : null

    setData({
      latestWeight,
      weightDelta,
      caloriesIn: foods.reduce((sum, f) => sum + f.calories, 0),
      caloriesOut: exercises.reduce((sum, e) => sum + (e.calories_burned || 0), 0),
      foodLogs: foods,
      exerciseLogs: exercises,
    })
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  const { latestWeight, weightDelta, caloriesIn, caloriesOut, foodLogs, exerciseLogs } = data

  const groupedFood = foodLogs.reduce((acc, log) => {
    const type = log.meal_type || 'snack'
    if (!acc[type]) acc[type] = []
    acc[type].push(log)
    return acc
  }, {})

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">สรุปวันนี้</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800/60 text-center">
          <div className="text-[11px] uppercase tracking-wider text-muted mb-2">น้ำหนัก</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {latestWeight ? latestWeight.weight_kg : '-'}
          </div>
          <div className="text-xs text-muted">kg</div>
          {weightDelta && (
            <div className={`text-xs font-medium mt-1 ${parseFloat(weightDelta) <= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {parseFloat(weightDelta) > 0 ? '+' : ''}{weightDelta}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800/60 text-center">
          <div className="text-[11px] uppercase tracking-wider text-muted mb-2">กินไป</div>
          <div className="text-xl font-bold text-orange-500">{caloriesIn.toLocaleString()}</div>
          <div className="text-xs text-muted">แคล</div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800/60 text-center">
          <div className="text-[11px] uppercase tracking-wider text-muted mb-2">เผาผลาญ</div>
          <div className="text-xl font-bold text-emerald-500">{caloriesOut.toLocaleString()}</div>
          <div className="text-xs text-muted">แคล</div>
        </div>
      </div>

      {/* Food logs */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 overflow-hidden">
        <div className="px-5 pt-4 pb-2">
          <h2 className="font-semibold text-gray-900 dark:text-white">อาหารวันนี้</h2>
        </div>
        {foodLogs.length === 0 ? (
          <p className="text-muted text-sm text-center py-6 px-5">ยังไม่มีรายการ</p>
        ) : (
          <div className="px-5 pb-4 space-y-3">
            {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => {
              const items = groupedFood[type]
              if (!items) return null
              return (
                <div key={type}>
                  <h3 className="text-[11px] uppercase tracking-wider text-muted mb-1.5">
                    {MEAL_LABELS[type]}
                  </h3>
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between py-1.5 text-sm">
                      <span className="text-gray-900 dark:text-white truncate mr-3">{item.name}</span>
                      <span className="text-muted whitespace-nowrap">{item.calories} แคล</span>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Exercise logs */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800/60 overflow-hidden">
        <div className="px-5 pt-4 pb-2">
          <h2 className="font-semibold text-gray-900 dark:text-white">ออกกำลังกายวันนี้</h2>
        </div>
        {exerciseLogs.length === 0 ? (
          <p className="text-muted text-sm text-center py-6 px-5">ยังไม่มีรายการ</p>
        ) : (
          <div className="px-5 pb-4 space-y-2.5">
            {exerciseLogs.map((log) => (
              <div key={log.id} className="rounded-xl bg-gray-50 dark:bg-gray-800/40 p-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-md ${
                    log.category === 'weight_training'
                      ? 'bg-primary/15 text-primary'
                      : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {SUB_TYPE_LABELS[log.sub_type]}
                  </span>
                  <span className="text-xs text-muted">
                    {log.duration_min} นาที
                    {log.distance_km ? ` · ${log.distance_km} km` : ''}
                    {log.incline_percent ? ` · ชัน ${log.incline_percent}%` : ''}
                    {log.calories_burned ? ` · ${log.calories_burned} แคล` : ''}
                  </span>
                </div>
                {log.exercise_sets && log.exercise_sets.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {log.exercise_sets.map((s) => (
                      <div key={s.id} className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300 truncate mr-3">{s.exercise_name}</span>
                        <span className="text-muted whitespace-nowrap">
                          {s.sets}&times;{s.reps} @ {s.weight_kg}kg
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}