import { useState } from 'react'

const MEAL_TYPES = [
  { value: 'breakfast', label: 'เช้า' },
  { value: 'lunch', label: 'กลางวัน' },
  { value: 'dinner', label: 'เย็น' },
  { value: 'snack', label: 'ของว่าง' },
]

export function FoodForm({ onSubmit }) {
  const [name, setName] = useState('')
  const [calories, setCalories] = useState('')
  const [mealType, setMealType] = useState('breakfast')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await onSubmit(name, parseInt(calories), mealType)

    if (error) {
      setError(error.message)
    } else {
      setName('')
      setCalories('')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800/60 space-y-3">
      <h2 className="font-semibold text-gray-900 dark:text-white">บันทึกอาหาร</h2>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-danger text-sm p-3 rounded-xl border border-red-100 dark:border-red-900/40">{error}</div>
      )}

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="ชื่ออาหาร"
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
      />

      <div className="flex gap-2">
        <input
          type="number"
          min="0"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          required
          placeholder="แคลอรี่"
          className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
        />
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {MEAL_TYPES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setMealType(value)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                mealType === value
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-muted'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-semibold rounded-xl transition-all disabled:opacity-50 shadow-sm shadow-primary/25"
      >
        {loading ? 'กำลังบันทึก...' : 'บันทึก'}
      </button>
    </form>
  )
}
