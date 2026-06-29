import { useState } from 'react'
import { useFoodLogs } from '../hooks/useFoodLogs'
import { FoodForm } from '../components/food/FoodForm'
import { FoodList } from '../components/food/FoodList'

export function FoodPage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const { logs, loading, totalCalories, addLog, deleteLog } = useFoodLogs(date)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">อาหาร</h1>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-1.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
        />
      </div>

      <FoodForm onSubmit={addLog} />

      {loading ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800/60 text-center text-muted">
          กำลังโหลด...
        </div>
      ) : (
        <FoodList logs={logs} totalCalories={totalCalories} onDelete={deleteLog} />
      )}
    </div>
  )
}
