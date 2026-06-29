import { useState } from 'react'

export function WeightForm({ onSubmit }) {
  const [weightKg, setWeightKg] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await onSubmit(parseFloat(weightKg), note)

    if (error) {
      setError(error.message)
    } else {
      setWeightKg('')
      setNote('')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm space-y-3">
      <h2 className="font-semibold text-gray-900 dark:text-white">บันทึกน้ำหนัก</h2>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-danger text-sm p-3 rounded-lg">{error}</div>
      )}

      <div className="flex gap-3">
        <div className="flex-1">
          <input
            type="number"
            step="0.1"
            min="1"
            max="500"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            required
            placeholder="น้ำหนัก (kg)"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="หมายเหตุ (ไม่บังคับ)"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
          />
        </div>
      </div>

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
