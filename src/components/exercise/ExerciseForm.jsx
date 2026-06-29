import { useState } from 'react'

const CATEGORIES = [
  { value: 'weight_training', label: 'Weight Training' },
  { value: 'cardio', label: 'Cardio' },
]

const WEIGHT_TYPES = [
  { value: 'push', label: 'Push' },
  { value: 'pull', label: 'Pull' },
  { value: 'leg', label: 'Leg' },
  { value: 'upper', label: 'Upper' },
]

const CARDIO_TYPES = [
  { value: 'walk', label: 'เดิน' },
  { value: 'run', label: 'วิ่ง' },
  { value: 'incline_walk', label: 'เดินชัน' },
]

function emptySet() {
  return { exercise_name: '', sets: '', reps: '', weight_kg: '' }
}

export function ExerciseForm({ onSubmitWeight, onSubmitCardio }) {
  const [category, setCategory] = useState('weight_training')
  const [subType, setSubType] = useState('push')
  const [durationMin, setDurationMin] = useState('')
  const [caloriesBurned, setCaloriesBurned] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [exerciseSets, setExerciseSets] = useState([emptySet()])

  const [distanceKm, setDistanceKm] = useState('')
  const [inclinePercent, setInclinePercent] = useState('')

  function handleCategoryChange(cat) {
    setCategory(cat)
    setSubType(cat === 'weight_training' ? 'push' : 'walk')
  }

  function updateSet(index, field, value) {
    const updated = [...exerciseSets]
    updated[index] = { ...updated[index], [field]: value }
    setExerciseSets(updated)
  }

  function addSet() {
    setExerciseSets([...exerciseSets, emptySet()])
  }

  function removeSet(index) {
    if (exerciseSets.length <= 1) return
    setExerciseSets(exerciseSets.filter((_, i) => i !== index))
  }

  function resetForm() {
    setDurationMin('')
    setCaloriesBurned('')
    setNotes('')
    setExerciseSets([emptySet()])
    setDistanceKm('')
    setInclinePercent('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    let result

    if (category === 'weight_training') {
      const validSets = exerciseSets
        .filter(s => s.exercise_name && s.sets && s.reps && s.weight_kg)
        .map(s => ({
          exercise_name: s.exercise_name,
          sets: parseInt(s.sets),
          reps: parseInt(s.reps),
          weight_kg: parseFloat(s.weight_kg),
        }))

      result = await onSubmitWeight(
        subType,
        parseInt(durationMin),
        validSets,
        caloriesBurned ? parseInt(caloriesBurned) : null,
        notes
      )
    } else {
      result = await onSubmitCardio(
        subType,
        parseInt(durationMin),
        distanceKm ? parseFloat(distanceKm) : null,
        inclinePercent ? parseInt(inclinePercent) : null,
        caloriesBurned ? parseInt(caloriesBurned) : null,
        notes
      )
    }

    if (result.error) {
      setError(result.error.message)
    } else {
      resetForm()
    }
    setLoading(false)
  }

  const inputClass = "w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800/60 space-y-4">
      <h2 className="font-semibold text-gray-900 dark:text-white">บันทึกการออกกำลังกาย</h2>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-danger text-sm p-3 rounded-xl border border-red-100 dark:border-red-900/40">{error}</div>
      )}

      {/* Category toggle */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => handleCategoryChange(value)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              category === value
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-muted'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sub-type pills */}
      <div className="flex gap-1.5 flex-wrap">
        {(category === 'weight_training' ? WEIGHT_TYPES : CARDIO_TYPES).map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setSubType(value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              subType === value
                ? 'bg-primary/15 text-primary ring-1 ring-primary/30'
                : 'bg-gray-100 dark:bg-gray-800 text-muted hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Weight training: exercise sets */}
      {category === 'weight_training' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ท่าออกกำลังกาย</span>
            <button
              type="button"
              onClick={addSet}
              className="text-xs text-primary hover:text-primary-hover font-semibold"
            >
              + เพิ่มท่า
            </button>
          </div>
          {exerciseSets.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-1.5 items-center">
              <input
                type="text"
                value={s.exercise_name}
                onChange={(e) => updateSet(i, 'exercise_name', e.target.value)}
                placeholder="ชื่อท่า"
                className={inputClass}
              />
              <input
                type="number"
                min="1"
                value={s.sets}
                onChange={(e) => updateSet(i, 'sets', e.target.value)}
                placeholder="เซ็ต"
                className={`${inputClass} w-16 text-center`}
              />
              <input
                type="number"
                min="1"
                value={s.reps}
                onChange={(e) => updateSet(i, 'reps', e.target.value)}
                placeholder="เรป"
                className={`${inputClass} w-16 text-center`}
              />
              <input
                type="number"
                min="0"
                step="0.5"
                value={s.weight_kg}
                onChange={(e) => updateSet(i, 'weight_kg', e.target.value)}
                placeholder="kg"
                className={`${inputClass} w-16 text-center`}
              />
              {exerciseSets.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeSet(i)}
                  className="w-8 h-8 flex items-center justify-center text-muted hover:text-danger rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  &times;
                </button>
              ) : <div className="w-8" />}
            </div>
          ))}
        </div>
      )}

      {/* Cardio fields */}
      {category === 'cardio' && (
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            step="0.01"
            value={distanceKm}
            onChange={(e) => setDistanceKm(e.target.value)}
            placeholder="ระยะทาง (km)"
            className={`flex-1 min-w-0 ${inputClass}`}
          />
          {subType === 'incline_walk' && (
            <input
              type="number"
              min="0"
              max="30"
              value={inclinePercent}
              onChange={(e) => setInclinePercent(e.target.value)}
              placeholder="ความชัน %"
              className={`flex-1 min-w-0 ${inputClass}`}
            />
          )}
        </div>
      )}

      {/* Common fields */}
      <div className="flex gap-2">
        <input
          type="number"
          min="1"
          value={durationMin}
          onChange={(e) => setDurationMin(e.target.value)}
          required
          placeholder="เวลา (นาที)"
          className={`flex-1 min-w-0 ${inputClass}`}
        />
        <input
          type="number"
          min="0"
          value={caloriesBurned}
          onChange={(e) => setCaloriesBurned(e.target.value)}
          placeholder="แคลอรี่ (ไม่บังคับ)"
          className={`flex-1 min-w-0 ${inputClass}`}
        />
      </div>

      <input
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="หมายเหตุ (ไม่บังคับ)"
        className={inputClass}
      />

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
