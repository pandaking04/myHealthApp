import { useState } from 'react'
import { useFoodLogs } from '../hooks/useFoodLogs'
import { FoodForm } from '../components/food/FoodForm'
import { FoodList } from '../components/food/FoodList'

export function FoodPage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const { logs, loading, totalCalories, addLog, deleteLog } = useFoodLogs(date)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">อาหาร</h1>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
        />
      </div>

      <FoodForm onSubmit={addLog} />

      {loading ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm text-center text-gray-400">
          กำลังโหลด...
        </div>
      ) : (
        <FoodList logs={logs} totalCalories={totalCalories} onDelete={deleteLog} />
      )}
    </div>
  )
}
