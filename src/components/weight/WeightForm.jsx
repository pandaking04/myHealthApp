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
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800/60 space-y-3">
      <h2 className="font-semibold text-gray-900 dark:text-white">บันทึกน้ำหนัก</h2>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-danger text-sm p-3 rounded-xl border border-red-100 dark:border-red-900/40">{error}</div>
      )}

      <div className="flex gap-2">
        <input
          type="number"
          step="0.1"
          min="1"
          max="500"
          value={weightKg}
          onChange={(e) => setWeightKg(e.target.value)}
          required
          placeholder="น้ำหนัก (kg)"
          className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
        />
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="หมายเหตุ"
          className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
        />
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
