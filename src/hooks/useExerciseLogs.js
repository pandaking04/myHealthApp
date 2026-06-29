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
      .select('*')
      .gte('logged_at', startOfDay)
      .lte('logged_at', endOfDay)
      .order('logged_at', { ascending: true })

    if (error) setError(error.message)
    else setLogs(data)
    setLoading(false)
  }

  async function addLog(type, duration_min, intensity, calories_burned) {
    const { error } = await supabase
      .from('exercise_logs')
      .insert({ type, duration_min, intensity, calories_burned: calories_burned || null })
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

  return { logs, loading, error, addLog, deleteLog, totalDuration, totalCaloriesBurned, refetch: fetchLogs }
}
