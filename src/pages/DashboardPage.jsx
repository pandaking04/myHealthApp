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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
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
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">สรุปวันนี้</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard
          label="น้ำหนัก"
          value={latestWeight ? `${latestWeight.weight_kg} kg` : '-'}
          sub={weightDelta ? `${parseFloat(weightDelta) > 0 ? '+' : ''}${weightDelta} kg` : null}
          subColor={weightDelta && parseFloat(weightDelta) <= 0 ? 'text-green-500' : 'text-red-500'}
        />
        <SummaryCard
          label="Calories In"
          value={caloriesIn.toLocaleString()}
          sub="แคล"
        />
        <SummaryCard
          label="Calories Out"
          value={caloriesOut.toLocaleString()}
          sub="แคล"
        />
      </div>

      {/* Food logs */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">รายการอาหารวันนี้</h2>
        {foodLogs.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-2">ยังไม่มีรายการ</p>
        ) : (
          <div className="space-y-3">
            {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => {
              const items = groupedFood[type]
              if (!items) return null
              return (
                <div key={type}>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                    {MEAL_LABELS[type]}
                  </h3>
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between py-1 text-sm">
                      <span className="text-gray-900 dark:text-white">{item.name}</span>
                      <span className="text-gray-500 dark:text-gray-400">{item.calories} แคล</span>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Exercise logs */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">การออกกำลังกายวันนี้</h2>
        {exerciseLogs.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-2">ยังไม่มีรายการ</p>
        ) : (
          <div className="space-y-2">
            {exerciseLogs.map((log) => (
              <div key={log.id} className="border border-gray-100 dark:border-gray-800 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    log.category === 'weight_training'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  }`}>
                    {SUB_TYPE_LABELS[log.sub_type]}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {log.duration_min} นาที
                    {log.distance_km ? ` · ${log.distance_km} km` : ''}
                    {log.incline_percent ? ` · ชัน ${log.incline_percent}%` : ''}
                    {log.calories_burned ? ` · ${log.calories_burned} แคล` : ''}
                  </span>
                </div>
                {log.exercise_sets && log.exercise_sets.length > 0 && (
                  <div className="space-y-0.5 mt-1">
                    {log.exercise_sets.map((s) => (
                      <div key={s.id} className="flex justify-between text-sm px-2">
                        <span className="text-gray-900 dark:text-white">{s.exercise_name}</span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {s.sets} &times; {s.reps} @ {s.weight_kg} kg
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryCard({ label, value, sub, subColor = 'text-gray-500 dark:text-gray-400' }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm text-center">
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</div>
      <div className="text-lg font-bold text-gray-900 dark:text-white">{value}</div>
      {sub && <div className={`text-xs mt-1 ${subColor}`}>{sub}</div>}
    </div>
  )
}
