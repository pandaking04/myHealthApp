import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useExerciseLogs(date = null) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const targetDate = date || new Date().toISOString().split('T')[0]

  useEffect(() => {
    fetchLogs()
  }, [targetDate])

  async function fetchLogs() {
    setLoading(true)
    const startOfDay = `${targetDate}T00:00:00`
    const endOfDay = `${targetDate}T23:59:59`

    const { data, error } = await supabase
      .from('exercise_logs')
      .select('*, exercise_sets(*)')
      .gte('logged_at', startOfDay)
      .lte('logged_at', endOfDay)
      .order('logged_at', { ascending: true })

    if (error) setError(error.message)
    else setLogs(data)
    setLoading(false)
  }

  async function addWeightTraining(subType, durationMin, sets, caloriesBurned, notes) {
    const { data, error } = await supabase
      .from('exercise_logs')
      .insert({
        category: 'weight_training',
        sub_type: subType,
        duration_min: durationMin,
        calories_burned: caloriesBurned || null,
        notes: notes || null,
      })
      .select()
      .single()

    if (error) return { error }

    if (sets.length > 0) {
      const { error: setsError } = await supabase
        .from('exercise_sets')
        .insert(sets.map(s => ({
          exercise_log_id: data.id,
          exercise_name: s.exercise_name,
          sets: s.sets,
          reps: s.reps,
          weight_kg: s.weight_kg,
        })))

      if (setsError) return { error: setsError }
    }

    fetchLogs()
    return { error: null }
  }

  async function addCardio(subType, durationMin, distanceKm, inclinePercent, caloriesBurned, notes) {
    const { error } = await supabase
      .from('exercise_logs')
      .insert({
        category: 'cardio',
        sub_type: subType,
        duration_min: durationMin,
        distance_km: distanceKm || null,
        incline_percent: inclinePercent || null,
        calories_burned: caloriesBurned || null,
        notes: notes || null,
      })

    if (!error) fetchLogs()
    return { error }
  }

  async function deleteLog(id) {
    const { error } = await supabase
      .from('exercise_logs')
      .delete()
      .eq('id', id)
    if (!error) fetchLogs()
    return { error }
  }

  const totalDuration = logs.reduce((sum, log) => sum + log.duration_min, 0)
  const totalCaloriesBurned = logs.reduce((sum, log) => sum + (log.calories_burned || 0), 0)

  return { logs, loading, error, addWeightTraining, addCardio, deleteLog, totalDuration, totalCaloriesBurned, refetch: fetchLogs }
}