import { useState } from 'react'

const INTENSITY_OPTIONS = [
  { value: 'low', label: 'เบา' },
  { value: 'medium', label: 'ปานกลาง' },
  { value: 'high', label: 'หนัก' },
]

export function ExerciseForm({ onSubmit }) {
  const [type, setType] = useState('')
  const [durationMin, setDurationMin] = useState('')
  const [intensity, setIntensity] = useState('medium')
  const [caloriesBurned, setCaloriesBurned] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await onSubmit(
      type,
      parseInt(durationMin),
      intensity,
      caloriesBurned ? parseInt(caloriesBurned) : null
    )

    if (error) {
      setError(error.message)
    } else {
      setType('')
      setDurationMin('')
      setCaloriesBurned('')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm space-y-3">
      <h2 className="font-semibold text-gray-900 dark:text-white">บันทึกการออกกำลังกาย</h2>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-danger text-sm p-3 rounded-lg">{error}</div>
      )}

      <div className="flex gap-3">
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          placeholder="ประเภท (เช่น วิ่ง, เดินเร็ว)"
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
        />
      </div>

      <div className="flex gap-3">
        <input
          type="number"
          min="1"
          value={durationMin}
          onChange={(e) => setDurationMin(e.target.value)}
          required
          placeholder="เวลา (นาที)"
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
        />
        <select
          value={intensity}
          onChange={(e) => setIntensity(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
        >
          {INTENSITY_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <input
        type="number"
        min="0"
        value={caloriesBurned}
        onChange={(e) => setCaloriesBurned(e.target.value)}
        placeholder="แคลอรี่ที่เผาผลาญ (ไม่บังคับ)"
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition disabled:opacity-50"
      >
        {loading ? 'กำลังบันทึก...' : 'บันทึก'}
      </button>
    </form>
  )
}
